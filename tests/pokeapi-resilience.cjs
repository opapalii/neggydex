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

test('cached data is usable during refresh; filters, favorites and detail retry work',async()=>{
  const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
  try{
    const page=await browser.newPage({viewport:{width:375,height:800}});let detailsAvailable=false;let release;
    const pending=new Promise(resolve=>release=resolve);
    await page.route('https://**/*',async route=>{
      const url=route.request().url();
      if(url.includes('pokemon-species?limit=1025')||url.includes('/api/v2/type/')){await pending;return route.abort()}
      if(url.endsWith('/api/v2/pokemon/1')&&detailsAvailable)return route.fulfill({json:{id:1,height:7,weight:69,stats:[{base_stat:45,stat:{name:'hp'}}],abilities:[]}});
      return route.abort();
    });
    await page.addInitScript(c=>localStorage.setItem('neggydex_base_v1',JSON.stringify(c)),base(1300000000));
    await page.goto(`http://127.0.0.1:${server.address().port}`,{waitUntil:'domcontentloaded'});
    await page.waitForSelector('.card');assert.match(await page.locator('#dex-status').innerText(),/buscando actualizaciones/);
    await page.locator('#q').fill('bulbasaur');await page.waitForTimeout(250);assert.equal(await page.locator('.card').count(),1);
    await page.locator('.card .fav').click();await page.locator('#gens .fchip').click();assert.equal(await page.locator('.card').count(),1);
    await page.locator('#chips .chip').filter({hasText:'Fuego'}).click();assert.equal(await page.locator('.card').count(),0);
    await page.locator('#chips .chip').filter({hasText:'Fuego'}).click();await page.locator('.card').first().click();
    await page.getByRole('button',{name:'Reintentar ficha'}).waitFor();detailsAvailable=true;await page.getByRole('button',{name:'Reintentar ficha'}).click();await page.waitForSelector('#mstats .stat');
    assert.match(await page.locator('#mh-name').innerText(),/bulbasaur/i);
    await page.locator('#md .x').click();await page.locator('#t-calc').click();assert.equal(await page.locator('#v-calc').evaluate(e=>e.classList.contains('on')),true);
    await page.locator('#t-dex').click();assert.equal(await page.locator('.card').count(),1);
    release();await page.getByRole('button',{name:'Reintentar',exact:true}).waitFor();
  }finally{await browser.close()}
});
