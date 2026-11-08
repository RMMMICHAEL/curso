/* =========================================================
   CONFIGURAÇÕES — edite só este bloco
   ========================================================= */

// Link do vídeo de apresentação (MP4/WebM). Ex.: "assets/apresentacao.mp4"
const VIDEO_URL = "";
// Capa do vídeo antes de dar play (opcional). Ex.: "assets/capa-apresentacao.jpg"
const VIDEO_POSTER = "";

// Link do checkout da Cakto. Ex.: "https://pay.cakto.com.br/XXXXXX"
const CHECKOUT_URL = "";

// Galeria de resultados. Coloque as capas verticais (9:16) na pasta assets
// com os nomes abaixo; enquanto não existirem, aparece um placeholder.
const VIDEOS = [
  { platform: "Instagram", views: "5,1 mi", url: "https://www.instagram.com/reel/DfXUo4hEcki/", cover: "assets/capa-1.jpg" },
  { platform: "Instagram", views: "532 mil", url: "https://www.instagram.com/reel/DfYIwjUCYSR/", cover: "assets/capa-2.jpg" },
  { platform: "Instagram", views: "487 mil", url: "https://www.instagram.com/reel/DfabEfRCNa5/", cover: "assets/capa-3.jpg" },
  { platform: "Instagram", views: "212 mil", url: "https://www.instagram.com/reel/DfajyC7nxJX/", cover: "assets/capa-4.jpg" },
  { platform: "Facebook", views: "503 mil", url: "https://www.facebook.com/reel/1479493334137975", cover: "assets/capa-5.jpg" },
];

/* ========================================================= */

document.documentElement.classList.add("js");

const ICONS = {
  Instagram: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>',
  Facebook: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M24 12a12 12 0 1 0-13.9 11.9v-8.4H7.1V12h3V9.4c0-3 1.8-4.7 4.5-4.7 1.3 0 2.7.2 2.7.2v3h-1.5c-1.5 0-2 .9-2 1.9V12h3.4l-.5 3.5h-2.9v8.4A12 12 0 0 0 24 12z"/></svg>',
};

// Checkout: só aceita https; sem link, os botões levam para a seção da oferta.
function setupCheckout() {
  const ok = /^https:\/\//i.test(CHECKOUT_URL);
  if (!ok) console.warn("CHECKOUT_URL vazio ou inválido: botões apontam para #comece-agora.");
  document.querySelectorAll(".js-cta").forEach((a) => {
    if (!ok) return;
    a.href = CHECKOUT_URL;
    a.target = "_blank";
    a.rel = "noopener";
  });
}

function setupPlayer() {
  const box = document.querySelector(".player");
  const video = box.querySelector("video");
  const play = box.querySelector(".player__play");
  if (!VIDEO_URL) return; // continua com o placeholder "em breve"

  video.src = VIDEO_URL;
  if (VIDEO_POSTER) video.poster = VIDEO_POSTER;
  box.dataset.state = "ready";
  play.disabled = false;

  play.addEventListener("click", () => {
    video.controls = true;
    video.play().catch(() => {}); // navegador pode bloquear; os controles continuam disponíveis
  });
  video.addEventListener("play", () => {
    box.dataset.state = "playing";
    video.controls = true;
  });
}

function renderGallery() {
  const list = document.querySelector(".js-gallery");
  list.innerHTML = VIDEOS.map((v, i) => `
    <li class="reveal">
      <a class="reel reel--${v.platform.toLowerCase()}" href="${v.url}" target="_blank" rel="noopener"
         aria-label="Assistir vídeo no ${v.platform}: ${v.views} de visualizações (abre em nova aba)">
        <span class="reel__ph">${ICONS[v.platform] || ""}</span>
        <img src="${v.cover}" alt="" loading="lazy" decoding="async" width="270" height="480" data-i="${i}">
        <span class="reel__info">
          <span class="reel__views">${v.views}</span>
          <span class="reel__net">visualizações · ${v.platform}</span>
        </span>
      </a>
    </li>`).join("");

  // Capa ausente: remove a imagem e deixa o placeholder.
  list.querySelectorAll("img").forEach((img) => {
    const drop = () => img.remove();
    if (img.complete && img.naturalWidth === 0) drop();
    else img.addEventListener("error", drop, { once: true });
  });
}

function setupReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-in"));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add("is-in");
      io.unobserve(e.target);
    });
  }, { rootMargin: "0px 0px -8% 0px" });
  items.forEach((el) => io.observe(el));
}

// CTA fixo no celular: aparece depois do botão do herói e some na oferta.
function setupStickyCta() {
  const bar = document.querySelector(".sticky-cta");
  const hero = document.querySelector(".hero__cta");
  const offer = document.querySelector("#comece-agora");
  if (!("IntersectionObserver" in window)) return;
  const seen = { hero: true, offer: false };
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { seen[e.target === hero ? "hero" : "offer"] = e.isIntersecting; });
    const on = !seen.hero && !seen.offer && hero.getBoundingClientRect().top < 0;
    bar.classList.toggle("is-on", on);
  });
  io.observe(hero);
  io.observe(offer);
}

document.querySelector(".js-year").textContent = new Date().getFullYear();
renderGallery();
setupCheckout();
setupPlayer();
setupReveal();
setupStickyCta();
