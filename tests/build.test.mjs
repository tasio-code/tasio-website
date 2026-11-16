import {test} from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {readFile,access} from 'node:fs/promises';
test('production project subpath resolves every generated internal href and src',async()=>{
 execFileSync(process.execPath,['scripts/build.mjs'],{env:{...process.env,BASE_PATH:'/tasio-website/'}});
 for(const page of ['','projects/','speaking/','contact/']){
  const html=await readFile(`dist/${page}index.html`,'utf8');
  assert.match(html,/<main id="main">/);
  for(const [,url] of html.matchAll(/(?:href|src)="([^"]+)"/g)){
   if(url.startsWith('https:') || url.startsWith('#')) continue;
   assert.ok(url.startsWith('/tasio-website/'),url);
   const target=url.replace('/tasio-website/','dist/');
   await access(target.endsWith('/')?target+'index.html':target);
  }
 }
 const contact=await readFile('dist/contact/index.html','utf8');
 assert.match(contact,/<button type="submit" disabled>/);
});
