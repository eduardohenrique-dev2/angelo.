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
mobile.querySelectorAll('a').forEach((a,index)=>{a.style.setProperty('--item-index',index);a.addEventListener('click',()=>setMenu(false));});
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
function setTheme(value){const light=value==='light';document.documentElement.classList.toggle('theme-prelight',light);document.documentElement.style.colorScheme=light?'light':'dark';document.body.classList.toggle('light',light);document.querySelectorAll('.brand img').forEach(img=>{img.src=light?'/logo-light.svg':'/logo.svg'});theme.setAttribute('aria-label',light?'Ativar tema escuro':'Ativar tema claro');theme.innerHTML=icon(light?'moon-stars':'sun');document.querySelector('meta[name="theme-color"]').content=light?'#f6f8ff':'#10172d';}
setTheme(getTheme()==='light'?'light':'dark');theme.addEventListener('click',()=>{const next=document.body.classList.contains('light')?'dark':'light';setTheme(next);saveTheme(next);});
const filters=[...document.querySelectorAll('[data-filter]')],projects=[...document.querySelectorAll('[data-category]')];filters.forEach(btn=>btn.addEventListener('click',()=>{const value=btn.dataset.filter;filters.forEach(b=>{const selected=b===btn;b.classList.toggle('active',selected);b.setAttribute('aria-pressed',String(selected));});let found=0;projects.forEach(card=>{card.hidden=value!=='all'&&card.dataset.category!==value;if(!card.hidden)found++;});document.querySelector('#project-empty').hidden=found>0;}));
document.querySelector('#year').textContent=new Date().getFullYear();
if('IntersectionObserver' in window&&!matchMedia('(prefers-reduced-motion: reduce)').matches){const obs=new IntersectionObserver(entries=>entries.forEach(x=>{if(x.isIntersecting){x.target.classList.add('visible');obs.unobserve(x.target);}}),{threshold:.05});document.querySelectorAll('.reveal').forEach(el=>obs.observe(el));}else document.querySelectorAll('.reveal').forEach(el=>el.classList.add('visible'));
addEventListener('scroll',()=>{const max=document.documentElement.scrollHeight-innerHeight;document.querySelector('#progress').style.transform='scaleX('+(max>0?scrollY/max:0)+')';},{passive:true});

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
