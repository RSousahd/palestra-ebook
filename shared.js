/* ═══════════════════════════════════════════
   RAFAEL SOARES — SHARED JAVASCRIPT
   Inclua no final de todas as páginas secundárias
═══════════════════════════════════════════ */

/* ── SEGURANÇA BÁSICA ────────────────────── */
// Proteção contra Clickjacking (X-Frame-Options equivalente)
if (window.self !== window.top) {
  window.top.location = window.self.location;
}

/* ── NAV ─────────────────────────────────── */
function toggleNav(){
  const nm = document.getElementById('nm');
  if(nm) nm.classList.toggle('open');
}
window.addEventListener('scroll',()=>{
  const nav = document.getElementById('nav');
  if(nav) nav.classList.toggle('s', window.scrollY > 60);
});
// Fechar menu ao clicar em link
document.querySelectorAll('.nm a').forEach(a=>{
  a.addEventListener('click',()=>{
    const nm = document.getElementById('nm');
    if(nm) nm.classList.remove('open');
  });
});

/* ── FAQ TOGGLE ──────────────────────────── */
function toggleFaq(el){
  const isActive = el.classList.contains('active');
  // fechar todos
  document.querySelectorAll('.faq-q.active').forEach(q=>{
    q.classList.remove('active');
    q.setAttribute('aria-expanded', 'false');
    const a = q.nextElementSibling;
    if(a) a.style.display='none';
  });
  if(!isActive){
    el.classList.add('active');
    el.setAttribute('aria-expanded', 'true');
    const ans = el.nextElementSibling;
    if(ans) ans.style.display='block';
  }
}

// Suporte a teclado para FAQ (Enter e Space)
document.addEventListener('DOMContentLoaded', ()=>{
  document.querySelectorAll('.faq-q').forEach(q=>{
    q.setAttribute('role', 'button');
    q.setAttribute('tabindex', '0');
    q.setAttribute('aria-expanded', 'false');
    
    q.addEventListener('keydown', e=>{
      if(e.key === 'Enter' || e.key === ' '){
        e.preventDefault();
        toggleFaq(q);
      }
    });
  });
});

/* ── COOKIE CONSENT ──────────────────────── */
(()=>{
  const box = document.getElementById('cookieBox');
  const modal = document.getElementById('cookieModal');
  if(!box || !modal) return;

  const els = {
    acceptEssential: document.getElementById('acceptEssential'),
    acceptAll: document.getElementById('acceptAll'),
    configure: document.getElementById('configureCookies'),
    closeModal: document.getElementById('closeModal'),
    save: document.getElementById('savePreferences'),
    acceptAllModal: document.getElementById('acceptAllModal'),
    rejectAllModal: document.getElementById('rejectAllModal'),
  };

  // mostrar banner se sem consentimento
  if(!localStorage.getItem('cookieConsent')){
    setTimeout(()=>box.classList.add('active'), 400);
  }

  function setConsent(essential, analytics, marketing){
    localStorage.setItem('cookieConsent', JSON.stringify({essential,analytics,marketing}));
    box.classList.remove('active');
    modal.classList.remove('active');
  }

  if(els.acceptEssential) els.acceptEssential.onclick = ()=>setConsent(true,false,false);
  if(els.acceptAll) els.acceptAll.onclick = ()=>setConsent(true,true,true);
  if(els.configure) els.configure.onclick = ()=>modal.classList.add('active');
  if(els.closeModal) els.closeModal.onclick = ()=>modal.classList.remove('active');
  if(els.save) els.save.onclick = ()=>{
    const analytics = document.getElementById('analyticsCookies')?.checked || false;
    const marketing = document.getElementById('marketingCookies')?.checked || false;
    setConsent(true,analytics,marketing);
  };
  if(els.acceptAllModal) els.acceptAllModal.onclick = ()=>setConsent(true,true,true);
  if(els.rejectAllModal) els.rejectAllModal.onclick = ()=>setConsent(true,false,false);

  modal.addEventListener('click',e=>{if(e.target===modal) modal.classList.remove('active')});
  document.addEventListener('keydown',e=>{if(e.key==='Escape') modal.classList.remove('active')});

  /* EXIT INTENT */
  const exitModal = document.getElementById('exitModal');
  const stayBtn = document.getElementById('stayButton');
  const contactExit = document.getElementById('contactExit');
  if(exitModal && stayBtn && contactExit){
    let shown = sessionStorage.getItem('exitModalShown')==='true';
    document.addEventListener('mouseout',e=>{
      if(shown || window.innerWidth<=800) return;
      if(e.clientY<=10 && !e.relatedTarget){
        shown=true;
        sessionStorage.setItem('exitModalShown','true');
        exitModal.classList.add('active');
      }
    });
    stayBtn.onclick = ()=>exitModal.classList.remove('active');
    contactExit.onclick = ()=>{
      exitModal.classList.remove('active');
      window.open('https://wa.me/5562985558320?text=Ol%C3%A1!%20Estou%20avaliando%20os%20servi%C3%A7os%20e%20gostaria%20de%20um%20atendimento%20priorit%C3%A1rio.','_blank');
    };
    exitModal.addEventListener('click',e=>{if(e.target===exitModal) exitModal.classList.remove('active')});
    document.addEventListener('keydown',e=>{if(e.key==='Escape') exitModal.classList.remove('active')});
  }
})();
