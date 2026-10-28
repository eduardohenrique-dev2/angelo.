import {initFloatingActions} from './floating-actions.js';
import {initPortfolio} from './portfolio.js';
import {initMenu} from './menu.js';
import {initScrollExperience} from './scroll.js';
import {initIntro} from './intro.js';
const theme = document.querySelector('#theme');
const icon = (name) => name === 'sun'
  ? '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/></svg>'
  : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 14A8.5 8.5 0 0 1 10 3.5 8.5 8.5 0 1 0 20.5 14Z"/></svg>';
const getTheme=()=>{try{return localStorage.getItem('angelo-theme')}catch{return null}};
const saveTheme=v=>{try{localStorage.setItem('angelo-theme',v)}catch{}};
function setTheme(value){const light=value==='light';document.documentElement.classList.toggle('theme-prelight',light);document.documentElement.style.colorScheme=light?'light':'dark';document.body.classList.toggle('light',light);document.querySelectorAll('.brand img').forEach(img=>{img.src=light?'/logo-light.svg':'/logo.svg'});theme.setAttribute('aria-label',light?'Ativar tema escuro':'Ativar tema claro');theme.innerHTML=icon(light?'moon-stars':'sun');document.querySelector('meta[name="theme-color"]').content=light?'#f6f8ff':'#10172d';}
setTheme(getTheme()==='light'?'light':'dark');
initMenu();theme.addEventListener('click',()=>{const next=document.body.classList.contains('light')?'dark':'light';setTheme(next);saveTheme(next);});
initPortfolio();
document.querySelector('#year').textContent=new Date().getFullYear();
// Intro primeiro: as animações de scroll e do hero só iniciam após intro:done.
let motionStarted=false;
function startMotionAfterIntro(){
  if(motionStarted)return;
  motionStarted=true;
  if(window.gsap && window.ScrollTrigger){
    initScrollExperience();
  }else if(document.readyState==='complete'){
    // Fallback nativo se a CDN não estiver disponível.
    initScrollExperience();
  }else{
    window.addEventListener('load',initScrollExperience,{once:true});
  }
}
window.addEventListener('intro:done',startMotionAfterIntro);
initFloatingActions();
initIntro();

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
