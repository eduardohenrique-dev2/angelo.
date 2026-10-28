// Angelo Studio — portfólio demonstrativo.
// SUBSTITUIR PELA IMAGEM REAL: altere "image", "alt", "title" e "link" após autorização.
const projects = [
  { id:'p1', title:'Landing page de campanha',type:'site',label:'Site',image:null,link:null,alt:'Placeholder azul com a marca Angelo para landing page conceitual' },
  { id:'p2', title:'Posts para lançamento',type:'post',label:'Post',image:null,link:null,alt:'Placeholder azul com a marca Angelo para posts conceituais' },
  { id:'p3', title:'Identidade de marca',type:'identity',label:'Identidade',image:null,link:null,alt:'Placeholder azul com a marca Angelo para identidade visual conceitual' },
  { id:'p4', title:'Vídeo curto para Reels',type:'video',label:'Vídeo',image:null,link:null,alt:'Placeholder azul com a marca Angelo para vídeo curto conceitual' },
  { id:'p5', title:'Site institucional',type:'site',label:'Site',image:null,link:null,alt:'Placeholder azul com a marca Angelo para site institucional conceitual' },
  { id:'p6', title:'Conteúdo para redes',type:'post',label:'Post',image:null,link:null,alt:'Placeholder azul com a marca Angelo para conteúdo conceitual' }
];
const palette=['#2447cc','#375cf2','#1c3283','#3e63ed','#1a2e76','#5377ff'];
function placeholder(i){
 const svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000"><defs><linearGradient id="g" x2="1" y2="1"><stop stop-color="'+palette[i%palette.length]+'"/><stop offset="1" stop-color="#0d1637"/></linearGradient></defs><rect width="800" height="1000" fill="url(#g)"/><circle cx="700" cy="200" r="260" fill="#fff" opacity=".055"/><circle cx="50" cy="850" r="300" fill="#fff" opacity=".045"/><text x="50%" y="48%" text-anchor="middle" fill="#fff" font-family="Arial,sans-serif" font-size="114" font-weight="bold" letter-spacing="-6">angelo.</text><text x="50%" y="54%" text-anchor="middle" fill="#cfdaff" font-family="Arial,sans-serif" font-size="19" letter-spacing="7">STUDIO DIGITAL</text><text x="50%" y="89%" text-anchor="middle" fill="#d7e1ff" font-family="Arial,sans-serif" font-size="18" letter-spacing="4">ESTUDO CONCEITUAL</text></svg>';
 return 'data:image/svg+xml;charset=UTF-8,'+encodeURIComponent(svg);
}
export function initPortfolio(){
 const gallery=document.querySelector('#project-grid');
 const empty=document.querySelector('#project-empty');
 const buttons=[...document.querySelectorAll('.portfolio-filters [data-filter]')];
 if(!gallery||!empty||!buttons.length)return;
 let filter='all',activeId='p1';
 const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)');

 function render(){
  const visible=projects.filter(p=>filter==='all'||p.type===filter);
  if(!visible.some(p=>p.id===activeId))activeId=visible[0]?.id||null;
  gallery.replaceChildren();
  empty.hidden=visible.length!==0;
  gallery.hidden=visible.length===0;
  visible.forEach((project,i)=>{
   const article=document.createElement('article');
   article.className='expand-card';
   article.dataset.type=project.type;
   article.classList.toggle('is-expanded',project.id===activeId);
   const trigger=document.createElement('button');
   trigger.type='button';
   trigger.className='expand-trigger';
   trigger.setAttribute('aria-expanded',String(project.id===activeId));
   trigger.setAttribute('aria-controls','project-detail-'+project.id);
   trigger.setAttribute('aria-label','Expandir '+project.title);
   const img=document.createElement('img');
   img.src=project.image||placeholder(projects.indexOf(project));
   img.alt=project.alt;
   img.loading='lazy';img.decoding='async';img.width=800;img.height=1000;
   const overlay=document.createElement('span');overlay.className='expand-overlay';
   const label=document.createElement('span');label.className='expand-type';label.textContent=project.label+' / estudo conceitual';
   const title=document.createElement('strong');title.className='expand-title';title.textContent=project.title;
   const chevron=document.createElement('span');chevron.className='expand-indicator';chevron.textContent='+';
   overlay.append(label,title,chevron);trigger.append(img,overlay);
   const detail=document.createElement('div');detail.className='expand-detail';detail.id='project-detail-'+project.id;
   const desc=document.createElement('span');desc.textContent=project.label+' • imagem demonstrativa';
   const action=document.createElement(project.link?'a':'button');action.className='expand-action';
   action.textContent='Ver projeto';
   if(project.link){action.href=project.link;action.target='_blank';action.rel='noopener noreferrer';}
   else {action.type='button';action.disabled=true;action.title='Projeto demonstrativo: link disponível quando o trabalho real for publicado';}
   detail.append(desc,action);
   article.append(trigger,detail);
   trigger.addEventListener('click',()=>select(project.id));
   trigger.addEventListener('pointerenter',()=>{if(matchMedia('(hover:hover) and (pointer:fine)').matches)select(project.id)});
   gallery.append(article);
  });
 }
 function select(id){
  activeId=id;
  [...gallery.children].forEach((article,i)=>{
   const project=projects.filter(p=>filter==='all'||p.type===filter)[i];
   const selected=project.id===id;
   article.classList.toggle('is-expanded',selected);
   article.querySelector('button').setAttribute('aria-expanded',String(selected));
  });
 }
 buttons.forEach(button=>button.addEventListener('click',()=>{
  filter=button.dataset.filter;
  buttons.forEach(b=>{const selected=b===button;b.classList.toggle('active',selected);b.setAttribute('aria-pressed',String(selected));});
  if(!reduceMotion.matches){gallery.classList.add('is-filtering');setTimeout(()=>{render();gallery.classList.remove('is-filtering')},140)}
  else render();
 }));
 render();
}
