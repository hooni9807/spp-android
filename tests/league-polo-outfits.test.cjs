const assert=require('assert'),fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
for(const color of ['black','blue','purple','red','pink']){
 assert.match(html,new RegExp(`\\['league_${color}','리그 콘테스트`));
 assert.match(html,new RegExp(`\\{id:'league_${color}',name:'리그 콘테스트`));
 assert.match(html,new RegExp(`league_${color}:\\{tour:'cornilleau_league'\\}`));
}
assert.match(html,/cornilleau_league:'코닐리우 리그전'/);
assert.match(html,/q\.k==='league_polo'/);
assert.match(html,/case 'league_polo':ctx\.fillStyle=q\.a;/);
assert.match(html,/ctx\.lineTo\(ux\+12\*s,top\+th\*\.12\)/);
console.log('Five league polo colorways await the Cornilleau League championship');
