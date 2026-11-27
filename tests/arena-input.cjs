const {test} = require('node:test');
const assert = require('node:assert/strict');
const {chromium} = require('playwright');
const {readFileSync} = require('node:fs');

test('arena input, forced replacement and surrender before and after attacking', async () => {
  const browser = await chromium.launch({executablePath:process.env.CHROMIUM_PATH || '/usr/bin/chromium',args:['--no-sandbox']});
  try {
    const page = await browser.newPage({viewport:{width:375,height:812}});
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('dialog', dialog => dialog.accept());
    await page.route('https://**/*', route => route.abort());
    await page.route('http://arena.test/', route => route.fulfill({contentType:'text/html',body:readFileSync('index.html')}));
    await page.addInitScript(() => localStorage.setItem('neggydex_base_v1', JSON.stringify({
      t:Date.now(),n:Array(1025).fill('bulbasaur'),ty:Array(1025).fill(['grass'])
    })));
    await page.goto('http://arena.test/');
    await page.waitForSelector('.card');
    const destination = page.locator('nav [aria-current="page"]');
    await destination.focus();
    await page.keyboard.press('End');
    assert.equal(await destination.getAttribute('id'),'t-games');
    await page.keyboard.press('ArrowLeft');
    assert.equal(await destination.getAttribute('id'),'t-battle');
    assert.equal(await page.locator('#v-battle').isVisible(),true);
    await page.evaluate(() => {
      let seed = 2026;
      Math.random = () => ((seed = (Math.imul(1664525, seed) + 1013904223) >>> 0) / 2**32);
      const move = {slug:'tackle',n:'Placaje',t:'normal',c:'physical',p:40,a:100,pp:35,max:35,pr:0,crit:0,st:[]};
      const mon = {id:1,key:'bulbasaur',name:'Bulbasaur',lv:50,types:['grass'],st:{atk:70,def:70,spa:70,spd:70,spe:70},hp:160,maxHp:160,mv:[move],stg:{atk:0,def:0,spa:0,spd:0,spe:0}};
      BD.plan = async () => [{id:1,slugs:['tackle']}];
      BD.mon = async () => structuredClone(mon);
      BT.team = [{id:1,mv:[move]}];
      B.fast = true;
      btRender();
    });
    for (const turns of [0,1]) {
      await page.locator('#bt-go').click();
      await page.getByRole('button',{name:/Saltar/}).click();
      const surrender = page.locator('#bt-ctl .lnk').filter({hasText:'Rendirse'});
      await surrender.waitFor();
      if (turns) {
        const history = page.locator('#bt-history');
        assert.equal(await history.evaluate(el=>el.open),false);
        await history.locator('summary').click();
        assert.match(await page.locator('#bt-log').innerText(),/Turno 1/i);
        await page.getByLabel('Animaciones',{exact:true}).selectOption('off');
        await history.locator('summary').click();
        assert.equal(await page.locator('#bt-game').getAttribute('data-still'),'');
        await page.keyboard.press('c');
        assert.equal(await surrender.isVisible(),true);
        await page.keyboard.press('a');
        await page.locator('#bt-ctl .mc').first().click();
        await surrender.waitFor();
        assert.equal(await page.evaluate(()=>BE.act('p').mv[0].pp),34);
        await history.locator('summary').click();
        assert.match(await page.locator('#bt-log').innerText(),/usó Placaje/);
        assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
      }
      await surrender.click();
      await page.getByText('Te has rendido.',{exact:true}).waitFor();
      assert.equal(await page.evaluate(()=>B.turn),turns);
      await page.getByRole('button',{name:'Volver al menú'}).click();
    }
    await page.evaluate(() => {
      B.p.team.push(structuredClone(B.p.team[0]));
      B.p.team[0].fainted = true;
      UI.open();
      UI.forceSwitch().then(index => window.selectedReplacement = index);
    });
    await page.keyboard.press('Escape');
    await page.locator('.sw:enabled').click();
    assert.equal(await page.evaluate(()=>window.selectedReplacement),1);
    assert.deepEqual(errors,[]);
  } finally {await browser.close()}
});
