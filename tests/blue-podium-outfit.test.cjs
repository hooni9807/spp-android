const assert=require('assert'),fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
assert.match(html,/\['blue_podium','블루 포디움 폴로'/);
assert.match(html,/\['blue_podium','블루 포디움 쇼츠'/);
assert.match(html,/\{id:'blue_podium',name:'블루 포디움 폴로'/);
assert.match(html,/blue_podium:\{tier:'extreme'\}/);
assert.match(html,/\['ref_garden','ref_pixel','ref_moon','ref_neo','ref_coral','blue_podium'\]/);
assert.doesNotMatch(html,/CORNILLEAU/);
console.log('Blue Podium outfit is an original, unlockable in-game set');
