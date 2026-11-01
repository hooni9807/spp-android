// Local doubles: the player controls 1P; the partner trains independently.
const partnerLevel=k=>Math.max(0,Math.min(20,Math.floor(Number(prog.q?.['partner_'+k]?.n)||0)));
const partnerCost=k=>100+partnerLevel(k)*50;
const trainingStyle=document.createElement('style');
trainingStyle.textContent='#partner-training{position:fixed}#partner-training header{display:flex;align-items:center;gap:14px}#partner-training header canvas{width:64px;height:64px;background:#ffffff0a;border-radius:50%}#partner-training h3{padding-right:40px}#partner-training p{font-size:13px;line-height:1.65;color:#b9c8de}#partner-training small{line-height:1.8;color:#c5d7ea}#partner-training .dlg-x{position:absolute;right:12px;top:12px}#partner-training button:focus-visible,[data-training]:focus-visible{outline:3px solid white;outline-offset:3px}[data-training]{width:100%;margin-bottom:14px;cursor:pointer}';
document.head.append(trainingStyle);
// Keep the close control inside the dialog's visible scroll area.
trainingStyle.textContent+='#partner-training .dlg-x{position:sticky;top:0;right:auto;float:right;z-index:5;width:44px;height:44px;margin-bottom:-44px;box-shadow:0 3px 12px #0006}';
const manualPartnerHit=hit;
hit=function(...args){if(mode==='doubles'&&!net&&doublesCourtActor()==='mate')return;return manualPartnerHit(...args);};
const partnerUpdate=update;
update=function(dt){partnerUpdate(dt);if(mode!=='doubles'||net||!playing||paused||!ball||performance.now()<ultHoldUntil)return;
 if(ball.held&&ball.mateServe){
  if(!ball.tossed)toss();
  if(serveTiming(ball)!=='perfect')return;
  const plan=P.planServe(0,2.4,ball.x,ball.z,-.3);
  if(!plan)return;
  Object.assign(ball,plan,{held:false,tossed:false,serving:true,type:'serve',owner:'you',bounces:0,spin:0,side:0});
  mate.swingT=time;mate.swingType='drive';mySwing.t=-10;myTurn='me';trail=[];beep(390);return;
 }
 if(ball.owner!=='ai'||ball.bounces!==1||myTurn!=='mate'||ball.mateTried||!['perfect','late'].includes(P.timing(ball)))return;
 ball.mateTried=true;const lv=partnerLevel(mateChar),rate=P.aiChance(ball,'b7',false,null,P.RETURN_BASE.easy)+lv*.012;
 if(Math.random()>Math.min(.95,rate))return;
 const kind=ball.chance?'smash':P.incoming(ball)==='cut'?'cut':'drive',shot=P.aiReturn(kind,-ball.x,2.74-ball.y,ball.z,1.9+lv*.05,0),u=mateCharge>=100?mateUlt(ball):null;
 Object.assign(ball,{vx:-shot.vx,vy:-shot.vy,vz:shot.vz,spin:shot.spin,side:-shot.side,type:shot.type,owner:'you',bounces:0,aiAttempt:false,mateTried:false,dual:false,dualHit:false,ult:null,defMiss:0,kill:kind==='smash',power:false,serving:false,unreturn:false,miss:false,chance:false,lob:false,shortCut:false,curve:0,quadNext:null,pre:null});
 if(u){Object.assign(ball,ultLandGuard(ultApply(u,ball,ball),ball),{ult:u.id});const q=project(ball.x,ball.y,ball.z);fireUlt(u,q.x,q.y,false,mateChar);mateCharge=0;}else mateCharge=Math.min(100,mateCharge+10);
 mate.swingT=time;mate.swingType=kind;mySwing.t=-10;myTurn='me';rally++;best=Math.max(best,rally);doublesHarmonyHit('mate');updateScore();updateSpecial();beep(390);
};
function openPartnerTraining(){
 let d=document.getElementById('partner-training');
 if(!d){d=document.createElement('dialog');d.id='partner-training';d.setAttribute('aria-labelledby','partner-training-title');document.body.append(d);}
 const coins=Math.max(0,Number(prog.coins)||0),owned=unlockedCharacters().filter(k=>k!==charType&&characterAvailable(k));
 const rows=owned.map(k=>{const lv=partnerLevel(k),next=Math.min(20,lv+1);return `<section><header><canvas data-face="${k}" width="64" height="64"></canvas><div><b>${LOOKS[k].nick||LOOKS[k].name}</b><br><span>AI Lv.${lv} / 20</span></div></header><progress aria-label="훈련 단계" value="${lv}" max="20"></progress><small>리턴 보정 +${(lv*1.2).toFixed(1)}%p → +${(next*1.2).toFixed(1)}%p<br>타구 속도 ${(1.9+lv*.05).toFixed(2)} → ${(1.9+next*.05).toFixed(2)}</small><button data-train="${k}" ${lv>=20||coins<partnerCost(k)?'disabled':''}>${lv>=20?'최고 단계 달성':partnerCost(k)+' 스핀코인 · 강화'}</button></section>`;}).join('');
 d.innerHTML=`<button class="dlg-x" aria-label="닫기">×</button><h3 id="partner-training-title">복식 파트너 훈련</h3><p>이지 실력에서 시작하는 나만의 파트너<br>캐릭터별 20단계 · 강화 성공률 100%</p><strong>보유 ${coins.toLocaleString()} 스핀코인</strong><p>공의 회전과 종류에 따라 실제 리턴률이 달라집니다.</p>${rows||'<p>함께할 캐릭터를 먼저 해금하세요.</p>'}`;
 d.querySelector('.dlg-x').onclick=()=>d.close();
 d.querySelectorAll('[data-face]').forEach(c=>drawFace(c,LOOKS[c.dataset.face]));
 d.querySelectorAll('[data-train]').forEach(b=>b.onclick=()=>{
  const k=b.dataset.train,lv=partnerLevel(k),cost=partnerCost(k);
  if(!charUnlocked(k)||!characterAvailable(k)||lv>=20||!Number.isFinite(prog.coins)||prog.coins<cost)return;
  prog.coins-=cost;prog.q??={};prog.q['partner_'+k]={n:lv+1,t:0};saveProg();openPartnerTraining();
  d.querySelector(`[data-train="${k}"]`)?.focus();
 });
 if(!d.open)d.showModal();
}
const trainingPartnerSelect=openDoublesPartner;openDoublesPartner=function(...args){trainingPartnerSelect(...args);const d=document.getElementById('doubles-partner');if(!d)return;d.querySelector('.dbl-copy').textContent='1P는 직접 조작하고 2P는 AI가 자동으로 타격합니다. 파트너를 훈련해 실력을 높이세요.';if(!d.querySelector('[data-training]')){const b=document.createElement('button');b.dataset.training='1';b.textContent='파트너 AI 강화';b.onclick=openPartnerTraining;d.querySelector('.dbl-grid').before(b);}};
{const s=document.createElement('style');s.textContent='#partner-training{width:min(520px,94vw);max-height:85vh;overflow:auto;border:1px solid #627ca4;border-radius:20px;background:#101b30;color:#edf6ff;padding:22px}#partner-training::backdrop{background:#050915bd}#partner-training section{display:grid;gap:10px;padding:16px;margin:12px 0;background:#1b2b46;border-radius:12px}#partner-training progress{width:100%;accent-color:#65e2c0}#partner-training button,[data-training]{padding:12px;border:0;border-radius:9px;background:#65e2c0;color:#102336;font-weight:800}#partner-training button:disabled{opacity:.45}';document.head.append(s);}
// PixelFX is deliberately loaded only for ultimate casts.
{const s=document.createElement('script');s.src='pixelfx-runtime.js?v=2';s.defer=true;document.head.append(s);}
