const fs=require('fs/promises'),path=require('path');
const root=path.resolve(__dirname,'..'),out=path.join(root,'dist');
const keep=name=>name==='index.html'||name==='prologue.js'||name==='prologue-match.js'||(name.endsWith('.js')&&!['capacitor.config.js','naver-worker.js'].includes(name))||name==='prologue.css'||name.endsWith('.png');
(async()=>{await fs.rm(out,{recursive:true,force:true});await fs.mkdir(out,{recursive:true});for(const name of await fs.readdir(root)){if(keep(name))await fs.copyFile(path.join(root,name),path.join(out,name));}for(const name of ['assets','sounds'])await fs.cp(path.join(root,name),path.join(out,name),{recursive:true});console.log('Built static web bundle in dist/');})().catch(error=>{console.error(error);process.exit(1);});
