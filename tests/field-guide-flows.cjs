const {test,after}=require('node:test');const assert=require('node:assert/strict');const http=require('node:http'),fs=require('node:fs');const {chromium}=require('playwright');
const server=http.createServer((q,r)=>{r.writeHead(200,{'Content-Type':'text/html'});r.end(fs.readFileSync('index.html'))}).listen(0,'127.0.0.1');after(()=>server.close());
const mon=id=>({id,name:id===1?'bulbasaur':'ivysaur',height:7,weight:69,stats:['hp','attack','defense','special-attack','special-defense','speed'].map(name=>({base_stat:50,stat:{name}})),types:[{type:{name:'grass'}}],abilities:[],moves:[],sprites:{front_default:null,other:{'official-artwork':{front_default:null}}}});
test('team edits persist, calculator works and wordle accepts a guess',async()=>{const b=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox']});try{const p=await b.newPage({viewport:{width:768,height:900},reducedMotion:'reduce'});await p.route('https://**/*',r=>{const match=r.request().url().match(/\/api\/v2\/pokemon\/(\d+)$/);return match?r.fulfill({json:mon(+match[1])}):r.abort()});await p.addInitScript(()=>localStorage.setItem('neggydex_base_v1',JSON.stringify({t:Date.now(),n:Array.from({length:1025},(_,i)=>i===0?'bulbasaur':i===1?'ivysaur':'pokemon'+(i+1)),ty:Array.from({length:1025},()=>['grass'])})));await p.goto(`http://127.0.0.1:${server.address().port}`,{waitUntil:'domcontentloaded'});await p.waitForSelector('.card');await p.locator('#t-team').click();await p.locator('#sp0').fill('bulbasaur');await p.locator('#sp0').press('Enter');await p.locator('#slots .slot:not(.empty)').waitFor();await p.locator('#t-name').fill('Exploración');await p.getByRole('button',{name:'💾 Guardar',exact:true}).click();await p.locator('#sp0').fill('ivysaur');await p.locator('#sp0').press('Enter');await p.waitForFunction(()=>document.querySelector('#slots .nm')?.textContent.toLowerCase()==='ivysaur');await p.getByRole('button',{name:'💾 Guardar',exact:true}).click();await p.reload();await p.waitForSelector('#slots .slot:not(.empty)');assert.equal(await p.locator('#t-name').inputValue(),'Exploración');assert.match(await p.locator('#slots .nm').first().innerText(),/ivysaur/i);await p.locator('#t-calc').click();await p.locator('#mv-pow').fill('80');await p.locator('#mv-pow').dispatchEvent('input');assert.match(await p.locator('#res .big').innerText(),/PS/);await p.locator('#t-games').click();await p.getByRole('button',{name:/Pokéwordle/}).first().click();const key=await p.evaluate(()=>WG.key);await p.keyboard.type(key);await p.keyboard.press('Enter');await p.waitForSelector('#w-end .endc',{timeout:12000});assert.equal(await p.evaluate(()=>JSON.parse(localStorage.getItem('neggydex_games_v1')).w.won),1)}finally{await b.close()}});

test('evolution retry, team order and manual damage input', async () => {
  const browser = await chromium.launch({executablePath:process.env.CHROMIUM_PATH || '/usr/bin/chromium',args:['--no-sandbox']});
  try {
    const page = await browser.newPage({viewport:{width:375,height:812}});
    page.setDefaultTimeout(8000);
    const api = 'https://pokeapi.co/api/v2/';
    const species = (id,name) => ({name,url:api+'pokemon-species/'+id+'/'});
    const chain = {species:species(1,'bulbasaur'),evolves_to:[{
      species:species(2,'ivysaur'),evolution_details:[{trigger:{name:'level-up'},min_level:16}],evolves_to:[]
    }]};
    let attempts = 0;
    await page.route('https://**/*', route => {
      const url = route.request().url();
      if(url.includes('/pokemon-species/')) return route.fulfill({json:{evolution_chain:{url:api+'evolution-chain/1/'}}});
      if(url.includes('/evolution-chain/')) return ++attempts===1 ? route.abort() : route.fulfill({json:{chain}});
      const hit = url.match(/\/pokemon\/(\d+)$/);
      return hit ? route.fulfill({json:mon(+hit[1])}) : route.abort();
    });
    await page.addInitScript(()=>localStorage.setItem('neggydex_base_v1',JSON.stringify({
      t:Date.now(),n:Array.from({length:1025},(_,i)=>['bulbasaur','ivysaur'][i]||'pokemon'+i),ty:Array(1025).fill(['grass'])
    })));
    await page.goto('http://127.0.0.1:'+server.address().port);
    await page.locator('.card').first().click();
    await page.getByRole('button',{name:'Reintentar evolución'}).click();
    await page.getByText('Nivel 16',{exact:false}).first().waitFor();
    await page.locator('#evo .en').nth(1).press('Enter');
    await page.getByRole('button',{name:'Añadir al equipo'}).click();
    await page.locator('#t-name').fill('Ruta verde');
    await page.getByRole('button',{name:'Mover a la posición siguiente'}).click();
    await page.reload();
    await page.locator('#t-team').click();
    assert.match(await page.locator('#slots .slot').nth(1).innerText(),/ivysaur/i);
    assert.equal(await page.locator('#t-name').inputValue(),'Ruta verde');
    await page.locator('#t-calc').click();
    await page.locator('#mv-pow').fill('80');
    await page.locator('#res .big').waitFor();
    await page.locator('#mv-pow').fill('');
    assert.match(await page.locator('#res').innerText(),/potencia mayor/);
  } finally {await browser.close()}
});
