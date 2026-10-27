import { writeFileSync, existsSync } from 'node:fs';
const explicit=process.env.SITE_URL;
const vercel=process.env.VERCEL_PROJECT_PRODUCTION_URL;
const raw=explicit||(vercel?'https://'+vercel:null);
if(!raw){console.warn('[SEO] Configure SITE_URL para gerar sitemap.xml e URLs canônicas.');process.exit(0);}
let origin;
try { const url=new URL(raw);if(url.protocol!=='https:') throw new Error('https obrigatório');origin=url.origin; }catch {console.error('[SEO] SITE_URL inválida: use https://seudominio.com');process.exit(1);}
const updated=new Date().toISOString().split('T')[0];
const xml='<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+['/','/links.html'].map(p=>'  <url><loc>'+origin+p+'</loc><lastmod>'+updated+'</lastmod></url>').join('\n')+'\n</urlset>\n';
if(!existsSync('dist')) throw new Error('Execute npm run build antes de gerar o sitemap.');
writeFileSync('dist/sitemap.xml',xml);
writeFileSync('dist/robots.txt','User-agent: *\nAllow: /\nSitemap: '+origin+'/sitemap.xml\n');
console.log('[SEO] Sitemap criado para '+origin);
