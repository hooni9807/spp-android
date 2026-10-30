// Decorative national scenes share one bounded layer; gameplay remains visible.
const WORLD_SCENES={
 china:{name:'용의 불꽃',color:'#ffb24c',kind:'flame',move:'rise',art:'M20 115Q60 10 115 75T220 40L280 20L260 50L285 65L235 70Q160 150 100 90T20 115'},
 japan:{name:'벚꽃 일섬',color:'#ffb3d4',kind:'petal',move:'dash',art:'M45 140L100 8H125L92 140ZM139 140L136 8H158L185 140M20 125L285 20'},
 germany:{name:'강철 번개',color:'#ffd16a',kind:'spark',move:'drive',art:'M20 30H280V120H20ZM65 15V135M235 15V135M170 5L110 80H160L130 145L210 60H155Z'},
 sweden:{name:'백야 오로라',color:'#78f2dc',kind:'ice',move:'sweep',art:'M0 40Q70 130 140 40T300 40M0 65Q70 155 140 65T300 65M0 90Q70 180 140 90T300 90'},
 france:{name:'은빛 펜싱',color:'#b9cfff',kind:'spark',move:'dash',art:'M15 135L280 10M45 140L285 45M10 95L245 5M210 60L245 90M225 45L260 75'},
 romania:{name:'월광 성채',color:'#d4a4ff',kind:'star',move:'sweep',art:'M180 5A65 65 0 1 0 180 140A50 50 0 0 1 180 5ZM40 140V65H65V45H90V140M210 140V45H235V65H260V140'},
 portugal:{name:'대서양 해일',color:'#67e7dd',kind:'drop',move:'sweep',art:'M0 120Q40 10 95 65Q135 100 100 30Q195 20 200 100Q245 40 300 90M0 140Q70 80 150 125T300 115'},
 austria:{name:'알프스 빙봉',color:'#c2e8ff',kind:'ice',move:'rise',art:'M0 140L75 40L115 90L180 5L300 140ZM145 55L180 5L215 55L185 42L170 65Z'},
 russia:{name:'서리 폭풍',color:'#9acaff',kind:'ice',move:'spin',art:'M150 0V150M65 25L235 125M65 125L235 25M125 20L150 45L175 20M125 130L150 105L175 130'},
 taiwan:{name:'천등과 청풍',color:'#7ee5d4',kind:'lantern',move:'dash',art:'M10 140L70 55L100 90L155 10L210 90L250 50L295 140M10 45Q90 0 150 45T295 30'},
 india:{name:'연꽃 차크라',color:'#ffbd72',kind:'petal',move:'spin',art:'M150 135Q65 80 150 5Q235 80 150 135ZM150 135Q10 130 45 35Q140 40 150 135ZM150 135Q290 130 255 35Q160 40 150 135Z'},
 brazil:{name:'열대 수목 파쇄',color:'#b3ed69',kind:'leaf',move:'rise',art:'M95 145L125 20L145 20L127 145ZM170 145L155 20L175 20L205 145M25 40Q95 0 140 30M165 30Q230 0 285 40M20 135L280 40'},
 usa:{name:'별빛 로켓',color:'#ff9d9d',kind:'star',move:'dash',art:'M150 5L173 55L230 55L185 90L200 145L150 112L100 145L115 90L70 55L127 55ZM0 40H65M235 110H300'},
 singapore:{name:'난초 분수',color:'#ffa9ca',kind:'drop',move:'rise',art:'M10 140Q80 0 150 140Q220 0 290 140M65 140Q110 25 150 140Q190 25 235 140M150 135Q85 65 150 20Q215 65 150 135Z'},
 nigeria:{name:'녹빛 독수리',color:'#80edb0',kind:'leaf',move:'drive',art:'M150 135L100 65L10 15L55 95L150 145L245 95L290 15L200 65ZM10 130L60 115L110 130L160 115L210 130L290 115'}
};
const worldParticleShapes={petal:'M0 -8Q12 -6 6 3Q0 12 -6 3Q-12 -6 0 -8',leaf:'M-8 8Q-12 -8 8 -8Q12 8 -8 8',ice:'M0 -9L7 0L0 9L-7 0Z',star:'M0 -10L3 -3L10 0L3 3L0 10L-3 3L-10 0L-3 -3Z',spark:'M-2 -12L5 -3L0 0L3 12L-5 2L0 -2Z',drop:'M0 -10Q14 7 0 10Q-14 7 0 -10',flame:'M0 -12Q10 -2 5 9Q-10 10 -6 -3Q-3 4 0 -12',lantern:'M-6 -9H6L9 -3V6L6 9H-6L-9 6V-3Z'};
for(const [id,kind,move] of [['canada','leaf','spin'],['argentina','star','sweep'],['australia','drop','rise'],['southafrica','spark','drive'],['mexico','petal','dash']]){const c=WORLD_EXPANSION[id];WORLD_SCENES[id]={name:c.theme,color:c.color,kind,move,art:c.shape};}
PATCH_NOTES.unshift(['세계정복 20개국','캐나다·아르헨티나·호주·남아프리카공화국·멕시코 선수 35명과 국가별 연출을 추가했습니다.']);
let worldSceneTimer=0;
function greenlandFrost(){return playing&&!net&&euroActive()&&euroRun.country==='greenland'?Math.min(6,Math.floor(rally/2)):0;}
const frostStepBody=stepBody;
stepBody=function(who,x,...args){const frost=greenlandFrost();if(who===me&&frost&&Number.isFinite(who.x))x=who.x+(x-who.x)*(1-frost*.04);return frostStepBody.call(this,who,x,...args);};
const frostPerson=person;
person=function(st,hip,hand,angle,look,s,...args){const result=frostPerson.call(this,st,hip,hand,angle,look,s,...args),frost=st===me?greenlandFrost():0;if(frost){ctx.save();ctx.strokeStyle='#c7fff2';ctx.fillStyle='#b4edff';ctx.globalAlpha=.12+frost*.035;ctx.lineWidth=2*s;for(let i=0;i<frost;i++){const x=st.x+(i%2?1:-1)*(8+i%3*3)*s,y=hip+(20-i*9)*s;ctx.beginPath();ctx.moveTo(x,y-10*s);ctx.lineTo(x+6*s,y);ctx.lineTo(x,y+9*s);ctx.lineTo(x-6*s,y);ctx.closePath();ctx.fill();ctx.stroke();}ctx.restore();}return result;};
let frostLevel=0,thawUntil=0;
const frostRender=render;
render=function(...args){const result=frostRender.apply(this,args),active=playing&&!net&&euroActive()&&euroRun.country==='greenland',level=greenlandFrost();if(active&&frostLevel>0&&level===0)thawUntil=performance.now()+600;frostLevel=level;if(!active){thawUntil=0;return result;}ctx.save();try{const glow=ctx.createLinearGradient(0,0,W,0);glow.addColorStop(0,`rgba(105,255,205,${.025+level*.012})`);glow.addColorStop(.5,'rgba(165,150,255,0)');glow.addColorStop(1,`rgba(180,160,255,${.025+level*.012})`);ctx.fillStyle=glow;ctx.fillRect(0,0,W,H*.28);ctx.font='12px sans-serif';ctx.textAlign='left';ctx.fillStyle='#d9fff3';ctx.fillText(`서리 ${level}/6 · 이동 둔화 ${level*4}%`,12,H-14);if(thawUntil>performance.now()&&Number.isFinite(me.x)){const t=1-(thawUntil-performance.now())/600;ctx.globalAlpha=(1-t)*.5;ctx.strokeStyle='#d7ffff';for(let i=0;i<8;i++){const a=i*Math.PI/4,x=me.x+Math.cos(a)*t*65,y=H*.8+Math.sin(a)*t*35;ctx.strokeRect(x,y,4,7);}}}finally{ctx.restore();}return result;};
PATCH_NOTES.unshift(['그린란드 서리 패시브','랠리 2회마다 서리가 쌓여 이동 둔화가 4%씩 최대 24% 적용됩니다. 오로라가 서서히 밝아지며 랠리 종료 시 해빙됩니다.']);
WORLD_SCENES.greenland={name:'극광 빙하',color:'#85efd6',kind:'ice',move:'rise',art:WORLD_EXPANSION.greenland.shape};
function clearWorldScene(){clearTimeout(worldSceneTimer);document.querySelector('.world-skill-scene')?.remove();}
function showWorldScene(id,athlete=0){
 const c=WORLD_SCENES[id],host=document.querySelector('.court-wrap');if(!c||!host)return;clearWorldScene();
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches,low=document.documentElement.classList.contains('low-spec'),count=reduced?0:low?6:16;
 const layer=document.createElement('div');layer.className='world-skill-scene';layer.dataset.country=id;layer.dataset.motion=c.move;layer.dataset.particle=c.kind;layer.setAttribute('aria-hidden','true');layer.style.setProperty('--scene-color',c.color);
 const skill=id==='china'?CHINA_PLAYERS[athlete]?.[2]:EURO_CUPS[id]?.skills[athlete];
 layer.innerHTML=`<svg viewBox="0 0 600 360" preserveAspectRatio="xMidYMid meet"><g class="world-scene-emblem" transform="translate(150 20)"><path d="${c.art}"/><path class="world-scene-slash" d="M${20+athlete*5} 135L280 ${10+athlete*4}"/></g>${Array.from({length:count},(_,j)=>{const x=20+(j*137+athlete*41)%560,y=20+(j*53)%120;return `<g transform="translate(${x} ${y})"><path class="world-scene-particle" style="--drift:${(j%2?1:-1)*(30+j*4)}px;--fall:${150+j%4*32}px;animation-delay:${j%5*40}ms" d="${worldParticleShapes[c.kind]}"/></g>`;}).join('')}</svg><div class="world-scene-caption"><span>${c.name}</span><b>${skill||c.name}</b></div>`;
 if(id==='brazil'||id==='japan'){
  const ns='http://www.w3.org/2000/svg',tree=document.createElementNS(ns,'g');tree.setAttribute('transform','translate(300 80)');
  tree.innerHTML='<path class="world-split-left" d="M-5 0L-24 0L-35 170H-5ZM-20 40Q-85 -10 -115 35Q-65 65 -20 40"/><path class="world-split-right" d="M5 0L24 0L35 170H5ZM20 40Q85 -10 115 35Q65 65 20 40"/>';
  layer.querySelector('svg').append(tree);
 }
 host.append(layer);worldSceneTimer=setTimeout(clearWorldScene,reduced?650:1350);
}
const worldSceneFire=fireUlt;fireUlt=function(u,x,y,ai=false,...args){const id=ai&&(chinaActive()?'china':euroActive()?euroRun.country:null),i=id==='china'?chinaRun.order[chinaRun.round]:id?euroRun.order[euroRun.round]:0;const result=worldSceneFire(u,x,y,ai,...args);if(id){showWorldScene(id,i);if(foe.ultMove){foe.ultMove.worldScene=id;foe.ultMove.worldAthlete=i;}}return result;};
const worldSceneBody=ultBodyOffset;ultBodyOffset=function(st,side,s){const m=st.ultMove,c=WORLD_SCENES[m?.worldScene];if(!c||matchMedia('(prefers-reduced-motion: reduce)').matches||m.owner&&ball?.owner!==m.owner)return worldSceneBody(st,side,s);const t=(performance.now()/1000-m.t-ultFinalStart(m.u))/ULT_ACTION_SEC;if(t<0||t>1)return{x:0,y:0};const a=Math.sin(Math.PI*t),v=1+(m.worldAthlete||0)*.04;const moves={rise:[-16*a,-58*a],dash:[-66*Math.sin(Math.PI*Math.min(1,t*2)), -10*a],spin:[28*Math.sin(t*Math.PI*2)*a,-18*a],sweep:[38*Math.sin(t*Math.PI*2)*a,-12*a],drive:[-30*a,-8*a]};const [x,y]=moves[c.move];return{x:side*x*s*v,y:y*s*v};};
const worldSceneHome=goHome;goHome=function(...args){clearWorldScene();return worldSceneHome.apply(this,args);};
const worldSceneResult=showResult;showResult=function(...args){clearWorldScene();return worldSceneResult.apply(this,args);};
addEventListener('pagehide',clearWorldScene);
const worldSceneStyle=document.createElement('style');worldSceneStyle.textContent=`
.world-skill-scene{position:absolute;inset:0;pointer-events:none;z-index:10;overflow:hidden;color:var(--scene-color)}
.world-skill-scene svg{width:100%;height:100%;overflow:hidden;fill:none;stroke:currentColor;stroke-width:2;opacity:.75}
.world-scene-emblem{transform-box:fill-box;transform-origin:center;animation:worldEmblem 1.2s ease-out both}
.world-scene-slash{stroke:#fff2cc;stroke-width:4;stroke-dasharray:400;animation:worldSlash .65s ease-out both}
.world-scene-particle{fill:currentColor;stroke:none;animation:worldParticle 1.2s ease-out both}
.world-skill-scene[data-country="greenland"] .world-scene-emblem{stroke-width:4;stroke:#85efd6;animation:worldAurora 1.2s ease-out both}
@keyframes worldAurora{0%{opacity:0;transform:translateY(25px)}30%{opacity:.85;stroke:#85efd6}65%{stroke:#b6a5ff;transform:translateY(-12px)}100%{opacity:0;stroke:#ddfaff;transform:translateY(-25px)}}
.world-skill-scene[data-particle="flame"] .world-scene-particle{animation-name:worldFlame}
.world-skill-scene[data-particle="spark"] .world-scene-particle{animation-name:worldLightning}
.world-skill-scene[data-particle="drop"] .world-scene-particle{animation-name:worldFountain}
.world-skill-scene[data-particle="lantern"] .world-scene-particle{animation-name:worldFlame;fill:none;stroke:currentColor}
.world-skill-scene[data-particle="star"] .world-scene-particle{animation-name:worldComet}
.world-skill-scene[data-particle="ice"] .world-scene-particle{stroke:#fff;stroke-width:.5}
.world-split-left,.world-split-right{fill:currentColor;fill-opacity:.15;stroke-width:3;transform-origin:0 170px;animation:worldSplitLeft 1.2s ease-out both}
.world-split-right{animation-name:worldSplitRight}
@keyframes worldSplitLeft{0%,25%{opacity:.6;transform:rotate(0)}100%{opacity:0;transform:translate(-80px,30px) rotate(-35deg)}}
@keyframes worldSplitRight{0%,25%{opacity:.6;transform:rotate(0)}100%{opacity:0;transform:translate(80px,30px) rotate(35deg)}}
@keyframes worldFlame{0%{opacity:0;transform:translate(0,220px) scale(.5)}25%{opacity:.85}100%{opacity:0;transform:translate(var(--drift),-40px) scale(1.8)}}
@keyframes worldLightning{0%,15%{opacity:0;transform:scaleY(.2)}25%,45%{opacity:.9;transform:scaleY(4)}100%{opacity:0;transform:translate(var(--drift),100px) scaleY(1)}}
@keyframes worldFountain{0%{opacity:0;transform:translate(0,220px)}35%{opacity:.8;transform:translate(calc(var(--drift)*.5),-10px)}100%{opacity:0;transform:translate(var(--drift),200px)}}
@keyframes worldComet{0%{opacity:0;transform:translate(-180px,-70px) scale(.3)}20%{opacity:.85}100%{opacity:0;transform:translate(200px,160px) scale(1.5) rotate(180deg)}}
.world-scene-caption{position:absolute;left:5%;top:7%;display:grid;padding:7px 14px;border-left:3px solid currentColor;background:#0b1732dc;border-radius:0 8px 8px 0;max-width:75%}.world-scene-caption span{font-size:12px}.world-scene-caption b{font-size:clamp(16px,3vw,25px);color:#fff}
@keyframes worldEmblem{0%{opacity:0;scale:.55}25%{opacity:.9;scale:1}75%{opacity:.6}100%{opacity:0;scale:1.12}}
@keyframes worldSlash{from{stroke-dashoffset:400;opacity:1}to{stroke-dashoffset:0;opacity:0}}
@keyframes worldParticle{0%{opacity:0;transform:translate(0,0) rotate(0)}15%{opacity:.8}100%{opacity:0;transform:translate(var(--drift),var(--fall)) rotate(180deg)}}
.world-skill-scene[data-country="brazil"] .world-scene-emblem>path:first-child,.world-skill-scene[data-country="japan"] .world-scene-emblem>path:first-child{stroke-width:4;stroke-dasharray:900;animation:worldSlash 1.2s ease-out both}
@media(prefers-reduced-motion:reduce){.world-skill-scene *{animation:none!important}.world-skill-scene svg{opacity:.3}.world-scene-slash{display:none}}
`;document.head.append(worldSceneStyle);
PATCH_NOTES.unshift(['세계정복 국가별 필살기 연출','15개국에 벚꽃·용의 불꽃·빙정·번개·수목 파쇄·파도 등 전용 효과와 선수별 돌진·도약 모션을 추가했습니다. 모션 감소 설정을 지원합니다.']);
