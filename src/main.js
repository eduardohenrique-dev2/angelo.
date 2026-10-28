import './style.css';
import './menu.css';
import './marketing.css';
import './studio-v9.css';
import { initPortfolio } from './portfolio.js';
import { initMenu } from './menu.js';
const theme = document.querySelector('#theme');
const icon = (name) => '<i class="bi bi-' + name + '" aria-hidden="true"></i>';
const getTheme=()=>{try{return localStorage.getItem('angelo-theme')}catch{return null}};
const saveTheme=v=>{try{localStorage.setItem('angelo-theme',v)}catch{}};
function setTheme(value){const light=value==='light';document.documentElement.classList.toggle('theme-prelight',light);document.documentElement.style.colorScheme=light?'light':'dark';document.body.classList.toggle('light',light);document.querySelectorAll('.brand img').forEach(img=>{img.src=light?'/logo-light.svg':'/logo.svg'});theme.setAttribute('aria-label',light?'Ativar tema escuro':'Ativar tema claro');theme.innerHTML=icon(light?'moon-stars':'sun');document.querySelector('meta[name="theme-color"]').content=light?'#f6f8ff':'#10172d';}
setTheme(getTheme()==='light'?'light':'dark');
initMenu();theme.addEventListener('click',()=>{const next=document.body.classList.contains('light')?'dark':'light';setTheme(next);saveTheme(next);});
initPortfolio();
document.querySelector('#year').textContent=new Date().getFullYear();
if('IntersectionObserver' in window&&!matchMedia('(prefers-reduced-motion: reduce)').matches){const obs=new IntersectionObserver(entries=>entries.forEach(x=>{if(x.isIntersecting){x.target.classList.add('visible');obs.unobserve(x.target);}}),{threshold:.05});document.querySelectorAll('.reveal').forEach(el=>obs.observe(el));}else document.querySelectorAll('.reveal').forEach(el=>el.classList.add('visible'));
const topShortcut=document.querySelector('.floating-top');
function updateScrollUI(){const max=document.documentElement.scrollHeight-innerHeight;document.querySelector('#progress').style.transform='scaleX('+(max>0?scrollY/max:0)+')';if(topShortcut)topShortcut.hidden=scrollY<=400;}
addEventListener('scroll',updateScrollUI,{passive:true});
updateScrollUI();

/* V6: quote builder (client-side only, no personal data collected) */
const quoteForm=document.querySelector('#quote-form');
const descriptionField=document.querySelector('#quote-description');
const charCounter=document.querySelector('#quote-counter');
if(descriptionField&&charCounter){const refresh=()=>{const remaining=descriptionField.value.length;charCounter.textContent=remaining+' / 500 caracteres';charCounter.setAttribute('aria-label',remaining+' de 500 caracteres utilizados');};descriptionField.addEventListener('input',refresh);refresh();}
const toast=document.querySelector('#quote-toast');
let toastTimer;
const showToast=(message)=>{toast.textContent=message;toast.hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>{toast.hidden=true},4500)};
if(quoteForm){
 const fields=['service','budget','deadline'].map(name=>quoteForm.elements.namedItem(name));
 fields.forEach(field=>{field.setAttribute('aria-invalid','false');field.addEventListener('change',()=>{field.setAttribute('aria-invalid','false');document.getElementById(field.id+'-error').textContent='';});});
 quoteForm.addEventListener('submit',event=>{
  event.preventDefault();
  let firstInvalid=null;
  fields.forEach(field=>{
   const invalid=!field.value.trim();
   field.setAttribute('aria-invalid',String(invalid));
   document.getElementById(field.id+'-error').textContent=invalid?'Selecione uma opção para continuar.':'';
   if(invalid&&!firstInvalid)firstInvalid=field;
  });
  if(firstInvalid){firstInvalid.focus();showToast('Preencha os três campos obrigatórios.');return;}
  const description=quoteForm.elements.namedItem('description').value.trim();
  const message=['Olá, Angelo Studio! Gostaria de conversar sobre um projeto.','','Serviço: '+fields[0].value,'Investimento previsto: '+fields[1].value,'Prazo desejado: '+fields[2].value,description?'Descrição: '+description:'','', 'Podemos conversar sobre o orçamento?'].filter((line,i)=>line!==''||i===1).join('\n');
  const url='https://wa.me/5531997607544?text='+encodeURIComponent(message);
  const submit=quoteForm.querySelector('#quote-submit');
  submit.classList.add('is-loading');submit.disabled=true;submit.setAttribute('aria-busy','true');
  showToast('Briefing pronto! Confira a mensagem no WhatsApp antes de enviar.');
  // User-initiated navigation; no server receives the form before this action.
  window.location.assign(url);
  window.setTimeout(()=>{submit.disabled=false;submit.classList.remove('is-loading');submit.removeAttribute('aria-busy');},1500);
 });
}
/* Magnetic pointer treatment: only fine pointers and reduced-motion off */
const canMagnet=window.matchMedia('(hover:hover) and (pointer:fine) and (prefers-reduced-motion:no-preference)').matches;
if(canMagnet){document.querySelectorAll('.hero-actions .button,.contact-button,.quote-submit').forEach(button=>{
 button.dataset.magnetic='';
 button.addEventListener('pointermove',event=>{const r=button.getBoundingClientRect();const dx=(event.clientX-r.left-r.width/2)*.075;const dy=(event.clientY-r.top-r.height/2)*.075;button.style.transform='translate3d('+dx+'px,'+dy+'px,0)';});
 button.addEventListener('pointerleave',()=>{button.style.transform='';});
});}
