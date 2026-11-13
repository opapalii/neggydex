const { test, after } = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const fs = require('node:fs');
const { chromium } = require('playwright');
const server = http.createServer((req,res)=>{res.writeHead(200,{'Content-Type':'text/html'});res.end(fs.readFileSync('index.html'))}).listen(0,'127.0.0.1');
after(()=>server.close());
const base = age => ({t:Date.now()-age,n:Array.from({length:1025},(_,i)=>i?'pokemon'+(i+1):'bulbasaur'),ty:Array.from({length:1025},()=>['grass'])});
for(const width of [375,1440]) test(`offline, retry and cache at ${width}px`,async()=>{
  const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
  try{
    const page=await browser.newPage({viewport:{width,height:800}});let online=false;
    await page.route('https://**/*',async route=>{
      const url=route.request().url();
      if(online&&url.includes('/pokemon-species?'))return route.fulfill({json:{results:base(0).n.map(name=>({name}))}});
      if(online&&url.includes('/api/v2/type/'))return route.fulfill({json:{pokemon:[]}});
      return route.abort();
    });
    await page.goto(`http://127.0.0.1:${server.address().port}`);
    await page.getByRole('button',{name:'Reintentar'}).waitFor();
    assert.match(await page.locator('#dex-status').innerText(),/No se pudieron/);
    await page.locator('#t-calc').click();await page.locator('#mv-pow').fill('80');await page.locator('#mv-pow').dispatchEvent('input');assert.ok(await page.locator('#res .big').count());
    await page.locator('#t-dex').click();online=true;await page.getByRole('button',{name:'Reintentar'}).click();await page.waitForSelector('.card');
    assert.equal(await page.locator('#chips .chip').count(),18);
    await page.locator('#q').fill('bulbasaur');await page.waitForTimeout(250);assert.equal(await page.locator('.card').count(),1);
    assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('neggydex_base_v1')).n.length),1025);
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
    online=false;await page.reload();await page.waitForSelector('.card');assert.equal(await page.locator('#dex-status').innerText(),'');
    await page.evaluate(c=>localStorage.setItem('neggydex_base_v1',JSON.stringify(c)),base(1300000000));await page.reload();await page.waitForSelector('.card');assert.match(await page.locator('#dex-status').innerText(),/desactualizados/);
  }finally{await browser.close()}
});
