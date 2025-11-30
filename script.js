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
// REPLACE your existing IntersectionObserver callback with this version
const projects = document.querySelectorAll('.project');
const obs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const el = entry.target;
    if (!entry.isIntersecting) return;

    // compute index among currently visible projects in DOM order
    const index = Array.from(document.querySelectorAll('.project')).indexOf(el);

    // base delay and increment (in ms)
    const base = 40;       // smallest delay
    const step = 50;       // increase per item
    const maxDelay = 300;  // cap delay so it doesn't get too long

    // compute and clamp
    let delay = Math.min(base + (index * step), maxDelay);

    // apply inline style for transition-delay (affects all transitions)
    el.style.transitionDelay = `${delay}ms`;

    // add revealed class — animation will play with the delay
    el.classList.add('revealed');

    // unobserve to avoid repeated triggers; after animation, clear transitionDelay for future style changes
    obs.unobserve(el);

    // optional: cleanup the inline delay after animation ends so future changes don't inherit it
    el.addEventListener('transitionend', function cleanup(e) {
      // make sure we only remove delay after the opacity/transform finished
      if (e.propertyName === 'opacity' || e.propertyName === 'transform') {
        el.style.transitionDelay = '';
        el.removeEventListener('transitionend', cleanup);
      }
    });
  });
}, { threshold: 0.12 });

// start observing
projects.forEach(p => obs.observe(p));


// Modal elements (extended)
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const modalDesc = document.getElementById('modal-desc');
const modalTags = document.getElementById('modal-tags');
const close = document.getElementById('close-modal');

// New modal element refs (if you used the updated modal HTML)
const imageWrapper = document.getElementById('modal-image');    // container (may be hidden)
const imageImg = document.getElementById('modal-image-img');    // <img> inside wrapper

const objectivesSection = document.getElementById('modal-objectives');
const objectivesList = document.getElementById('modal-objectives-list');

const achievedSection = document.getElementById('modal-achieved');
const achievedBody = document.getElementById('modal-achieved-body');

const challengesSection = document.getElementById('modal-challenges');
const challengesBody = document.getElementById('modal-challenges-body');

const softwareSection = document.getElementById('modal-software');
const softwareList = document.getElementById('modal-software-list');

// Utility: open/close modal
function openModalFromDataset(ds){
  // Title & description
  modalTitle.textContent = ds.title || ds['dataTitle'] || 'Project';
  modalDesc.textContent = ds.desc || '';

  // Image (optional)
  if(ds.image){
    imageImg.src = ds.image;
    imageImg.alt = (ds.title ? ds.title + ' — thumbnail' : 'project image');
    if(imageWrapper) imageWrapper.hidden = false;
  } else if(imageWrapper) {
    imageWrapper.hidden = true;
  }

  // Objectives - accepts pipe | comma or semicolon separated
  if(ds.objectives){
    const items = ds.objectives.split(/\||;|,/).map(s=>s.trim()).filter(Boolean);
    objectivesList.innerHTML = '';
    items.forEach(it=>{
      const li = document.createElement('li');
      li.textContent = it;
      objectivesList.appendChild(li);
    });
    if(objectivesSection) objectivesSection.hidden = false;
  } else {
    if(objectivesSection) objectivesSection.hidden = true;
  }

  // How achieved
  if(ds.achieved){
    achievedBody.textContent = ds.achieved;
    if(achievedSection) achievedSection.hidden = false;
  } else {
    if(achievedSection) achievedSection.hidden = true;
  }

  // Challenges
  if(ds.challenges){
    challengesBody.textContent = ds.challenges;
    if(challengesSection) challengesSection.hidden = false;
  } else {
    if(challengesSection) challengesSection.hidden = true;
  }

  // Software / tools
  if (ds.software) {
    const items = ds.software.split(/\||;|,/).map(s => s.trim()).filter(Boolean);
    softwareList.innerHTML = '';
    items.forEach(it => {
      const li = document.createElement('li');
      li.textContent = it;
      softwareList.appendChild(li);
    });
    softwareSection.hidden = false;
  } else {
    softwareSection.hidden = true;
  }

  // Tags (existing behavior)
  modalTags.innerHTML = '';
  const tagsRaw = ds.tags || ds['dataTags'] || '';
  if(tagsRaw){
    tagsRaw.split(',').map(t=>t.trim()).filter(Boolean).forEach(t=>{
      const s = document.createElement('span');
      s.className = 'tag';
      s.textContent = t;
      modalTags.appendChild(s);
    });
  }

  // show modal
  modal.classList.add('open');
  modal.setAttribute('aria-hidden','false');
}

// close modal helper
function closeModal(){
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden','true');
}

// Attach click handlers to project cards
projects.forEach(p=>{
  p.addEventListener('click', ()=>{
    // Use dataset (dataset keys are camelCased)
    const ds = p.dataset;
    openModalFromDataset(ds);
  });
});

// existing close interactions
close.addEventListener('click', closeModal);
modal.addEventListener('click', e=>{
  if(e.target === modal) closeModal();
});
document.addEventListener('keydown', e=>{
  if(e.key === 'Escape') closeModal();
});

// Floating CTA opens contact (if exists)
const openContact = document.getElementById('open-contact');
if(openContact){
  openContact.addEventListener('click', ()=>{ document.getElementById('contact').scrollIntoView({behavior:'smooth'}); });
}

// Little entrance animation on load
window.addEventListener('load', ()=>{
  document.querySelectorAll('.fade-in').forEach((el,i)=>{
    el.style.animationDelay = (i*80)+'ms';
    el.classList.add('fade-in');
  });
});


document.getElementById('copy-email').addEventListener('click', async () => {
  const email = document.getElementById('email-text').textContent;
  const btn = document.getElementById('copy-email');

  try {
    await navigator.clipboard.writeText(email);
    btn.textContent = "Copied!";
  } catch (err) {
    const temp = document.createElement('textarea');
    temp.value = email;
    document.body.appendChild(temp);
    temp.select();
    document.execCommand('copy');
    temp.remove();
    btn.textContent = "Copied!";
  }

  setTimeout(() => btn.textContent = "Copy", 1400);
});



document.getElementById('copy-phone').addEventListener('click', async () => {
  const phone = document.getElementById('phone-text').textContent;
  const btn = document.getElementById('copy-phone');

  try {
    await navigator.clipboard.writeText(phone);
    btn.textContent = "Copied!";
  } catch (err) {
    const temp = document.createElement('textarea');
    temp.value = phone;
    document.body.appendChild(temp);
    temp.select();
    document.execCommand('copy');
    temp.remove();
    btn.textContent = "Copied!";
  }

  setTimeout(() => btn.textContent = "Copy", 1400);
});



// LOAD MORE projects
const projectCards = document.querySelectorAll('#projects .project');
const loadMoreBtn = document.getElementById('load-more');
const loadMoreWrapper = document.getElementById('load-more-wrapper');

const MAX_VISIBLE = 4;

// Initially hide projects beyond the first 4
projectCards.forEach((card, index) => {
  if (index >= MAX_VISIBLE) {
    card.style.display = "none";
  }
});

// If there are 4 or fewer projects, hide the button
if (projectCards.length <= MAX_VISIBLE) {
  loadMoreWrapper.style.display = "none";
}

// When clicking "Load More"
if (loadMoreBtn) {
  loadMoreBtn.addEventListener('click', () => {
    projectCards.forEach(card => card.style.display = "block");

    // Re-run reveal animation for newly shown cards
    projectCards.forEach(p => obs.observe(p));

    // Hide the button
    loadMoreWrapper.style.display = "none";
  });
}


const menuToggle = document.getElementById('menu-toggle');
const siteNav = document.getElementById('site-nav');

if(menuToggle && siteNav){
  menuToggle.addEventListener('click', (e)=>{
    const open = siteNav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');

    // animate hamburger into an X (simple)
    menuToggle.classList.toggle('active');
    if(menuToggle.classList.contains('active')){
      // rotate the lines visually
      document.querySelector('.hamburger').style.transform = 'rotate(45deg)';
      document.querySelector('.hamburger').style.background = 'transparent';
      document.querySelector('.hamburger::before'); // no-op (pseudo can't be styled here)
      // small hack: create style for pseudo via class if needed
    } else {
      document.querySelector('.hamburger').style.transform = '';
      document.querySelector('.hamburger').style.background = '';
    }
  });

  // close when clicking outside
  document.addEventListener('click', (ev)=>{
    if(siteNav.classList.contains('open') && !siteNav.contains(ev.target) && !menuToggle.contains(ev.target)){
      siteNav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.classList.remove('active');
    }
  });

  // close on ESC
  document.addEventListener('keydown', (ev)=>{
    if(ev.key === 'Escape' && siteNav.classList.contains('open')){
      siteNav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.classList.remove('active');
    }
  });
}


