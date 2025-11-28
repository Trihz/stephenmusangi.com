// Smooth scroll for nav
document.querySelectorAll('a.navlink[href^="#"]').forEach(a=>{
  a.addEventListener('click', e=>{
    e.preventDefault();
    const id = a.getAttribute('href').slice(1);
    const el = document.getElementById(id);
    if(el) el.scrollIntoView({behavior:'smooth',block:'start'});
  });
});

// Reveal projects when in view
const projects = document.querySelectorAll('.project');
const obs = new IntersectionObserver(entries=>{
  entries.forEach(en=>{
    if(en.isIntersecting){ en.target.classList.add('revealed'); obs.unobserve(en.target); }
  });
},{threshold:0.12});
projects.forEach(p=>obs.observe(p));

// Modal interactions
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const modalDesc = document.getElementById('modal-desc');
const modalTags = document.getElementById('modal-tags');
const close = document.getElementById('close-modal');

function openModal(title,desc,tags){
  modalTitle.textContent = title; modalDesc.textContent = desc;
  modalTags.innerHTML = ''; tags.split(',').forEach(t=>{
    const s=document.createElement('span'); s.className='tag'; s.textContent=t.trim(); modalTags.appendChild(s);
  });
  modal.classList.add('open'); modal.setAttribute('aria-hidden','false');
}

projects.forEach(p=>{
  p.addEventListener('click', ()=>{
    openModal(p.dataset.title, p.dataset.desc, p.dataset.tags);
  });
});
close.addEventListener('click', ()=>{ modal.classList.remove('open'); modal.setAttribute('aria-hidden','true'); });
modal.addEventListener('click', e=>{ if(e.target===modal) { modal.classList.remove('open'); modal.setAttribute('aria-hidden','true'); }});

// Floating CTA opens contact
document.getElementById('open-contact').addEventListener('click', ()=>{ document.getElementById('contact').scrollIntoView({behavior:'smooth'}); });

// Little entrance animation on load
window.addEventListener('load', ()=>{
  document.querySelectorAll('.fade-in').forEach((el,i)=>{ el.style.animationDelay = (i*80)+'ms'; el.classList.add('fade-in'); });
});
