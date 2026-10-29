const assert=require('node:assert/strict'),fs=require('node:fs');
const html=fs.readFileSync('index.html','utf8');
assert.doesNotMatch(html,/orbitRewards/,'owned tournament trophies must not orbit the racket');
assert.match(html,/trophyMissBonus=\(\)=>trophyCount\(\)\*\.01/,'trophy combat bonus must remain');
console.log('Tournament trophy orbit rendering is removed');
