(function () {
  const canvas = document.getElementById('shader-canvas');
  function syncSize() { const w = canvas.clientWidth || 1280, h = canvas.clientHeight || 720; if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; } }
  if (typeof ResizeObserver !== 'undefined') new ResizeObserver(syncSize).observe(canvas);
  syncSize();
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  if (!gl) return;
  const vs = `attribute vec2 a_position; varying vec2 v_texCoord; void main(){ v_texCoord=a_position*0.5+0.5; gl_Position=vec4(a_position,0.0,1.0); }`;
  const fs = `precision highp float; uniform float u_time; uniform vec2 u_resolution; varying vec2 v_texCoord;
void main(){
  vec2 uv = v_texCoord;
  
  // 1. Foundation: Deep Charcoal/Black Base (The "60% Black" background)
  vec3 baseColor = vec3(0.02, 0.01, 0.03); 
  
  // 2. Glow: Soft top-center arc (The "30% Purple" accent)
  // Shifted to the top center, similar to the landing page header glow
  vec2 glowPos = uv - vec2(0.5, 0.95); 
  float dist = length(glowPos) * 1.5;
  float glow = smoothstep(0.7, 0.0, dist);
  
  // Vibrant but restrained purple highlight
  vec3 purpleHighlight = vec3(0.5, 0.0, 0.7);
  
  // Combine: 70% Base, 30% Purple
  vec3 finalColor = mix(baseColor, purpleHighlight, glow * 0.3);
  
  // 3. Ultra-subtle Grain: Keeps the black from looking 'flat'
  float noise = fract(sin(dot(uv + u_time * 0.001, vec2(12.9898, 78.233))) * 43758.5453);
  finalColor += noise * 0.015;
  
  gl_FragColor = vec4(finalColor, 1.0);
}`;
  function cs(t, s) { const sh = gl.createShader(t); gl.shaderSource(sh, s); gl.compileShader(sh); return sh; }
  const prog = gl.createProgram();
  gl.attachShader(prog, cs(gl.VERTEX_SHADER, vs));
  gl.attachShader(prog, cs(gl.FRAGMENT_SHADER, fs));
  gl.linkProgram(prog); gl.useProgram(prog);
  const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const pos = gl.getAttribLocation(prog, 'a_position');
  gl.enableVertexAttribArray(pos); gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);
  const uTime = gl.getUniformLocation(prog, 'u_time'), uRes = gl.getUniformLocation(prog, 'u_resolution'), uMouse = gl.getUniformLocation(prog, 'u_mouse');
  let mouse = { x: 640, y: 360 };
  window.addEventListener('mousemove', e => { const r = canvas.getBoundingClientRect(); if (r.width && r.height) { mouse.x = (e.clientX - r.left) / r.width * canvas.width; mouse.y = (1 - (e.clientY - r.top) / r.height) * canvas.height; } });
  function render(t) { if (typeof ResizeObserver === 'undefined') syncSize(); gl.viewport(0, 0, canvas.width, canvas.height); if (uTime) gl.uniform1f(uTime, t * 0.001); if (uRes) gl.uniform2f(uRes, canvas.width, canvas.height); if (uMouse) gl.uniform2f(uMouse, mouse.x, mouse.y); gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4); requestAnimationFrame(render); }
  render(0);
})();

(function () {
  var video = document.getElementById('hero-bone-video');
  if (!video) return;

  function tryPlay() {
    if (!video.paused) return; // already mid-playback — let it finish, ignore this scroll tick
    video.currentTime = 0;
    video.play().catch(function () {
      var resume = function () {
        video.currentTime = 0;
        video.play();
        document.removeEventListener('click', resume);
        document.removeEventListener('touchstart', resume);
      };
      document.addEventListener('click', resume, { once: true });
      document.addEventListener('touchstart', resume, { once: true });
    });
  }

  window.addEventListener('scroll', tryPlay, { passive: true });

  // Reset back to frame 0 the instant the video finishes
  video.addEventListener('ended', function () {
    video.currentTime = 0;
  });
})();

function showPage(name) {
  const pages = document.querySelectorAll('.page');
  pages.forEach(p => { p.classList.remove('active', 'visible'); });
  document.getElementById('nav-home').className = 'text-label-md font-label-md transition-colors cursor-pointer ' + (name === 'home' ? 'nav-active' : 'nav-inactive');
  document.getElementById('nav-about').className = 'text-label-md font-label-md transition-colors cursor-pointer ' + (name === 'about' ? 'nav-active' : 'nav-inactive');
  document.getElementById('nav-products').className = 'text-label-md font-label-md transition-colors cursor-pointer nav-inactive';
  document.getElementById('nav-dashboard').className = 'text-label-md font-label-md transition-colors cursor-pointer nav-inactive';
  const mobileHome = document.getElementById('mobile-nav-home');
  const mobileAbout = document.getElementById('mobile-nav-about');
  if (mobileHome) mobileHome.style.color = name === 'home' ? '#ff00ff' : '';
  if (mobileAbout) mobileAbout.style.color = name === 'about' ? '#ff00ff' : '';
  const target = document.getElementById('page-' + name);
  if (target) {
    target.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    requestAnimationFrame(() => requestAnimationFrame(() => target.classList.add('visible')));
  }
}

function toggleFaq(btn) {
  const answer = btn.nextElementSibling;
  const icon = btn.querySelector('.faq-icon');
  const isOpen = answer.classList.contains('open');
  document.querySelectorAll('.faq-answer').forEach(a => a.classList.remove('open'));
  document.querySelectorAll('.faq-icon').forEach(i => i.classList.remove('open'));
  if (!isOpen) { answer.classList.add('open'); icon.classList.add('open'); }
}

function handleProblemUpload(input) {
  const file = input.files && input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (e) {
    const thumb = document.getElementById('upload-thumb');
    const icon = document.getElementById('upload-icon');
    const text = document.getElementById('upload-text');
    thumb.src = e.target.result;
    thumb.classList.remove('hidden');
    icon.classList.add('hidden');
    text.textContent = file.name;
  };
  reader.readAsDataURL(file);
}

const scrollObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => { 
    if (entry.isIntersecting) { 
      entry.target.classList.add('in-view'); 
      scrollObserver.unobserve(entry.target); 
    } 
  });
}, { threshold: 0.10 }); // Triggers slightly earlier (10% visibility) for a smoother feel

// This tells the script to watch BOTH your original '.hiw-step' items AND any new '.scroll-animate' items
document.querySelectorAll('.hiw-step, .scroll-animate').forEach(el => scrollObserver.observe(el));

document.addEventListener('DOMContentLoaded', () => {
  const home = document.getElementById('page-home');
  requestAnimationFrame(() => requestAnimationFrame(() => home.classList.add('visible')));
});

document.addEventListener('DOMContentLoaded', () => {
    // 1. Set up the observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                // Add the 'show' class when it enters the screen
                entry.target.classList.add('show');
            } else {
                // Remove the class when it leaves so it animates again when scrolling back up
                entry.target.classList.remove('show');
            }
        });
    }, {
        threshold: 0.1, // Trigger when 10% of the element is visible
        rootMargin: "0px 0px -50px 0px" // Trigger slightly before the bottom of the screen
    });

    // 2. Grab all elements with the 'observe-me' class
    const animatedElements = document.querySelectorAll('.observe-me');

    // 3. Tell the observer to watch each one
    animatedElements.forEach((el) => {
        observer.observe(el);
    });
});




document.getElementById("year").textContent = new Date().getFullYear();







  const TOTAL = 7000; // full scan cycle, ms

  const badge   = document.getElementById('confBadge');
  const boxA    = document.getElementById('boxA');
  const boxB    = document.getElementById('boxB');
  const boxFinal= document.getElementById('boxFinal');
  const readout = document.getElementById('readout');

  function countUp(el, from, to, duration){
    const start = performance.now();
    function step(now){
      const p = Math.min((now - start) / duration, 1);
      const val = (from + (to - from) * p).toFixed(1);
      el.textContent = val + '%';
      if(p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function cycle(){
    badge.textContent = 'SCANNING';
    boxA.classList.remove('show');
    boxB.classList.remove('show');
    boxFinal.classList.remove('show');
    readout.classList.remove('show');

    setTimeout(() => boxA.classList.add('show'), 900);
    setTimeout(() => boxA.classList.remove('show'), 1500);

    setTimeout(() => boxB.classList.add('show'), 1650);
    setTimeout(() => boxB.classList.remove('show'), 2200);

    setTimeout(() => {
      boxFinal.classList.add('show');
      readout.classList.add('show');
      countUp(badge, 0, 96.2, 900);
    }, 2400);

    setTimeout(() => {
      boxFinal.classList.remove('show');
      readout.classList.remove('show');
    }, TOTAL - 500);
  }

  cycle();
  setInterval(cycle, TOTAL);



  

  // Your Blog Content from the PDFs
  const blogData = {
      1: {
          title: "How AI Can Support Doctors, Not Replace Them",
          date: "JUNE 28, 2026",
          tag: "Clinical AI",
          content: `
              <p>Artificial intelligence is no longer a futuristic concept in medicine; it's already here, reading scans, flagging risks, and answering clinical questions. Over the past couple of years, AI has moved from research labs into real hospital workflows, and the pace of that change has caught the attention of doctors, patients, and policymakers alike.</p>
              <p>Part of the reason AI feels suddenly "real" in healthcare is a few headline-grabbing moments. ChatGPT made waves when it cleared the United States Medical Licensing Examination (USMLE), showing that a language model could reason through clinical case files with surprising competence. Around the same time, Google and DeepMind unveiled Med-PaLM, built to give safe, reliable answers to both clinicians and patients.</p>
              <p>Naturally, this raises the big question on everyone's mind: if AI can pass a medical licensing exam, do we even need doctors anymore? Let's find out.</p>

              <h3 class="text-xl text-white font-semibold mt-10 mb-4">AI Is Already Changing Medicine</h3>
              <p>AI's biggest wins so far have come in areas that involve pattern recognition at scale—exactly the kind of work computers are good at. Diagnostics, medical imaging, patient triage, and precision medicine are the areas where AI systems have shown the most promise. In fields like radiology, pathology, and dermatology, some AI tools can now match or even outperform trained specialists.</p>

              <h3 class="text-xl text-white font-semibold mt-10 mb-4">Why Doctors Aren't Going Anywhere</h3>
              <p>Medicine isn't just pattern recognition; it's judgement, context, and trust. A few things make the human side of healthcare hard to automate:</p>
              <ul class="list-disc pl-6 space-y-2 my-4 marker:text-primary">
                  <li><strong class="text-white">Empathy and communication:</strong> Delivering a serious diagnosis takes emotional intelligence that current AI systems don't have.</li>
                  <li><strong class="text-white">Complex decision-making:</strong> Doctors weigh a person's full history, lifestyle, and family situation—nuance that's hard to capture in a dataset.</li>
                  <li><strong class="text-white">Accountability and ethics:</strong> Someone has to be responsible when a decision affects a person's health and life.</li>
              </ul>

              <h3 class="text-xl text-white font-semibold mt-10 mb-4">The Human-in-the-Loop Model</h3>
              <p>This is where the idea of a human-in-the-loop (HITL) approach comes in: a system where AI tools generate insights, but a qualified healthcare professional always reviews, guides, and makes the final call. Instead of competing with doctors, AI becomes an extra set of eyes.</p>
              
              <h3 class="text-xl text-white font-semibold mt-10 mb-4">So, Do We Still Need Doctors?</h3>
              <p>Yes, and probably more than ever. AI is a powerful tool for pattern recognition, speed, and scale, but medicine is still, at its core, a human profession built on trust, empathy, and judgement.</p>
              <p class="text-primary font-bold mt-8 text-xl">AI isn't here to replace the doctor. It's here to give the doctor superpowers.</p>
          `
      },
      2: {
          title: "AI in Rural Healthcare",
          date: "June 26, 2026",
          tag: "Research",
          content: `
              <p>Ask anyone who has worked in a small-town or rural hospital, and they'll tell you the same thing: the biggest barrier to good care usually isn't a lack of effort; it's a lack of resources. Too few specialists, too much distance between patients and diagnosis, and too little time to get either right.</p>
              <p>Artificial intelligence is starting to change that equation. And nowhere is the impact more practical, more immediate, than in something as common as a suspected bone fracture.</p>

              <h3 class="text-xl text-white font-semibold mt-10 mb-4">The Rural Healthcare Gap Is Real</h3>
              <p>Rural and smaller hospitals aren't lagging behind because they don't want modern tools; they're often working with tighter budgets, leaner IT teams, and fewer specialists on staff. Industry data shows a clear split: a majority of rural and critical-access hospitals now use some form of predictive AI, but they still trail well behind their urban counterparts in adoption.</p>

              <h3 class="text-xl text-white font-semibold mt-10 mb-4">Why Fractures Are a Perfect Use Case for Rural AI</h3>
              <p>A suspected fracture is one of the most common reasons someone walks into a rural clinic. But reading an X-ray accurately takes a trained radiologist, and in Tier 2 and Tier 3 towns, that expertise is often hours away. A patient might wait days for a formal report.</p>
              <p>Research on AI-based diagnostics in under-resourced settings backs up what frontline health workers already know: AI tools trained to recognise disease and injury patterns can give healthcare workers rapid, reliable diagnostic support even when a specialist isn't in the building.</p>

              <h3 class="text-xl text-white font-semibold mt-10 mb-4">How BoneScanX Fits Into This Picture</h3>
              <p>BoneScanX is an AI-powered fracture detection tool designed specifically for hospitals and clinics that don't have a radiologist sitting down the hall. Here's what that looks like in practice:</p>
              <ul class="list-disc pl-6 space-y-2 my-4 marker:text-primary">
                  <li><strong class="text-white">Fast, automated screening:</strong> BoneScanX analyses an X-ray in seconds, flagging suspected fractures for the attending doctor to review.</li>
                  <li><strong class="text-white">Built for existing equipment:</strong> It's designed to work with the X-ray and DICOM systems hospitals already have.</li>
                  <li><strong class="text-white">Explainable AI:</strong> BoneScanX highlights exactly where on the image it detected a possible fracture.</li>
              </ul>

              <h3 class="text-xl text-white font-semibold mt-10 mb-4">The Bigger Picture</h3>
              <p>AI isn't going to solve rural healthcare's resource gap by itself. But used well, it can put reliable, fast diagnostic support into the hands of doctors who are already stretched thin.</p>
              <p class="text-primary font-bold mt-8 text-xl">That's the problem BoneScanX exists to solve: helping doctors in Tier 2 and Tier 3 hospitals detect fractures faster, backed by a much quicker first read.</p>
          `
      }
  };

  // Logic to switch between views
  function openBlog(id) {
      document.getElementById('blog-list-view').classList.add('hidden');
      document.getElementById('blog-reader-view').classList.remove('hidden');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      const blog = blogData[id];
      if(blog) {
          document.getElementById('blog-reader-tag').innerText = blog.tag;
          document.getElementById('blog-reader-date').innerText = blog.date;
          document.getElementById('blog-reader-title').innerText = blog.title;
          document.getElementById('blog-reader-body').innerHTML = blog.content;
      }
  }

  function closeBlog() {
      document.getElementById('blog-reader-view').classList.add('hidden');
      document.getElementById('blog-list-view').classList.remove('hidden');
      window.scrollTo({ top: 0, behavior: 'smooth' });
  }
