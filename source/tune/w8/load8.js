const fs=require('fs'),path=require('path');
const all=[],common=[],infl=[];
for(const l of fs.readFileSync(path.join(__dirname,'words8.txt'),'utf8').trim().split('\n')){const [w,c,i]=l.split(' ');all.push(w);if(c==='1')common.push(w);if(i==='1')infl.push(w)}
module.exports={all,common,infl};
