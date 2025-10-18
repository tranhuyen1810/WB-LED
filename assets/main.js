// main.js — enhanced interactions
document.addEventListener('DOMContentLoaded', () => {
  // Safe init Typed.js
  if (typeof Typed !== 'undefined') {
    new Typed('#typed-text', {
      strings: [
        'Công ty TNHH JUXUAN LED – Ánh sáng của tương lai.',
        'Chúng tôi mang đến giải pháp chiếu sáng thông minh.',
        'Cảm ơn Quý khách đã đồng hành cùng chúng tôi!'
      ],
      typeSpeed: 50,
      backSpeed: 30,
      loop: true
    });
  }

  // Generate LED background with variety in size and speed
  const ledCount = 36;
  for (let i = 0; i < ledCount; i++) {
    const led = document.createElement('div');
    led.className = 'led';
    const size = 6 + Math.random() * 14;
    led.style.width = size + 'px';
    led.style.height = size + 'px';
    led.style.top = Math.random() * 100 + 'vh';
    led.style.left = Math.random() * 100 + 'vw';
    led.style.opacity = 0.25 + Math.random() * 0.85;
    led.style.animationDelay = (Math.random() * 3).toFixed(2) + 's';
    led.style.transform = `translateZ(0)`;
    document.body.appendChild(led);
  }

  // simple parallax on scroll for LED dots
  let lastScroll = window.scrollY;
  window.addEventListener('scroll', () => {
    const delta = window.scrollY - lastScroll;
    lastScroll = window.scrollY;
    document.querySelectorAll('.led').forEach((el, idx) => {
      const speed = (idx % 5) / 20;
      const y = parseFloat(el.dataset._y || 0) + delta * speed;
      el.style.transform = `translateY(${y}px)`;
      el.dataset._y = y;
    });
  }, { passive: true });

  // Shrink header on scroll and apply class
  const header = document.querySelector('.site-header');
  const hero = document.querySelector('.hero');
  function checkHeader() {
    if (window.scrollY > 60) {
      header.classList.add('shrink');
    } else {
      header.classList.remove('shrink');
    }
  }
  checkHeader();
  window.addEventListener('scroll', checkHeader, { passive: true });

  // subtle hero parallax move
  window.addEventListener('scroll', () => {
    if (!hero) return;
    const rect = hero.getBoundingClientRect();
    const offset = Math.min(Math.max(-rect.top / 6, -40), 40);
    hero.style.backgroundPosition = `center ${50 + offset}%`;
  }, { passive: true });

  // Smooth scroll for nav links
  document.querySelectorAll('nav a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const targ = document.querySelector(a.getAttribute('href'));
      if (targ) targ.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // reveal on scroll
  const reveal = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('reveal-visible');
        reveal.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.feature-card, .testimonial, .card').forEach(el => {
    el.classList.add('reveal');
    reveal.observe(el);
  });

  // Contact form handler (demo)
  window.onContactSubmit = function (e) {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value.trim();
    const phone = form.phone.value.trim();
    const message = form.message.value.trim();
    if (!name || !phone || !message) {
      alert('Vui lòng điền đầy đủ thông tin.');
      return;
    }
    // Replace this with real API call if available
    form.querySelector('button[type="submit"]').disabled = true;
    setTimeout(() => {
      alert('Cảm ơn ' + name + '! Chúng tôi sẽ liên hệ lại sớm.');
      form.reset();
      form.querySelector('button[type="submit"]').disabled = false;
    }, 700);
  };

  // Ensure ticker has enough items to scroll smoothly on small screens
  (function enhanceTicker(){
    const track = document.querySelector('.ticker .ticker-track');
    if(!track) return;
    const items = Array.from(track.children);
    // duplicate items until width is at least 2x viewport (for seamless scroll)
    let totalW = items.reduce((s,el)=> s + el.offsetWidth, 0);
    let safety = 0;
    while(totalW < window.innerWidth * 2 && safety < 8){
      items.forEach(i => track.appendChild(i.cloneNode(true)));
      totalW = Array.from(track.children).reduce((s,el)=> s + el.offsetWidth, 0);
      safety++;
    }
  })();
});

// Image upload helpers (used by LIEN HE.HTML)
function initImageUploadUI(){
  const fileInput = document.getElementById('file-input');
  const pickBtn = document.getElementById('pick-btn');
  const uploadArea = document.getElementById('upload-area');
  const previewGrid = document.getElementById('preview-grid');
  const submitBtn = document.getElementById('submit-upload');
  const downloadAll = document.getElementById('download-all');

  if(!fileInput || !uploadArea) return;

  const files = [];

  function renderPreviews(){
    previewGrid.innerHTML = '';
    files.forEach((f, idx) => {
      const card = document.createElement('div');
      card.style.position = 'relative';
      card.style.borderRadius = '8px';
      card.style.overflow = 'hidden';
      card.style.background = 'rgba(255,255,255,0.02)';
      card.style.display = 'flex';
      card.style.flexDirection = 'column';

      const img = document.createElement('img');
      img.src = f.dataURL;
      img.style.width = '100%';
      img.style.height = '110px';
      img.style.objectFit = 'cover';
      card.appendChild(img);

      const bar = document.createElement('div');
      bar.style.display = 'flex';
      bar.style.gap = '6px';
      bar.style.padding = '6px';
      bar.style.justifyContent = 'space-between';

      const name = document.createElement('div');
      name.textContent = f.file.name;
      name.style.fontSize = '12px';
      name.style.color = '#cfeffd';
      name.style.overflow = 'hidden';
      name.style.textOverflow = 'ellipsis';
      name.style.whiteSpace = 'nowrap';
      bar.appendChild(name);

      const controls = document.createElement('div');
      controls.style.display = 'flex';

      const removeBtn = document.createElement('button');
      removeBtn.textContent = 'Xóa';
      removeBtn.className = 'button secondary';
      removeBtn.style.padding = '6px 8px';
      removeBtn.onclick = () => { files.splice(idx,1); renderPreviews(); };
      controls.appendChild(removeBtn);

      const dlBtn = document.createElement('button');
      dlBtn.textContent = 'Tải';
      dlBtn.className = 'button';
      dlBtn.style.padding = '6px 8px';
      dlBtn.onclick = () => { downloadDataURL(f.dataURL, f.file.name); };
      controls.appendChild(dlBtn);

      bar.appendChild(controls);
      card.appendChild(bar);
      previewGrid.appendChild(card);
    });
  }

  function downloadDataURL(dataURL, filename){
    const a = document.createElement('a');
    a.href = dataURL;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  function handleFilesList(list){
    Array.from(list).forEach(file => {
      if(!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        files.push({ file, dataURL: ev.target.result });
        renderPreviews();
      };
      reader.readAsDataURL(file);
    });
  }

  pickBtn.addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', (e) => handleFilesList(e.target.files));

  ;['dragenter','dragover'].forEach(ev => uploadArea.addEventListener(ev, (e) => { e.preventDefault(); uploadArea.style.borderColor = 'rgba(56,189,248,0.4)'; }));
  ;['dragleave','drop'].forEach(ev => uploadArea.addEventListener(ev, (e) => { uploadArea.style.borderColor = ''; }));
  uploadArea.addEventListener('drop', (e) => { e.preventDefault(); handleFilesList(e.dataTransfer.files); });

  downloadAll.addEventListener('click', () => {
    files.forEach(f => downloadDataURL(f.dataURL, f.file.name));
  });

  submitBtn.addEventListener('click', async () => {
    if(files.length === 0){ alert('Chưa có ảnh để gửi.'); return; }
    // try POST to /upload
    const endpoint = '/upload';
    const form = new FormData();
    files.forEach((f, i) => form.append('images', f.file, f.file.name));
    submitBtn.disabled = true; submitBtn.textContent = 'Đang gửi...';
    try{
      const res = await fetch(endpoint, { method: 'POST', body: form });
      if(res.ok){ alert('Gửi thành công. Nếu bạn chạy server local, ảnh sẽ được lưu.'); files.length = 0; renderPreviews(); }
      else { alert('Server trả lỗi: ' + res.status); }
    }catch(err){ alert('Không thể gửi: ' + err.message + '\nBạn có thể chỉ tải xuống ở client bằng "Tải xuống tất cả".'); }
    submitBtn.disabled = false; submitBtn.textContent = 'Gửi lên server';
  });
}

// auto-init if upload elements present
document.addEventListener('DOMContentLoaded', () => { if(document.getElementById('upload-area')) initImageUploadUI(); });

// Lightbox for images
function initLightbox(){
  const anchors = document.querySelectorAll('a[data-lightbox]');
  if(!anchors.length) return;
  const lb = document.createElement('div'); lb.className = 'lightbox';
  const img = document.createElement('img');
  const close = document.createElement('button'); close.className = 'close'; close.textContent = '✕';
  lb.appendChild(img); lb.appendChild(close); document.body.appendChild(lb);

  function open(src){ img.src = src; lb.classList.add('show'); document.body.style.overflow = 'hidden'; }
  function closeLb(){ lb.classList.remove('show'); img.src = ''; document.body.style.overflow = ''; }

  anchors.forEach(a => { a.addEventListener('click', (e) => { e.preventDefault(); open(a.href); }); });
  close.addEventListener('click', closeLb);
  lb.addEventListener('click', (e) => { if(e.target === lb) closeLb(); });
  document.addEventListener('keyup', (e) => { if(e.key === 'Escape') closeLb(); });
}

document.addEventListener('DOMContentLoaded', initLightbox);
