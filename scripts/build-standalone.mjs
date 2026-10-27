import {readFileSync,writeFileSync,existsSync} from 'node:fs';
import {resolve,dirname,join} from 'node:path';
const dist=resolve('dist');
const input=join(dist,'index.html');
if(!existsSync(input))throw new Error('Build Vite ausente. Execute npm run build.');
let html=readFileSync(input,'utf8');
const mimeFrom=name=>name.endsWith('.svg')?'image/svg+xml':name.endsWith('.png')?'image/png':'image/jpeg';
function embedAsset(name){
 const p=join(dist,name.replace(/^\//,''));
 if(!existsSync(p))return '/'+name.replace(/^\//,'');
 const raw=readFileSync(p);
 return 'data:'+mimeFrom(name)+';base64,'+raw.toString('base64');
}
const assets=Array.from(html.matchAll(/<script\b[^>]*\bsrc="([^"]+\.js)"[^>]*><\/script>/g));
for(const entry of assets){const filepath=join(dist,entry[1].replace(/^\//,''));if(!existsSync(filepath))continue;const body=readFileSync(filepath,'utf8').replaceAll('</script','<\\/script');html=html.replace(entry[0],'<script>'+body+'</script>');}
const cssAssets=Array.from(html.matchAll(/<link\b[^>]*\bhref="([^"]+\.css)"[^>]*>/g));
for(const entry of cssAssets){const filepath=join(dist,entry[1].replace(/^\//,''));if(!existsSync(filepath))continue;let css=readFileSync(filepath,'utf8');css=css.replace(/url\((['"]?)(\/[^)'"]+\.svg)\1\)/g,(_,q,path)=>'url("'+embedAsset(path)+'")');html=html.replace(entry[0],'<style>'+css+'</style>');}
for(const filename of ['logo.svg','logo-light.svg','favicon.svg','og-cover.svg']){const uri=embedAsset(filename);html=html.split('/'+filename).join(uri);}
html=html.replaceAll('href="/links.html"','href="links.html"').replaceAll('href="/"','href="index.html"');
writeFileSync(join(dist,'standalone.html'),html,'utf8');
console.log('[Standalone] dist/standalone.html gerado ('+Math.round(Buffer.byteLength(html)/1024)+' KB).');
