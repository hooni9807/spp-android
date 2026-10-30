// Fictional squads. National strength is game tuning, not a live ranking feed.
PATCH_NOTES.unshift(['세계정복 난이도 상향','15개국 전체의 공속·회전 배율을 기존보다 각각 10% 높였습니다. 국가별 전술과 선수 패시브는 유지됩니다.']);
const WORLD_EXPANSION={
 russia:{name:'러시아',color:'#89bcf0',lang:'ru-RU',hello:'Привет!',call:'Отлично!',theme:'빙정 역습',speed:1.166,spin:1.298,xy:[730,115],names:['미하일','아리나','레프','소피야','키릴','베라','안톤'],skills:['빙정 파쇄','눈보라 회전','동토 반격','서리 장벽','백야 돌진','빙하 분열','극지 폭풍'],motion:[18,-22,.16],shape:'M150 5V145M80 25L220 125M220 25L80 125M130 25L150 5L170 25M130 125L150 145L170 125'},
 taiwan:{name:'대만',color:'#67d8e0',lang:'zh-TW',hello:'你好!',call:'好球!',theme:'초고속 교차 공격',speed:1.254,spin:1.364,xy:[808,260],names:['린위','천하오','쉬안','웨이팅','쯔닝','이천','자룽'],skills:['청풍 교차','옥빛 나선','번개 쇼트','산맥 반격','해협 돌파','회오리 연타','천등 유성'],motion:[42,-10,.24],shape:'M10 120L95 20L155 100L230 10L290 90M20 140L110 40L170 120L250 30'},
 india:{name:'인도',color:'#efa54d',lang:'hi-IN',hello:'नमस्ते!',call:'शाबाश!',theme:'회전과 템포 변주',speed:1.21,spin:1.452,xy:[662,260],names:['아르준','디야','비크람','아샤','로한','미라','카비르'],skills:['금빛 차크라','연꽃 회전','몬순 드라이브','계단식 반격','태양 돌파','공작의 궤도','여명 원무'],motion:[24,-14,.38],shape:'M150 15A60 60 0 1 1 149 15M150 35A40 40 0 1 0 151 35M90 75H210M150 15V135'},
 brazil:{name:'브라질',color:'#e9d748',lang:'pt-BR',hello:'Olá!',call:'Boa!',theme:'도약과 강타',speed:1.276,spin:1.32,xy:[258,291],names:['카이우','루아나','페드루','비아','하파엘','이아라','마테우스'],skills:['황금 도약','정글 회오리','녹빛 강타','해변 반격','태양 점프','리듬 스텝','아마존 낙하'],motion:[35,-65,.22],shape:'M10 125Q65 0 150 65T290 25M35 140L150 15L265 140M120 65L150 15L180 65'},
 usa:{name:'미국',color:'#ed797d',lang:'en-US',hello:'Hello!',call:'Let’s go!',theme:'직선 가속',speed:1.188,spin:1.232,xy:[173,166],names:['노아','에이버리','메이슨','조이','이선','라일리','조던'],skills:['별빛 직선','레드 스핀','로켓 쇼트','철벽 리바운드','제트 돌파','혜성 스매시','스타 버스트'],motion:[60,-16,.13],shape:'M150 8L168 52L220 52L180 83L197 133L150 103L103 133L120 83L80 52L132 52ZM0 75H70M230 75H300'},
 singapore:{name:'싱가포르',color:'#ee99b6',lang:'en-SG',hello:'Hello!',call:'Well played!',theme:'정밀 배치와 수비',speed:1.1605,spin:1.353,xy:[710,301],names:['카이런','메이린','아딜','프리야','준하오','사라','웨이엔'],skills:['사자도 파동','난초 나선','항만 쇼트','정원 방벽','수평선 돌진','분수 역습','마리나 광선'],motion:[15,-28,-.2],shape:'M20 130Q150 0 280 130M70 130Q150 20 230 130M120 130Q150 40 180 130M0 140H300'},
 nigeria:{name:'나이지리아',color:'#65dba1',lang:'en-NG',hello:'Hello!',call:'Well done!',theme:'리듬 강타',speed:1.1825,spin:1.287,xy:[480,265],names:['치디','아미나','툰데','지나','에메카','톨라','오비'],skills:['녹색 섬광','니제르 물결','리듬 쇼트','에메랄드 반격','독수리 도약','폭풍 강타','대지의 울림'],motion:[32,-40,.3],shape:'M10 30L100 65L150 130L200 65L290 30L230 100L150 145L70 100ZM60 20L150 80L240 20'}
};
Object.assign(EURO_CUPS,WORLD_EXPANSION);
// Additional squads use the same seven-player series and portrait pipeline.
const distantSquads=[
 ['greenland','그린란드','#85efd6','da-DK','Flot!','극광 빙하', [335,77],['말리크','이발루','아푸트','나야','이누크','파니','아니카'],'빙하 극광 설풍 동토 유빙 백야 극야'],
 ['canada','캐나다','#ef8585','en-CA','Great shot!','단풍 회전', [170,100],['리암','올리비아','에반','클레어','네이선','마야','로건'],'단풍 돌풍 설원 빙하 북풍 오로라 적풍'],
 ['argentina','아르헨티나','#8ddfff','es-AR','¡Vamos!','팜파스 교차 스텝',[253,370],['마테오','루시아','티아고','발렌티나','니콜라스','카밀라','브루노'],'팜파스 태양 탱고 은빛 남풍 안데스 새벽'],
 ['australia','호주','#f4cf61','en-AU','Well done!','황금 도약',[840,360],['올리버','샬럿','잭','아멜리아','핀','그레이스','휴고'],'황금 산호 파도 유칼립투스 도약 남십자 사막'],
 ['southafrica','남아프리카공화국','#78d8a8','en-ZA','Brilliant!','프로테아 역습',[516,345],['타보','날레디','시포','아얀다','루카','졸라','키아라'],'프로테아 희망봉 초원 번개 산맥 녹빛 여명'],
 ['mexico','멕시코','#eca366','es-MX','¡Excelente!','금잔화 완급',[152,217],['디에고','소피아','에밀리오','발레리아','산티아고','레나타','가엘'],'금잔화 태양 협곡 흑요석 열풍 화산 황혼']
];
for(const [id,name,color,lang,call,theme,xy,names,words] of distantSquads){WORLD_EXPANSION[id]={name,color,lang,hello:lang.startsWith('es')?'¡Hola!':'Hello!',call,theme,xy,names,skills:words.split(' ').map((w,i)=>w+' '+['돌진','나선','쇼트','방벽','돌파','스매시','폭풍'][i]),speed:1.2,spin:1.35,motion:[28,-35,.2],shape:'M20 130L75 35L150 105L225 35L280 130M20 70Q150 0 280 70'};EURO_CUPS[id]=WORLD_EXPANSION[id];const svg=$('world-map').querySelector('svg'),land=svg.querySelector('g'),ns='http://www.w3.org/2000/svg',p=document.createElementNS(ns,'path'),label=document.createElementNS(ns,'text');p.setAttribute('d',`M${xy[0]-17} ${xy[1]-16}h34v32h-34Z`);p.dataset.region=id;p.setAttribute('tabindex','0');p.setAttribute('role','button');p.setAttribute('aria-label',name);p.onclick=()=>euroMap(id);p.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();euroMap(id);}};land.append(p);label.setAttribute('x',xy[0]);label.setAttribute('y',xy[1]+30);label.setAttribute('fill','#eff5fa');label.setAttribute('font-size','12');label.setAttribute('text-anchor','middle');label.textContent=name;svg.append(label);}
const distantTraits={
 greenland:{speed:1.25,spin:1.48,motion:[40,-55,.34],shape:'M0 140L70 45L105 95L150 5L210 85L250 30L300 140ZM15 45Q80 0 150 45T290 40M15 65Q80 20 150 65T290 60'},
 canada:{speed:1.18,spin:1.43,motion:[22,-25,.35],shape:'M150 145V85L80 110L95 75L45 55L100 50L95 15L135 40L150 0L165 40L205 15L200 50L255 55L205 75L220 110L150 85'},
 argentina:{speed:1.24,spin:1.34,motion:[48,-18,.28],shape:'M150 35A40 40 0 1 0 151 35M150 0V25M150 125V150M75 75H100M200 75H225M95 20L115 40M185 110L205 130M95 130L115 110M185 40L205 20'},
 australia:{speed:1.29,spin:1.28,motion:[35,-72,.18],shape:'M15 125Q65 35 115 80T215 80T295 40M30 145Q90 80 150 120T290 110M180 10L185 25L200 30L185 35L180 50L175 35L160 30L175 25Z'},
 southafrica:{speed:1.23,spin:1.39,motion:[30,-46,.26],shape:'M150 140Q40 110 50 40Q120 40 150 140Q180 40 250 40Q260 110 150 140ZM150 140Q85 65 150 5Q215 65 150 140'},
 mexico:{speed:1.21,spin:1.46,motion:[42,-24,.32],shape:'M150 75C60 30 100 -15 150 35C200 -15 240 30 150 75C240 30 285 100 195 100C240 160 160 175 150 115C140 175 60 160 105 100C15 100 60 30 150 75Z'}
};
for(const [id,traits] of Object.entries(distantTraits))Object.assign(WORLD_EXPANSION[id],traits);
const expansionRoles=['직선 드라이브','교차 회전','빠른 쇼트','커트 수비','깊은 코스','찬스볼 강타','랠리 가속'];
Object.entries(WORLD_EXPANSION).forEach(([id,c],n)=>{
 WORLD_COUNTRY_NAMES[id]=c.name;if(!WORLD_ACTIVE_COUNTRIES.includes(id))WORLD_ACTIVE_COUNTRIES.push(id);EURO_KITS[id]={base:c.color,trim:['#183254','#144e45','#492b45'][n%3],accent:'#f5f1de',code:id.slice(0,3).toUpperCase()};
 c.passives=expansionRoles.map((role,i)=>`${role} · ${c.skills[i]}`);euroPaths[id]=c.shape;
 c.names.forEach((name,i)=>{const key=`china_${id}_${i}`,p=euroPortrait(id,n+7,i),im=new Image();im.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(p.svg);FACES[key]=im;LOOKS[key]={name,nick:name,boss:true,split:true,face:key,faceFit:{h:40,b:22,cx:.5},nationalKit:id,shirt:c.color,sleeve:EURO_KITS[id].trim,collar:'#f5f1de',pants:'#172437',shorts:true,tee:true,skin:p.skin,hair:p.hair,skinShade:'#986f56',stanceK:.9+i*.04,crouchK:.05+i*.015};});
});
const expandedShot=P.aiReturn;P.aiReturn=function(kind,x,y,z,speed,aim,spin=1,...args){if(euroActive()&&WORLD_EXPANSION[euroRun.country]){const i=euroRun.order[euroRun.round];if(i===0){kind='drive';aim=.15;}if(i===1){aim=(rally%2?1:-1)*.55;spin*=1.12;}if(i===2){kind='block';speed*=1.08;}if(i===3){kind='cut';spin*=1.16;speed*=.9;}if(i===4)aim=(rally%2?1:-1)*.64;if(i===5&&kind==='smash')speed*=1.12;if(i===6)speed*=1+Math.min(.1,rally*.005);}return expandedShot.call(this,kind,x,y,z,speed,aim,spin,...args);};
const WORLD_TIER_TUNING={
 china:[1.12,1.08],japan:[1.09,1.06],
 germany:[.92,.94],sweden:[.92,.94],france:[.92,.94],romania:[.92,.94],portugal:[.92,.94],austria:[.92,.94],
 russia:[1.04,1.03],taiwan:[1.04,1.03],india:[1.04,1.03],brazil:[1.04,1.03],usa:[1.04,1.03],singapore:[1.04,1.03],nigeria:[1.04,1.03],
 canada:[1.07,1.05],argentina:[1.07,1.05],australia:[1.07,1.05],southafrica:[1.07,1.05],mexico:[1.07,1.05],greenland:[1.07,1.05]
};
const worldDifficultyShot=P.aiReturn;P.aiReturn=function(kind,x,y,z,speed,aim,spin=1,...args){const id=euroActive()?euroRun.country:chinaActive()?'china':null,tune=WORLD_TIER_TUNING[id];if(tune){speed*=tune[0];spin*=tune[1];}return worldDifficultyShot.call(this,kind,x,y,z,speed,aim,spin,...args);};
const expansionArt=euroEffectArt;euroEffectArt=function(id,i){const c=WORLD_EXPANSION[id];if(!c)return expansionArt(id,i);return `<svg viewBox="0 0 300 150" aria-hidden="true"><g transform="rotate(${(i-3)*5} 150 75)"><path d="${c.shape}"/>${Array.from({length:i+2},(_,j)=>`<circle cx="${35+j*230/(i+1)}" cy="${30+(j%3)*40}" r="${3+i}"/>`).join('')}</g></svg>`;};
const expansionKit=drawNationalKit;drawNationalKit=function(g,look,x,y,h,s){expansionKit(g,look,x,y,h,s);const c=WORLD_EXPANSION[look.nationalKit];if(!c)return;g.save();g.translate(x,y);g.scale(s,h/64);g.strokeStyle=EURO_KITS[look.nationalKit].trim;g.lineWidth=3;const n=Object.keys(WORLD_EXPANSION).indexOf(look.nationalKit);for(let j=0;j<3;j++){g.beginPath();g.moveTo(-29,22+j*10);g.lineTo((n%3-1)*18,12+j*10);g.lineTo(29,22+j*10+(n%2)*8);g.stroke();}g.restore();};
$('world-map').querySelector('footer').textContent='게임용 단순화 지도 · 21개 지역 · 지역별 7전 4선승';
document.querySelector('[data-region="greenland"]').setAttribute('d','M300 40L370 30L355 100L320 120Z');
PATCH_NOTES.unshift(['그린란드 제패','빙하·오로라 테마 선수 7명과 극광 빙하 연출을 추가했습니다. 7전 4선승으로 도전할 수 있습니다.']);
PATCH_NOTES.unshift(['세계정복 7개국 확장','러시아·대만·인도·브라질·미국·싱가포르·나이지리아에 신규 선수 49명과 국가별 기술·연출을 추가했습니다.']);
// Reference-inspired game kits; unverified regional designs are original concepts.
const NATIONAL_EXTRA_KITS={
 china:['#c92335','#eead35','#fff0ba','CHN'],russia:['#c72e42','#182c58','#ffffff','RUS'],
 taiwan:['#123e80','#df3352','#ffffff','TPE'],india:['#1984cc','#f19236','#ffffff','IND'],
 brazil:['#efda28','#16794a','#164fa2','BRA'],usa:['#182c60','#cf3047','#ffffff','USA'],
 singapore:['#d6243b','#263340','#ffffff','SGP'],nigeria:['#137848','#f0f4e8','#86caaa','NGR'],
 canada:['#c82b36','#191d25','#ffffff','CAN'],argentina:['#76bddd','#f5f5ef','#172c49','ARG'],
 australia:['#eacb27','#175b42','#ffffff','AUS'],southafrica:['#146442','#dfb93a','#ffffff','RSA'],
 mexico:['#176b4c','#a92e43','#f4eee2','MEX'],greenland:['#f2f1e9','#bf3041','#263f54','GRL']
};
Object.entries(NATIONAL_EXTRA_KITS).forEach(([id,[base,trim,accent,code]])=>{
 EURO_KITS[id]={base,trim,accent,code};
 Object.entries(LOOKS).forEach(([key,look])=>{if(id==='china'?CHINA_PLAYERS.some(p=>key==='china_'+p[0]):key.startsWith('china_'+id+'_'))Object.assign(look,{nationalKit:id,shirt:base,sleeve:trim,collar:accent});});
});
drawNationalKit=function(g,look,x,y,h,s){
 if(!NATIONAL_EXTRA_KITS[look.nationalKit])return expansionKit(g,look,x,y,h,s);
 const k=EURO_KITS[look.nationalKit],n=Object.keys(NATIONAL_EXTRA_KITS).indexOf(look.nationalKit);
 g.save();g.translate(x,y);g.scale(s,h/64);g.fillStyle=k.base;g.fillRect(-32,0,64,64);
 g.strokeStyle=k.trim;g.lineWidth=5;
 for(let j=0;j<4;j++){g.beginPath();const yy=17+j*11;
 if(n%4===0){g.moveTo(-32,yy);g.lineTo(8,yy-12);g.lineTo(32,yy-6);}
 else if(n%4===1){g.moveTo(-26+j*16,0);g.lineTo(-18+j*12,64);}
 else if(n%4===2){g.moveTo(-32,yy);g.quadraticCurveTo(0,yy-25,32,yy);}
 else{g.moveTo(-32,yy);g.lineTo(0,yy+10);g.lineTo(32,yy);}
 g.stroke();}
 g.fillStyle=k.accent;g.fillRect(-29,3,58,2);g.fillRect(7,12,14,8);g.fillStyle=k.trim;g.font='bold 5px sans-serif';g.textAlign='center';g.fillText(k.code,14,18);g.restore();
};
const detailedNationalKit=drawNationalKit;
drawNationalKit=function(g,look,x,y,h,s){
 detailedNationalKit(g,look,x,y,h,s);const k=EURO_KITS[look.nationalKit];if(!k)return;
 g.save();g.translate(x,y);g.scale(s,h/64);
 // Subtle fabric shading preserves the printed panels at match scale.
 const shade=g.createLinearGradient(-32,0,32,0);shade.addColorStop(0,'#00000030');shade.addColorStop(.3,'#ffffff08');shade.addColorStop(.65,'#ffffff10');shade.addColorStop(1,'#00000035');g.fillStyle=shade;g.fillRect(-32,0,64,64);
 g.strokeStyle='#ffffff28';g.lineWidth=.6;for(const side of [-1,1]){g.beginPath();g.moveTo(side*23,3);g.quadraticCurveTo(side*18,30,side*23,61);g.stroke();}
 g.strokeStyle=k.trim;g.lineWidth=3;g.beginPath();g.moveTo(-10,0);g.lineTo(0,8);g.lineTo(10,0);g.stroke();g.strokeStyle=k.accent;g.lineWidth=.7;g.beginPath();g.moveTo(-10,0);g.lineTo(0,8);g.lineTo(10,0);g.stroke();
 g.fillStyle='#ffffff20';g.fillRect(-28,60,56,1);g.restore();
};
Object.values(LOOKS).filter(l=>l.nationalKit==='japan').forEach(l=>{l.shirt='#d656a3';l.sleeve='#ed74aa';l.collar='#29294c';});
PATCH_NOTES.unshift(['세계정복 국가별 유니폼','21개 지역 선수의 경기복 색상·무늬를 구분했습니다. 일부 지역은 공식 복제본이 아닌 게임 전용 디자인입니다.']);
