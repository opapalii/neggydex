const {test, after} = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const fs = require('node:fs');
const {chromium} = require('playwright');
const server = http.createServer((req,res)=>{res.writeHead(200,{'Content-Type':'text/html'});res.end(fs.readFileSync('index.html'))}).listen(0,'127.0.0.1');
after(()=>server.close());
for(const width of [375,768,1440]) test(`trainer presentation at ${width}px`,async()=>{
  const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
  try{
    const page=await browser.newPage({viewport:{width,height:width===375?812:900},reducedMotion:'reduce'});
    await page.route('https://**/*',route=>route.abort());
    await page.addInitScript(()=>localStorage.setItem('neggydex_base_v1',JSON.stringify({t:Date.now(),n:Array.from({length:1025},(_,i)=>i?'pokemon'+(i+1):'bulbasaur'),ty:Array.from({length:1025},()=>['grass'])})));
    await page.goto(`http://127.0.0.1:${server.address().port}`,{waitUntil:'domcontentloaded'});
    await page.waitForSelector('.card');await page.locator('#t-battle').click();
    await page.evaluate(()=>{BE.act=()=>({id:1,name:'Bulbasaur',types:['grass']});B.a={team:[{}]};UI.intro({cls:'Entrenador',name:'Marco',quote:'¡Que gane el mejor!',src:drawTrainer(TRN.kinds[0],{skin:'#e9b98c',hair:'#2b1e1a',s:'#3f7fe0',j:'#e8556f',c2:'#34a88a',p:'#2e3b66',hat:'#e8556f'})})});
    const sprite=page.locator('.trainer-portrait img');await sprite.waitFor();
    const info=await sprite.evaluate(e=>({naturalWidth:e.naturalWidth,naturalHeight:e.naturalHeight,width:e.getBoundingClientRect().width,height:e.getBoundingClientRect().height,render:getComputedStyle(e).imageRendering,animation:getComputedStyle(e).animationName}));
    assert.equal(info.naturalWidth,34);assert.equal(info.naturalHeight,48);assert.equal(info.width/34,info.height/48);assert.equal(info.width%34,0);assert.equal(info.render,'pixelated');assert.equal(info.animation,'none');
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
    await page.getByRole('button',{name:/Saltar/}).click();await page.waitForFunction(()=>document.querySelector('#bt-intro').hidden);
    assert.equal(await page.locator('#bt-intro').isHidden(),true);
  }finally{await browser.close()}
});
