// Angelo Studio — portfólio demonstrativo.
// SUBSTITUIR PELA IMAGEM REAL: altere "image", "alt", "title" e "link" após autorização.
const projects = [
  // Posts fornecidos para o portfólio; links podem ser adicionados quando autorizados.
  { id:'post-vacinacao', title:'Vacinação de cães e gatos',type:'post',label:'Post',image:'/projetos/post-vacinacao-pets.webp',link:null,alt:'Arte sobre vacinação em cães e gatos, com cachorro e gato',showcase:true },
  { id:'post-impressora', title:'Da imaginação à realidade',type:'post',label:'Post',image:'/projetos/post-impressao-3d.webp',link:null,alt:'Arte preta e azul com impressora 3D criando um dragão',showcase:true },
  { id:'post-agua', title:'Água sempre disponível',type:'post',label:'Post',image:'/projetos/post-agua-para-pets.webp',link:null,alt:'Post informativo sobre água fresca para pets, com tigela despejando água',showcase:true },
  { id:'post-calor', title:'Cuidados com pets no calor',type:'post',label:'Post',image:'/projetos/post-calorao-pets.webp',link:null,alt:'Post sobre como proteger cães e gatos nos dias quentes',showcase:true },
  { id:'post-kelvin', title:'Kelvin — Terceirão Amarelo',type:'post',label:'Post',image:'/projetos/post-kelvin-terceirao.webp',link:null,alt:'Arte esportiva preta e amarela com jogador Kelvin',showcase:true },
  { id:'post-basquete', title:'Elenco de basquete',type:'post',label:'Post',image:'/projetos/post-elenco-basquete.webp',link:null,alt:'Arte esportiva do Terceirão com bola de basquete e texto Elenco',showcase:true },
  { id:'post-futsal', title:'Elenco de futsal',type:'post',label:'Post',image:'/projetos/post-elenco-futsal.webp',link:null,alt:'Arte do Terceirão Amarelo anunciando elenco de futsal',showcase:true },
  // Placeholders conservados até existirem materiais reais destas categorias.
  { id:'p1', title:'Landing page de campanha',type:'site',label:'Site',image:null,link:null,alt:'Placeholder de landing page conceitual' },
  { id:'p3', title:'Identidade de marca',type:'identity',label:'Identidade',image:null,link:null,alt:'Placeholder de identidade visual conceitual' },
  { id:'p4', title:'Vídeo curto para Reels',type:'video',label:'Vídeo',image:null,link:null,alt:'Placeholder de vídeo curto conceitual' }
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
 let filter='all',activeId='post-vacinacao';
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
   if(project.image){img.addEventListener('error',()=>{img.src=placeholder(projects.indexOf(project));},{once:true});}
   img.alt=project.alt;
   img.loading='lazy';img.decoding='async';img.width=800;img.height=1000;
   const overlay=document.createElement('span');overlay.className='expand-overlay';
   const label=document.createElement('span');label.className='expand-type';label.textContent=project.showcase?project.label+' / arte gráfica':project.label+' / estudo conceitual';
   const title=document.createElement('strong');title.className='expand-title';title.textContent=project.title;
   const chevron=document.createElement('span');chevron.className='expand-indicator';chevron.textContent='+';
   overlay.append(label,title,chevron);trigger.append(img,overlay);
   const detail=document.createElement('div');detail.className='expand-detail';detail.id='project-detail-'+project.id;
   const desc=document.createElement('span');desc.textContent=project.showcase?project.label+' • peça de portfólio':project.label+' • imagem demonstrativa';
   const action=document.createElement(project.link?'a':'button');action.className='expand-action';
   action.textContent='Ver projeto';
   if(project.link){action.href=project.link;action.target='_blank';action.rel='noopener noreferrer';}
   else {action.type='button';action.disabled=true;action.title='Link de projeto ainda não informado';}
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
