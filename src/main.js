import './style.css';
const menu=document.querySelector('#menu'),mobile=document.querySelector('#mobile-nav'),theme=document.querySelector('#theme');
const icon=(name)=>'<i class="bi bi-'+name+'" aria-hidden="true"></i>';
const backdrop=document.querySelector('#menu-backdrop');
let menuWasOpen=false;
function setMenu(open,{restoreFocus=false}={}){
  if(open===menuWasOpen)return;
  menuWasOpen=open;
  menu.setAttribute('aria-expanded',String(open));
  menu.setAttribute('aria-label',open?'Fechar menu':'Abrir menu');
  menu.innerHTML=icon(open?'x-lg':'list');
  document.body.classList.toggle('menu-open',open);
  mobile.setAttribute('aria-hidden',String(!open));
  mobile.inert=!open;
  backdrop.setAttribute('aria-hidden',String(!open));
  if(open){mobile.querySelector('a')?.focus({preventScroll:true});}
  else if(restoreFocus){menu.focus({preventScroll:true});}
}
menu.addEventListener('click',()=>setMenu(!menuWasOpen,{restoreFocus:menuWasOpen}));
backdrop.addEventListener('click',()=>setMenu(false,{restoreFocus:true}));
mobile.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));
document.addEventListener('keydown',e=>{
  if(!menuWasOpen)return;
  if(e.key==='Escape'){e.preventDefault();setMenu(false,{restoreFocus:true});return;}
  if(e.key!=='Tab')return;
  const focusable=[menu,...mobile.querySelectorAll('a[href]')];
  const current=focusable.indexOf(document.activeElement);
  if(e.shiftKey&&(current===0||current<0)){e.preventDefault();focusable.at(-1).focus();}
  else if(!e.shiftKey&&current===focusable.length-1){e.preventDefault();menu.focus();}
});
const getTheme=()=>{try{return localStorage.getItem('angelo-theme')}catch{return null}};
const saveTheme=v=>{try{localStorage.setItem('angelo-theme',v)}catch{}};
function setTheme(value){const light=value==='light';document.body.classList.toggle('light',light);document.querySelectorAll('.brand img').forEach(img=>{img.src=light?'/logo-light.svg':'/logo.svg'});theme.setAttribute('aria-label',light?'Ativar tema escuro':'Ativar tema claro');theme.innerHTML=icon(light?'moon-stars':'sun');document.querySelector('meta[name="theme-color"]').content=light?'#f6f8ff':'#10172d';}
setTheme(getTheme()==='light'?'light':'dark');theme.addEventListener('click',()=>{const next=document.body.classList.contains('light')?'dark':'light';setTheme(next);saveTheme(next);});
const filters=[...document.querySelectorAll('[data-filter]')],projects=[...document.querySelectorAll('[data-category]')];filters.forEach(btn=>btn.addEventListener('click',()=>{const value=btn.dataset.filter;filters.forEach(b=>{const selected=b===btn;b.classList.toggle('active',selected);b.setAttribute('aria-pressed',String(selected));});let found=0;projects.forEach(card=>{card.hidden=value!=='all'&&card.dataset.category!==value;if(!card.hidden)found++;});document.querySelector('#project-empty').hidden=found>0;}));
document.querySelector('#year').textContent=new Date().getFullYear();
if('IntersectionObserver' in window&&!matchMedia('(prefers-reduced-motion: reduce)').matches){const obs=new IntersectionObserver(entries=>entries.forEach(x=>{if(x.isIntersecting){x.target.classList.add('visible');obs.unobserve(x.target);}}),{threshold:.05});document.querySelectorAll('.reveal').forEach(el=>obs.observe(el));}else document.querySelectorAll('.reveal').forEach(el=>el.classList.add('visible'));
addEventListener('scroll',()=>{const max=document.documentElement.scrollHeight-innerHeight;document.querySelector('#progress').style.transform='scaleX('+(max>0?scrollY/max:0)+')';},{passive:true});