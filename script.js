// ===== Villa Tozeur — Lightbox + Galerie + Menu mobile =====
(function(){
  const $ = (sel, root=document)=>root.querySelector(sel);
  const $$ = (sel, root=document)=>Array.from(root.querySelectorAll(sel));

  document.addEventListener('DOMContentLoaded', () => {
    // --- LIGHTBOX ---
    const grid = $('.gallery-grid');
    let lightbox = $('#lightbox');
    let lightboxImg = $('#lightbox-img');

    if (!lightbox) {
      lightbox = document.createElement('div');
      lightbox.id = 'lightbox';
      lightbox.className = 'lightbox';
      lightbox.setAttribute('role','dialog');
      lightbox.setAttribute('aria-modal','true');
      lightbox.innerHTML = '<img id="lightbox-img" alt="Image agrandie">';
      document.body.appendChild(lightbox);
    }
    lightboxImg = $('#lightbox-img');

    // Clean UI
    $$('.close-btn,.arrow.left,.arrow.right,.counter,.fs-btn', lightbox).forEach(n=>n.remove());

    // UI
    const counter = document.createElement('div'); counter.className = 'counter'; lightbox.appendChild(counter);
    const closeBtn = document.createElement('div'); closeBtn.className = 'close-btn'; closeBtn.innerHTML='&times;'; closeBtn.setAttribute('role','button'); closeBtn.setAttribute('aria-label','Fermer'); lightbox.appendChild(closeBtn);
    const left = document.createElement('div'); left.className='arrow left'; left.innerHTML='&#10094;'; lightbox.appendChild(left);
    const right = document.createElement('div'); right.className='arrow right'; right.innerHTML='&#10095;'; lightbox.appendChild(right);
    const fsBtn = document.createElement('div'); fsBtn.className='fs-btn'; fsBtn.textContent='Plein écran'; lightbox.appendChild(fsBtn);

    // Touch config
    lightbox.style.touchAction = 'pan-y';

    let current = 0;
    let images = $$('.gallery-grid img');

    const titleFor = (i)=>{
      const img = images[i]; if (!img) return 'Photo';
      const fig = img.closest('.gallery-item');
      return (fig && fig.getAttribute('data-label')) || img.alt || 'Photo';
    };

    function showImage(){
      if (!images[current]) return;
      lightboxImg.style.opacity='0';
      setTimeout(()=>{
        lightboxImg.src = images[current].src;
        lightboxImg.alt = images[current].alt || 'Image agrandie';
        lightboxImg.style.opacity='1';
        counter.textContent = `${titleFor(current)} — ${current+1} / ${images.length}`;
      },80);
    }

    function openAt(index){
      images = $$('.gallery-grid img');
      if (index<0 || index>=images.length) return;
      current = index;
      document.body.classList.add('lb-open');
      lightbox.classList.add('open');
      showImage();
    }

    function closeLB(){
      lightbox.classList.remove('open');
      document.body.classList.remove('lb-open');
    }

    images.forEach((img, idx)=>{
      img.addEventListener('click',(e)=>{ e.preventDefault(); e.stopPropagation(); openAt(idx); }, {passive:false});
    });

    if (grid){
      grid.addEventListener('click',(e)=>{
        const target = e.target && e.target.closest('img'); if (!target) return;
        const list = $$('.gallery-grid img');
        const idx = list.indexOf ? list.indexOf(target) : Array.prototype.indexOf.call(list, target);
        if (idx>=0){ e.preventDefault(); e.stopPropagation(); openAt(idx); }
      }, true);
    }

    left.addEventListener('click',(e)=>{ e.stopPropagation(); current = (current-1+images.length)%images.length; showImage(); });
    right.addEventListener('click',(e)=>{ e.stopPropagation(); current = (current+1)%images.length; showImage(); });
    closeBtn.addEventListener('click', closeLB);
    lightbox.addEventListener('click',(e)=>{ if (e.target===lightbox) closeLB(); });

    document.addEventListener('keydown',(e)=>{
      if (!lightbox.classList.contains('open')) return;
      if (e.key==='ArrowLeft'){ current=(current-1+images.length)%images.length; showImage(); }
      else if (e.key==='ArrowRight'){ current=(current+1)%images.length; showImage(); }
      else if (e.key==='Escape'){ closeLB(); }
    });

    // Swipe
    let startX=0,startY=0;
    lightbox.addEventListener('touchstart',(e)=>{
      if (!e.touches||e.touches.length===0) return;
      startX=e.touches[0].clientX; startY=e.touches[0].clientY;
    },{passive:true});
    lightbox.addEventListener('touchend',(e)=>{
      if (!e.changedTouches||e.changedTouches.length===0) return;
      const dx=e.changedTouches[0].clientX-startX, dy=e.changedTouches[0].clientY-startY;
      if (Math.abs(dx)>40 && Math.abs(dx)>Math.abs(dy)){
        current = dx<0 ? (current+1)%images.length : (current-1+images.length)%images.length;
        showImage();
      }
    },{passive:true});

    // Fullscreen
    function toggleFullscreen(){
      const el=lightboxImg;
      if (!document.fullscreenElement){ if (el.requestFullscreen) el.requestFullscreen(); }
      else { if (document.exitFullscreen) document.exitFullscreen(); }
    }
    fsBtn.addEventListener('click',(e)=>{ e.stopPropagation(); toggleFullscreen(); });

    // --- NAV MOBILE TOGGLE (unique) ---
    (function(){
      const btn=document.querySelector('.nav-toggle');
      const nav=document.getElementById('main-nav');
      if (!btn || !nav) return;

      const setOpen=(open)=>{
        document.body.classList.toggle('nav-open', open);
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      };

      btn.addEventListener('click', ()=> setOpen(!document.body.classList.contains('nav-open')) );
      nav.querySelectorAll('a').forEach(a=> a.addEventListener('click', ()=> setOpen(false) ));
      window.addEventListener('resize', ()=>{ if (window.innerWidth>860) setOpen(false); });
    })();

    // Footer year
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  });
})();
// ===== NAV MOBILE TOGGLE =====
(function(){
  const btn = document.querySelector('.nav-toggle');
  const nav = document.getElementById('main-nav');
  if (!btn || !nav) return;

  const setOpen = (open) => {
    document.body.classList.toggle('nav-open', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  };

  btn.addEventListener('click', () => {
    setOpen(!document.body.classList.contains('nav-open'));
  });

  // Fermer au clic sur un lien
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setOpen(false)));

  // Fermer si on repasse en desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 860) setOpen(false);
  });
})();
