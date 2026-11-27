const {test} = require('node:test');
const assert = require('node:assert/strict');
const {chromium} = require('playwright');
const {readFileSync} = require('node:fs');

test('memory locks mismatches, completes with keyboard and saves records by difficulty', async () => {
  const browser = await chromium.launch({executablePath:process.env.CHROMIUM_PATH || '/usr/bin/chromium',args:['--no-sandbox']});
  try {
    const page = await browser.newPage({viewport:{width:375,height:812},reducedMotion:'reduce'});
    await page.route('https://**/*',route=>route.abort());
    await page.route('http://memory.test/',route=>route.fulfill({contentType:'text/html',body:readFileSync('index.html')}));
    await page.addInitScript(()=>localStorage.setItem('neggydex_base_v1',JSON.stringify({
      t:Date.now(),n:Array.from({length:1025},(_,i)=>'pokemon'+(i+1)),ty:Array(1025).fill(['grass'])
    })));
    await page.goto('http://memory.test/');
    await page.waitForSelector('.card');
    await page.locator('#t-games').click();
    await page.getByRole('button',{name:'Jugar a Memoria'}).click();
    const cards = page.locator('.memory-card');
    const ids = await page.evaluate(()=>memory.cards.map(mon=>mon.id));
    const different = ids.findIndex(id=>id!==ids[0]);
    await cards.nth(0).press('Enter');
    await cards.nth(different).press('Enter');
    await cards.nth(ids.lastIndexOf(ids[0])).press('Enter');
    assert.equal(await page.locator('.memory-card.revealed').count(),2);
    await page.locator('.memory-card.revealed').first().waitFor({state:'detached'});
    for(const id of new Set(ids)){
      await cards.nth(ids.indexOf(id)).press('Space');
      await cards.nth(ids.lastIndexOf(id)).press('Space');
    }
    await page.getByText('¡Tablero completo en 5 turnos! Nuevo récord personal.').waitFor();
    assert.equal(await page.locator('.memory-card.matched').count(),8);
    await page.getByRole('button',{name:'Jugar otra vez'}).click();
    await page.getByText('Récord: 5 turnos').waitFor();
    await page.getByLabel('Parejas').selectOption('8');
    assert.equal(await cards.count(),16);
    await page.getByText('Récord: —').waitFor();
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
    await page.reload();
    await page.locator('#t-games').click();
    await page.getByRole('button',{name:'Jugar a Memoria'}).click();
    await page.getByText('Récord: 5 turnos').waitFor();
  } finally {await browser.close()}
});
