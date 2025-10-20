// ===== Villa Tozeur — Lightbox & Galerie (robuste) =====
(function(){
  function $(sel, root=document){ return root.querySelector(sel); }
  function $all(sel, root=document){ return Array.from(root.querySelectorAll(sel)); }

  document.addEventListener('DOMContentLoaded', () => {
    const grid = $('.gallery-grid');
    const lb = $('#lightbox');
    let lightboxImg = $('#lightbox-img');

    // Safety: create lightbox if missing
    if (!lb) {
      const created = document.createElement('div');
      created.id = 'lightbox';
      created.className = 'lightbox';
      created.setAttribute('role','dialog');
      created.setAttribute('aria-modal','true');
      created.innerHTML = '<img id="lightbox-img" alt="Image agrandie">';
      document.body.appendChild(created);
    }
    const lightbox = $('#lightbox');
    lightboxImg = $('#lightbox-img');

    // Clear previous UI children (avoid duplicates)
    $all('.close-btn,.arrow.left,.arrow.right,.counter,.fs-btn', lightbox).forEach(n=>n.remove());

    // UI elements
    const counter = document.createElement('div');
    counter.className = 'counter';
    lightbox.appendChild(counter);

    const closeBtn = document.createElement('div');
    closeBtn.className = 'close-btn';
    closeBtn.innerHTML = '&times;';
    closeBtn.setAttribute('role','button');
    closeBtn.setAttribute('aria-label','Fermer');
    lightbox.appendChild(closeBtn);

    const left = document.createElement('div');
    left.className = 'arrow left';
    left.innerHTML = '&#10094;';
    lightbox.appendChild(left);

    const right = document.createElement('div');
    right.className = 'arrow right';
    right.innerHTML = '&#10095;';
    lightbox.appendChild(right);

    const fsBtn = document.createElement('div');
    fsBtn.className = 'fs-btn';
    fsBtn.textContent = 'Plein écran';
    lightbox.appendChild(fsBtn);

    let current = 0;
    let images = $all('.gallery-grid img');

    function titleFor(index){
      const img = images[index];
      if (!img) return 'Photo';
      const fig = img.closest('.gallery-item');
      return (fig && fig.getAttribute('data-label')) || img.alt || 'Photo';
    }

    function showImage(){
      if (!images[current]) return;
      lightboxImg.style.opacity = '0';
      setTimeout(() => {
        lightboxImg.src = images[current].src;
        lightboxImg.alt = images[current].alt || 'Image agrandie';
        lightboxImg.style.opacity = '1';
        counter.textContent = `${titleFor(current)} — ${current+1} / ${images.length}`;
      }, 80);
    }

    function openAt(index){
      images = $all('.gallery-grid img'); // refresh
      if (index < 0 || index >= images.length) return;
      current = index;
      lightbox.classList.add('open');
      document.body.classList.add('lb-open');
      showImage();
    }

    function closeLB(){
      lightbox.classList.remove('open');
      document.body.classList.remove('lb-open');
    }

    // Bindings: simple click on each image
    images.forEach((img, index) => {
      img.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        openAt(index);
      }, {passive:false});
    });

    // Delegation (backup if DOM re-renders)
    if (grid){
      grid.addEventListener('click', (e) => {
        const target = e.target && e.target.closest('img');
        if (!target) return;
        const list = $all('.gallery-grid img');
        const idx = list.indexOf ? list.indexOf(target) : Array.prototype.indexOf.call(list, target);
        if (idx >= 0){
          e.preventDefault();
          e.stopPropagation();
          openAt(idx);
        }
      }, true);
    }

    // Arrows
    left.addEventListener('click', (e)=>{ e.stopPropagation(); current = (current - 1 + images.length) % images.length; showImage(); });
    right.addEventListener('click', (e)=>{ e.stopPropagation(); current = (current + 1) % images.length; showImage(); });

    // Close actions
    closeBtn.addEventListener('click', closeLB);
    lightbox.addEventListener('click', (e)=>{ if (e.target === lightbox) closeLB(); });

    // Keyboard
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'ArrowLeft') { current = (current - 1 + images.length) % images.length; showImage(); }
      else if (e.key === 'ArrowRight') { current = (current + 1) % images.length; showImage(); }
      else if (e.key === 'Escape') closeLB();
    });

    // Swipe (touch)
    let startX=0, startY=0;
    lightbox.addEventListener('touchstart', (e) => {
      if (!e.touches || e.touches.length===0) return;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    }, {passive:true});
    lightbox.addEventListener('touchend', (e) => {
      if (!e.changedTouches || e.changedTouches.length===0) return;
      const dx = e.changedTouches[0].clientX - startX;
      const dy = e.changedTouches[0].clientY - startY;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
        if (dx < 0) current = (current + 1) % images.length; else current = (current - 1 + images.length) % images.length;
        showImage();
      }
    }, {passive:true});

    // Fullscreen
    function toggleFullscreen(){
      const el = lightboxImg;
      if (!document.fullscreenElement){
        if (el.requestFullscreen) el.requestFullscreen();
      } else {
        if (document.exitFullscreen) document.exitFullscreen();
      }
    }
    fsBtn.addEventListener('click', (e)=>{ e.stopPropagation(); toggleFullscreen(); });

    // Footer year
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  });
})();
