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
