// National kit references are recorded in docs/europe-art-direction.md.
// Fictional athletes: appearance varies by individual, not a national facial stereotype.
const EURO_KITS={
 germany:{base:'#b51b67',trim:'#201c32',accent:'#e9519b',code:'GER'},
 sweden:{base:'#f4d72c',trim:'#19559b',accent:'#247bbd',code:'SWE'},
 france:{base:'#132f5b',trim:'#e4354e',accent:'#eef5ff',code:'FRA'},
 romania:{base:'#f1d82e',trim:'#174b9c',accent:'#db3038',code:'ROU'},
 portugal:{base:'#177650',trim:'#ae2039',accent:'#edc966',code:'POR'},
 austria:{base:'#d42636',trim:'#20232c',accent:'#faf1e6',code:'AUT'}
};
function drawNationalKit(g,look,x,y,h,s){
 const k=EURO_KITS[look.nationalKit];if(!k)return;
 g.save();g.translate(x,y);g.scale(s,h/64);g.fillStyle=k.base;g.fillRect(-32,0,64,64);
 g.fillStyle=k.trim;
 const poly=(points,color)=>{g.fillStyle=color;g.beginPath();points.forEach(([a,b],i)=>i?g.lineTo(a,b):g.moveTo(a,b));g.closePath();g.fill();};
 switch(look.nationalKit){
 case 'germany':poly([[-32,0],[-19,0],[-11,64],[-32,64]],k.trim);for(let i=0;i<7;i++)poly([[-25,26+i*6],[25,17+i*6],[25,20+i*6],[-25,29+i*6]],i%2?k.accent:'#8c1b55');break;
 case 'sweden':poly([[-32,0],[-20,0],[-14,64],[-32,64]],k.trim);poly([[20,0],[32,0],[32,64],[14,64]],k.trim);g.fillStyle=k.accent;g.fillRect(-27,3,54,3);break;
 case 'france':for(let i=0;i<8;i++)poly([[-30,i*9],[30,i*9-10],[30,i*9-8],[-30,i*9+2]],'#25416a');poly([[-32,0],[-20,0],[-15,64],[-24,64]],k.trim);poly([[22,0],[26,0],[20,64],[16,64]],k.accent);break;
 case 'romania':poly([[-32,0],[-12,0],[-21,35],[-32,48]],k.trim);poly([[22,0],[32,0],[32,64],[13,64]],k.trim);for(let i=0;i<4;i++)poly([[-30,37+i*6],[3,57+i*6],[-2,59+i*6],[-30,41+i*6]],k.accent);break;
 case 'portugal':poly([[-32,0],[-4,0],[-16,64],[-32,64]],k.trim);g.strokeStyle='#2c9870';g.lineWidth=1;for(let i=0;i<6;i++){g.beginPath();g.moveTo(-7,20+i*8);g.quadraticCurveTo(9,12+i*8,30,24+i*8);g.stroke();}break;
 case 'austria':poly([[-32,0],[32,0],[32,16],[-32,16]],k.trim);for(let i=0;i<5;i++)poly([[-30,28+i*8],[30,17+i*8],[30,20+i*8],[-30,31+i*8]],'#a31d2f');break;
 }
 // Woven seams and small country badge remain readable at gameplay scale.
 g.strokeStyle='#ffffff45';g.lineWidth=.6;g.beginPath();g.moveTo(-17,10);g.lineTo(-14,60);g.moveTo(17,10);g.lineTo(14,60);g.stroke();
 g.fillStyle=k.accent;g.fillRect(5,12,10,7);g.fillStyle=k.trim;g.font='bold 4px Arial';g.textAlign='center';g.fillText(k.code,10,17);g.restore();
}
function euroPortrait(id,n,i){
 const k=EURO_KITS[id],skin=['#efc5a4','#d6a27f','#b67e59','#f2d2b8'][(n+i)%4],hair=['#372c29','#bd8b43','#714333','#252735','#9b7860'][(n+2*i)%5];
 const w=39+(i%3)*4,jaw=20+(i*3+n)%16,eyeY=97+(i%2)*3,eye='#'+['4b6859','4a6380','654b35'][i%3];
 const glasses=i===2?'<g fill="none" stroke="#293c4c" stroke-width="3"><rect x="51" y="91" width="31" height="22" rx="7"/><rect x="98" y="91" width="31" height="22" rx="7"/><path d="M82 99H98"/></g>':'';
 const beard=i===6?`<path d="M49 112Q55 155 90 158Q126 154 132 112L120 131L106 139L90 136L75 140L60 129Z" fill="${hair}" opacity=".85"/>`:'';
 const mouth=i%3===0?'M75 127Q91 138 107 126':i%3===1?'M77 130Q91 127 104 130':'M76 128L105 128';
 return {skin,hair,svg:`<svg xmlns="http://www.w3.org/2000/svg" width="180" height="190" viewBox="0 0 180 190"><defs><linearGradient id="f" x2="1" y2="1"><stop stop-color="${skin}"/><stop offset="1" stop-color="${skin}" stop-opacity=".82"/></linearGradient></defs><path d="M67 139H113V164L155 190H25L67 164Z" fill="${skin}"/><path d="M25 190L62 160L90 175L118 160L155 190" fill="${k.base}" stroke="${k.trim}" stroke-width="7"/><ellipse cx="${90-w}" cy="100" rx="9" ry="15" fill="${skin}"/><ellipse cx="${90+w}" cy="100" rx="9" ry="15" fill="${skin}"/><path d="M${90-w} 67Q90 27 ${90+w} 67L${90+w-2} 112Q${90+jaw} 152 90 155Q${90-jaw} 152 ${92-w} 112Z" fill="url(#f)" stroke="#76594b" stroke-width="1.5"/><path d="M53 91L79 ${i%2?89:85}M101 ${i%2?89:85}L127 91" fill="none" stroke="${hair}" stroke-width="4" stroke-linecap="round"/><g fill="#fff8ef" stroke="#664c43" stroke-width="1.5"><path d="M55 ${eyeY}Q68 ${eyeY-9} 80 ${eyeY}Q68 ${eyeY+8} 55 ${eyeY}Z"/><path d="M100 ${eyeY}Q113 ${eyeY-9} 126 ${eyeY}Q113 ${eyeY+8} 100 ${eyeY}Z"/></g><g fill="${eye}"><circle cx="69" cy="${eyeY}" r="5"/><circle cx="112" cy="${eyeY}" r="5"/></g><g fill="#fff"><circle cx="70" cy="${eyeY-2}" r="1.6"/><circle cx="113" cy="${eyeY-2}" r="1.6"/></g><path d="M89 100L${84+i%4} 117L96 118" fill="none" stroke="#ac785c" stroke-width="2"/>${beard}<path d="${mouth}" fill="none" stroke="#834e46" stroke-width="2.5" stroke-linecap="round"/><path d="${hairShapes[(i+n)%7]}" fill="${hair}" stroke="#342a2a" stroke-width="1.5"/><path d="M53 62Q79 35 118 48" fill="none" stroke="#ffffff25" stroke-width="4"/>${glasses}${i===4?`<path d="M46 76Q90 63 134 76" fill="none" stroke="${k.trim}" stroke-width="7"/>`:''}</svg>`};
}
Object.entries(EURO_CUPS).forEach(([id,c],n)=>c.names.forEach((_,i)=>{const key=`china_${id}_${i}`,p=euroPortrait(id,n,i),im=new Image();im.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(p.svg);FACES[key]=im;Object.assign(LOOKS[key],{nationalKit:id,shirt:EURO_KITS[id].base,sleeve:EURO_KITS[id].trim,collar:EURO_KITS[id].accent,skin:p.skin,hair:p.hair,tee:true});}));
// Six different silhouettes, with seven athlete-specific angles/strike counts.
function euroEffectArt(id,i){
 const rays=Array.from({length:8+i},(_,j)=>`<path transform="rotate(${j*360/(8+i)} 150 75)" d="M150 24V10M150 126V140"/>`).join('');
 const art={
 germany:`<g class="euro-rotor"><circle cx="150" cy="75" r="51"/><circle cx="150" cy="75" r="35"/>${rays}</g><path class="euro-strike" d="M0 75H300M30 66H270M60 84H240"/>`,
 sweden:`${[0,1,2,3].map(j=>`<path class="euro-ribbon" style="animation-delay:${j*70}ms" d="M0 ${40+j*15}Q60 ${-30+j*15} 150 ${65+j*10}T300 ${30+j*15}"/>`).join('')}`,
 france:`${[0,1,2].map(j=>`<path class="euro-thrust" style="animation-delay:${j*120}ms" d="M${10+j*20} ${125-j*30}L${280-j*10} ${20+j*20}l-30 5m30-5l-20 18"/>`).join('')}`,
 romania:`<g class="euro-moon"><path d="M175 12A62 62 0 1 0 175 138A48 48 0 0 1 175 12Z"/><g>${rays}</g></g>`,
 portugal:`${[0,1,2].map(j=>`<path class="euro-tide" style="animation-delay:${j*100}ms" d="M-60 ${80+j*20}Q0 ${10+j*20} 60 ${70+j*20}T180 ${70+j*20}T360 ${70+j*20}"/>`).join('')}`,
 austria:`<g class="euro-peaks"><path d="M0 140L75 42L113 90L175 5L300 140ZM146 48L175 5L207 48L184 39L172 52L160 37"/>${rays}</g>`
 };return `<svg viewBox="0 0 300 150" aria-hidden="true" style="--variant:${i}">${art[id]}</svg>`;
}
const euroDesignedFire=fireUlt;fireUlt=function(u,x,y,ai=false,...args){const on=ai&&euroActive(),id=on&&euroRun.country,i=on&&euroRun.order[euroRun.round],r=euroDesignedFire(u,x,y,ai,...args);if(on){const el=document.querySelector('.euro-impact');if(el){el.querySelector('svg')?.remove();el.insertAdjacentHTML('afterbegin',euroEffectArt(id,i));el.dataset.athlete=i;}if(foe.ultMove)foe.ultMove.euroCountry=id;}return r;};
const euroDesignedBody=ultBodyOffset;ultBodyOffset=function(st,side,s){const m=st.ultMove,id=m?.euroCountry;if(!id||matchMedia('(prefers-reduced-motion: reduce)').matches||m.owner&&ball?.owner!==m.owner)return euroDesignedBody(st,side,s);const t=(performance.now()/1000-m.t-ultFinalStart(m.u))/ULT_ACTION_SEC;if(t<0||t>1)return{x:0,y:0};const arc=Math.sin(Math.PI*t),snap=Math.sin(Math.PI*Math.min(1,t*2));const paths={germany:[-24*s*snap,0],sweden:[32*s*Math.sin(t*Math.PI*2)*arc,-12*s*arc],france:[-85*s*snap,5*s*arc],romania:[-18*s*arc,15*s*arc],portugal:[45*s*Math.sin(t*Math.PI*2)*arc,-20*s*arc],austria:[-25*s*arc,-90*s*arc]};return{x:side*paths[id][0],y:paths[id][1]};};
const euroDesignStyle=document.createElement('style');euroDesignStyle.textContent=`
.euro-impact svg{overflow:visible;stroke-width:2.5;filter:drop-shadow(0 0 3px currentColor)}
.euro-impact[data-country="france"] svg{stroke:#e9f4ff}.euro-impact[data-country="france"] path:nth-child(2){stroke:#e94458}
.euro-rotor{transform-origin:150px 75px;animation:euro-gear 1.1s ease-out both}.euro-strike,.euro-thrust{stroke-dasharray:400;animation:euro-line .55s ease-out both}
.euro-ribbon{stroke-width:7;opacity:.65;animation:euro-ribbon 1s ease-in-out both}.euro-ribbon:nth-child(even){stroke:#91efcf}
.euro-moon{transform-origin:150px 75px;animation:euro-gear 1.1s ease-out reverse both}.euro-tide{stroke-width:6;animation:euro-tide 1s ease-out both}.euro-peaks{animation:euro-peak .8s cubic-bezier(.2,.8,.3,1) both}
@keyframes euro-gear{from{transform:rotate(-95deg) scale(.55);opacity:0}35%{opacity:.9}to{transform:rotate(30deg) scale(1.15);opacity:0}}
@keyframes euro-line{from{stroke-dashoffset:400;opacity:0}25%{opacity:1}to{stroke-dashoffset:0;opacity:0}}
@keyframes euro-ribbon{from{transform:translateY(35px) scaleY(.2);opacity:0}40%{opacity:.75}to{transform:translateY(-18px) scaleY(1.2);opacity:0}}
@keyframes euro-tide{from{transform:translateX(-70px);opacity:0}35%{opacity:.8}to{transform:translateX(55px);opacity:0}}
@keyframes euro-peak{from{transform:translateY(-65px) scaleY(.3);opacity:0}55%{transform:translateY(8px);opacity:1}to{transform:translateY(0);opacity:0}}
@media(prefers-reduced-motion:reduce){.euro-impact svg *{animation:none!important;filter:none}}
`;document.head.append(euroDesignStyle);
PATCH_NOTES.unshift(['유럽 세계정복 선수 디자인','6개국 42명의 얼굴과 국가대표 경기복을 참고한 의상을 새로 구성했습니다. 기어·오로라·펜싱·초승달·파도·설산 필살기 효과와 국가별 동작이 추가되었습니다.']);
