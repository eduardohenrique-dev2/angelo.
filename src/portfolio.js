// Galeria de artes fornecidas para o portfólio; nenhuma imagem fictícia.
const projects=[
{id:'post-vacinacao',title:'Vacinação de cães e gatos',type:'post',label:'Post',image:'/projetos/post-vacinacao-pets.webp',link:null,alt:'Arte de vacinação de cães e gatos',pos:'center top'},
{id:'post-impressora',title:'Da imaginação à realidade',type:'post',label:'Post',image:'/projetos/post-impressao-3d.webp',link:null,alt:'Post sobre impressão 3D de um dragão',pos:'center top'},
{id:'post-agua',title:'Água sempre disponível',type:'post',label:'Post',image:'/projetos/post-agua-para-pets.webp',link:null,alt:'Arte informativa de água para cães e gatos',pos:'center top'},
{id:'post-calor',title:'Cuidados com pets no calor',type:'post',label:'Post',image:'/projetos/post-calorao-pets.webp',link:null,alt:'Arte sobre calor e cuidados com cães e gatos',pos:'center top'},
{id:'post-kelvin',title:'Kelvin — Terceirão Amarelo',type:'post',label:'Post',image:'/projetos/post-kelvin-terceirao.webp',link:null,alt:'Arte esportiva com Kelvin e Terceirão Amarelo',pos:'center top'},
{id:'post-basquete',title:'Elenco de basquete',type:'post',label:'Post',image:'/projetos/post-elenco-basquete.webp',link:null,alt:'Arte esportiva com bola de basquete e texto Elenco',pos:'center top'},
{id:'post-futsal',title:'Elenco de futsal',type:'post',label:'Post',image:'/projetos/post-elenco-futsal.webp',link:null,alt:'Arte do elenco de futsal do Terceirão Amarelo',pos:'center top'}
];
export function initPortfolio(){
 const gallery=document.querySelector('#project-grid');
 const empty=document.querySelector('#project-empty');
 const chips=[...document.querySelectorAll('.portfolio-filters [data-filter]')];
 const lightbox=document.querySelector('#project-lightbox');
 const lightboxImg=document.querySelector('#lightbox-image');
 const lightboxTitle=document.querySelector('#lightbox-title');
 const lightboxClose=lightbox?.querySelector('.lightbox-close');
 if(!gallery||!empty||!lightbox||!lightboxClose)return;
 const motion=matchMedia('(prefers-reduced-motion: reduce)');
 const hover=matchMedia('(hover:hover) and (pointer:fine)');
 let filter='all',activeId=null,previousFocus=null,scrollBefore=0;
 const header=()=>document.querySelector('.topbar')?.getBoundingClientRect().height||70;
 const filtered=()=>projects.filter(p=>filter==='all'||p.type===filter);
 // Filtros sem projetos reais não aparecem.
 chips.forEach(chip=>{chip.hidden=chip.dataset.filter!=='all'&&!projects.some(p=>p.type===chip.dataset.filter)});
 function choose(id,scroll=false){
  activeId=id;
  [...gallery.querySelectorAll('.expand-card')].forEach(card=>{
   const selected=card.dataset.id===id;
   card.classList.toggle('is-expanded',selected);
   card.querySelector('.expand-trigger').setAttribute('aria-expanded',String(selected));
  });
  if(scroll&&!hover.matches){
   const card=[...gallery.children].find(card=>card.dataset.id===id);
   if(card)requestAnimationFrame(()=>{const top=card.getBoundingClientRect().top+window.scrollY-header()-12;if(window.angeloScrollTo)window.angeloScrollTo(card,-header()-12);else window.scrollTo({top,behavior:motion.matches?'instant':'smooth'});});
  }
 }
 function showLightbox(project){
  previousFocus=document.activeElement;
  scrollBefore=window.scrollY;
  lightboxImg.src=project.image;
  lightboxImg.alt=project.alt;
  lightboxTitle.textContent=project.title;
  lightbox.hidden=false;
  document.body.classList.add('lightbox-open');
  window.angeloLenis?.stop();
  lightboxClose.focus({preventScroll:true});
 }
 function closeLightbox(){
  if(lightbox.hidden)return;
  lightbox.hidden=true;
  document.body.classList.remove('lightbox-open');
  window.angeloLenis?.start();
  lightboxImg.removeAttribute('src');
  previousFocus?.focus({preventScroll:true});
  window.scrollTo({top:scrollBefore,behavior:'instant'});
 }
 lightboxClose.addEventListener('click',closeLightbox);
 lightbox.addEventListener('click',e=>{if(e.target===lightbox)closeLightbox()});
 document.addEventListener('keydown',e=>{
  if(lightbox.hidden)return;
  if(e.key==='Escape'){e.preventDefault();closeLightbox()}
  if(e.key==='Tab'){
   // Há somente um controle interativo no diálogo.
   e.preventDefault();lightboxClose.focus();
  }
 });
 function render(){
  const visible=filtered();
  gallery.replaceChildren();
  empty.hidden=visible.length!==0;
  gallery.hidden=visible.length===0;
  // Mobile começa fechado. Desktop recebe seleção apenas quando há interação.
  activeId=null;
  visible.forEach(project=>{
   const card=document.createElement('article');
   card.className='expand-card';card.dataset.id=project.id;
   const trigger=document.createElement('button');
   trigger.className='expand-trigger';trigger.type='button';
   trigger.setAttribute('aria-expanded','false');
   trigger.setAttribute('aria-controls','detail-'+project.id);
   trigger.setAttribute('aria-label','Expandir '+project.title);
   const image=document.createElement('img');
   image.src=project.image;image.alt=project.alt;image.loading='lazy';
   image.decoding='async';image.width=1080;image.height=1350;
   image.style.objectPosition=project.pos||'center top';
   const overlay=document.createElement('span');overlay.className='expand-overlay';
   const meta=document.createElement('span');meta.className='expand-type';meta.textContent=project.label;
   const title=document.createElement('strong');title.className='expand-title';title.textContent=project.title;
   const plus=document.createElement('span');plus.className='expand-indicator';plus.setAttribute('aria-hidden','true');plus.textContent='+';
   overlay.append(meta,title,plus);trigger.append(image,overlay);
   const footer=document.createElement('div');footer.className='expand-detail';footer.id='detail-'+project.id;
   const info=document.createElement('div');info.className='expand-detail-copy';
   const name=document.createElement('strong');name.textContent=project.title;
   const type=document.createElement('span');type.textContent=project.label;info.append(name,type);
   const action=document.createElement(project.link?'a':'button');
   action.className='expand-action';
   action.textContent=project.link?'Ver projeto':'Ampliar';
   if(project.link){action.href=project.link;action.target='_blank';action.rel='noopener noreferrer';}
   else {action.type='button';action.addEventListener('click',()=>showLightbox(project))}
   footer.append(info,action);card.append(trigger,footer);
   trigger.addEventListener('click',()=>choose(activeId===project.id&&!hover.matches?null:project.id,true));
   trigger.addEventListener('pointerenter',()=>{if(hover.matches)choose(project.id)});
   gallery.append(card);
  });
  document.dispatchEvent(new CustomEvent('portfolio:updated'));
 }
 chips.filter(chip=>!chip.hidden).forEach(chip=>chip.addEventListener('click',()=>{
  filter=chip.dataset.filter;
  chips.forEach(c=>{const selected=c===chip;c.classList.toggle('active',selected);c.setAttribute('aria-pressed',String(selected))});
  render();
 }));
 render();
}
