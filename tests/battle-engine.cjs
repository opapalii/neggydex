const {test} = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const {readFileSync} = require('node:fs');

const html = readFileSync('index.html','utf8');
const engine = html.slice(html.indexOf('const EXCL='),html.indexOf('const BD='));
const damage = html.slice(html.indexOf('const baseDamage='),html.indexOf('function calc(){'));

function battle(){
  const context = vm.createContext({});
  const state = vm.runInContext(`
    const CH={electric:{ground:0}};
    const events=[];
    const UI=new Proxy({}, {get:(_,name)=>async (...args)=>events.push([name,...args])});
    ${damage}
    ${engine}
    const pokemon=(name, types=['normal'])=>({
      name,types,hp:160,maxHp:160,lv:50,st:{atk:70,def:70,spa:70,spd:70,spe:70},
      stg:zeroStages(),mv:[move('tackle')],tx:1
    });
    function move(slug,options={}){
      return {slug,n:slug,t:'normal',c:'physical',a:100,p:40,pp:10,pr:0,crit:0,st:[],...options};
    }
    const p=pokemon('Jugador'),a=pokemon('Rival');
    B.p.team=[p];B.a.team=[a];
    let seed=2026;
    Math.random=()=>((seed=(Math.imul(1664525,seed)+1013904223)>>>0)/2**32);
    ({BE,BAI,B,p,a,move,events})
  `,context);
  return {...state,random:value=>{context.roll=value;vm.runInContext('Math.random=()=>roll',context)}};
}

test('accuracy stages, Thunder Wave immunity and Gen VI burn / paralysis',async()=>{
  const {BE,p,a,move,random}=battle();
  await BE.stages('p',[['accuracy',-1]]);
  assert.equal(BE.accuracy(p,a,p.mv[0]),75);
  random(.8);
  await BE.exec('p',p.mv[0]);
  assert.equal(a.hp,160);
  assert.equal(p.mv[0].pp,9);
  a.types=['ground'];
  await BE.exec('p',move('thunder-wave',{t:'electric',c:'status',ail:'paralysis',a:null}));
  assert.equal(a.status,undefined);
  p.status='brn';
  a.status='par';
  assert.equal(BE.eff(a,'spe'),17.5);
  await BE.endTurn();
  assert.equal(p.hp,140);
});

test('Protect blocks this turn, can fail on repeat and expires the following turn',async()=>{
  const {BE,p,a,move,random,events}=battle();
  p.mv.push(move('protect',{c:'status',pr:4,tg:'user',a:null}));
  await BE.turn({t:'move',i:1},{t:'move',i:0});
  assert.equal(p.hp,160);
  assert.ok(events.some(([,line])=>typeof line==='string'&&line.includes('bloqueó')));
  random(.9);
  await BE.turn({t:'move',i:1},{t:'move',i:0});
  assert.ok(p.hp<160);
  assert.equal(p.protectStreak,0);
  const hp=p.hp;
  await BE.turn({t:'move',i:0},{t:'move',i:0});
  assert.ok(p.hp<hp);
  assert.equal(p.mv[1].pp,8);
});

test('Choice lock with exhausted PP forces Struggle and critical ignores adverse stages',async()=>{
  const {BE,BAI,p,a,move}=battle();
  a.item={k:'choiceband'};
  a.lock=0;
  a.mv[0].pp=0;
  a.mv.push(move('other'));
  assert.equal(BE.canSelect(a,1),false);
  assert.equal(BAI.chooseMove(a,p,'hard').i,-1);
  assert.equal(BE.moveOf('a',-1).slug,'struggle');
  const crit=BE.calc(p,a,p.mv[0],{crit:true}).dmg;
  p.stg.atk=-2;
  a.stg.def=2;
  assert.equal(BE.calc(p,a,p.mv[0],{crit:true}).dmg,crit);
  assert.ok(BE.calc(p,a,p.mv[0]).dmg<crit);
});

test('a knockout ends combat and cancels the slower action',async()=>{
  const {BE,B,p,a,random}=battle();
  random(.5);
  p.st.spe=200;
  a.hp=1;
  await BE.turn({t:'move',i:0},{t:'move',i:0});
  assert.equal(B.over,'p');
  assert.equal(a.fainted,true);
  assert.equal(a.mv[0].pp,10);
  assert.equal(p.hp,160);
});
