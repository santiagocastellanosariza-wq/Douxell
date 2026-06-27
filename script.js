function loadStylesheet(href) {
  if (document.querySelector(`link[href="${href}"]`)) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = href;
  document.head.appendChild(link);
}

loadStylesheet('final-polish.css');
loadStylesheet('interactions.css?v=contact-icons-visible-2');
loadStylesheet('header-banner.css?v=whatsapp-header-30');

const whatsappPedidoUrl = 'https://wa.me/573028394346?text=Hola%20Douxell%2C%20quiero%20hacer%20un%20pedido';

const formatter = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
});

const cart = [];
const cartPanel = document.getElementById('cartPanel');
const closeCart = document.querySelector('.close-cart');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const modal = document.getElementById('welcomeModal');
const closeModal = document.querySelector('.close-modal');
const forms = document.querySelectorAll('form');

function replaceHeaderIcons() {
  const actions = document.querySelector('.header-actions');
  if (!actions) return;

  actions.innerHTML = `
    <a class="icon-btn header-social whatsapp-head" href="${whatsappPedidoUrl}" target="_blank" rel="noopener" aria-label="WhatsApp Douxell" title="WhatsApp"><img src="assets/wsp-icon.svg" alt="WhatsApp Douxell" class="social-icon-img"></a>
    <a class="icon-btn header-social instagram-head" href="#contacto" aria-label="Instagram Douxell" title="Instagram">◎</a>
    <button class="icon-btn cart-toggle" type="button" aria-label="Abrir carrito">🛒<span id="cartCount">0</span></button>
    <button class="menu-toggle" type="button" aria-label="Abrir menú">☰</button>
  `;
}

function replaceFloatingActions() {
  const floatingActions = document.querySelector('.floating-actions');
  if (!floatingActions) return;

  floatingActions.innerHTML = `
    <a class="floating-social floating-whatsapp" href="${whatsappPedidoUrl}" target="_blank" rel="noopener" aria-label="WhatsApp Douxell" title="WhatsApp"><img src="assets/wsp-icon.svg" alt="WhatsApp Douxell" class="social-icon-img"></a>
    <a class="floating-social floating-instagram" href="#contacto" aria-label="Instagram Douxell" title="Instagram">◎</a>
  `;
}

function initMenu() {
  const menuToggle = document.querySelector('.menu-toggle');
  const mainNav = document.querySelector('.main-nav');

  menuToggle?.addEventListener('click', () => {
    mainNav?.classList.toggle('open');
  });

  document.querySelectorAll('.main-nav a').forEach((link) => {
    link.addEventListener('click', () => mainNav?.classList.remove('open'));
  });
}

function getCartCountElements() {
  return {
    cartCount: document.getElementById('cartCount'),
    floatCartCount: document.getElementById('floatCartCount'),
  };
}

function wireCartToggles() {
  document.querySelectorAll('.cart-toggle').forEach((button) => {
    button.addEventListener('click', () => cartPanel?.classList.add('open'));
  });
}

closeCart?.addEventListener('click', () => {
  cartPanel?.classList.remove('open');
});

function wireCartButtons() {
  document.querySelectorAll('.add-cart').forEach((button) => {
    button.addEventListener('click', () => {
      const card = button.closest('.product-card');
      if (!card) return;

      const name = card.dataset.name;
      const price = Number(card.dataset.price);
      const item = cart.find((product) => product.name === name);

      if (item) {
        item.quantity += 1;
      } else {
        cart.push({ name, price, quantity: 1 });
      }

      renderCart();
      cartPanel?.classList.add('open');
    });
  });
}

function renderCart() {
  if (!cartItems || !cartTotal) return;
  cartItems.innerHTML = '';

  if (!cart.length) {
    cartItems.innerHTML = '<p>Aún no tienes productos en el carrito.</p>';
  }

  cart.forEach((item) => {
    const row = document.createElement('div');
    row.className = 'cart-item';
    row.innerHTML = `
      <div>
        <strong>${item.name}</strong><br>
        <small>${item.quantity} x ${formatter.format(item.price)}</small>
      </div>
      <strong>${formatter.format(item.price * item.quantity)}</strong>
    `;
    cartItems.appendChild(row);
  });

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const { cartCount, floatCartCount } = getCartCountElements();

  if (cartCount) cartCount.textContent = totalItems;
  if (floatCartCount) floatCartCount.textContent = totalItems;
  cartTotal.textContent = formatter.format(total);

  const message = cart.length
    ? `Hola, quiero hacer un pedido Douxell: ${cart.map((item) => `${item.quantity} ${item.name}`).join(', ')}. Total aproximado: ${formatter.format(total)}`
    : 'Hola, quiero conocer los productos Douxell';

  const cartWhatsapp = document.querySelector('.cart-whatsapp');
  if (cartWhatsapp) cartWhatsapp.href = `https://wa.me/573028394346?text=${encodeURIComponent(message)}`;
}

function setTopbarMessage(topbar, banner) {
  topbar.innerHTML = `<span class="topbar-message">${banner.text}</span>`;
}

function initTopBannerRotator() {
  const topbar = document.querySelector('.topbar');
  if (!topbar) return;

  const banners = [
    { text: 'Envíos deliciosos a toda Colombia · Cacao natural con identidad Douxell', className: 'banner-green' },
    { text: 'Oferta especial · 2 unidades por $48.000 · pide en WhatsApp', className: 'banner-coral' },
    { text: 'Chocolate que abraza · sabor colombiano para momentos especiales', className: 'banner-cacao' },
    { text: 'Desde el origen del cacao nace una dulzura con alma artesanal', className: 'banner-gold' },
  ];

  let index = 0;
  topbar.classList.add('rotating-topbar', banners[0].className);
  setTopbarMessage(topbar, banners[0]);

  setInterval(() => {
    topbar.classList.add('is-changing');
    setTimeout(() => {
      topbar.classList.remove(banners[index].className);
      index = (index + 1) % banners.length;
      setTopbarMessage(topbar, banners[index]);
      topbar.classList.add(banners[index].className);
      topbar.classList.remove('is-changing');
    }, 560);
  }, 7500);
}

setTimeout(() => {
  if (modal && !localStorage.getItem('douxellModalClosed')) {
    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
  }
}, 900);

function closeWelcomeModal() {
  if (!modal) return;
  modal.classList.remove('show');
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('no-scroll');
  localStorage.setItem('douxellModalClosed', 'true');
}

closeModal?.addEventListener('click', closeWelcomeModal);

modal?.addEventListener('click', (event) => {
  if (event.target === modal) closeWelcomeModal();
});

forms.forEach((form) => {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    alert('Gracias por conectar con Douxell. Muy pronto recibirás nuestras novedades.');
    if (form.classList.contains('modal-form')) closeWelcomeModal();
    form.reset();
  });
});

function applyPromoCallout() {
  const callout = document.querySelector('.shop-callout');
  if (!callout) return;

  const promoMessage = 'Hola DOUXELL, quiero aprovechar la promo de 2 unidades por $48.000. Quiero combinar cacao y chips. ¿Cómo hago mi pedido?';
  const promoUrl = `https://wa.me/573028394346?text=${encodeURIComponent(promoMessage)}`;

  callout.innerHTML = `
    <div>
      <h3>Desde la raíz del campo, nace la mejor dulzura.</h3>
      <p>Cosecha seleccionada, cuidado en cada etapa y un empaque que preserva lo mejor del cacao. Promo especial: 2 unidades por $48.000, puedes combinar cacao y chips.</p>
      <a href="${promoUrl}" class="btn promo-whatsapp" target="_blank" rel="noopener">Pedir promo en WhatsApp</a>
    </div>
    <div class="shop-callout-visual" aria-label="Chocolate caliente inspirado en los páramos de Santurbán">
      <span class="visual-caption">Chocolate caliente · Santurbán</span>
    </div>
  `;
}

function updateProductPricingText() {
  const cacaoCard = document.querySelector('[data-name="Cacao natural Douxell 250 g"]');
  if (cacaoCard) {
    const gram = cacaoCard.querySelector('.product-meta small');
    if (gram) gram.textContent = 'Valor g: $104';
  }

  const chipsCard = document.querySelector('[data-name="Chips de chocolate Douxell 250 g"]');
  if (chipsCard) {
    chipsCard.dataset.price = '50000';
    const price = chipsCard.querySelector('.product-meta strong');
    const gram = chipsCard.querySelector('.product-meta small');
    if (price) price.textContent = '$50.000';
    if (gram) gram.textContent = 'Valor g: $200';
  }
}

function updateTestimonials() {
  const names = ['Cristian Sandoval', 'Laura S', 'Andrea A.'];
  document.querySelectorAll('.testimonial-card h3').forEach((name, index) => {
    if (names[index]) name.textContent = names[index];
  });
}

function updateOriginBadge() {
  const originBadge = document.querySelector('.origin-pillars article:first-child span');
  if (!originBadge) return;

  originBadge.className = 'origin-mini-flag';
  originBadge.innerHTML = `
    <span class="flag-colombia" aria-hidden="true"><i></i><i></i><i></i></span>
    <small>CO</small>
  `;
}

function simplifyFeatureStrip() {
  const featureStrip = document.querySelector('.feature-strip');
  if (!featureStrip) return;

  featureStrip.innerHTML = `
    <a class="feature-card" href="#contacto">
      <span class="feature-icon feature-map" aria-hidden="true">⌖</span>
      <h3>Contacto</h3>
      <p>Canales directos para hablar con Douxell y hacer tus pedidos.</p>
    </a>
    <a class="feature-card" href="#nosotros">
      <span class="feature-icon" aria-hidden="true">🍃</span>
      <h3>Quiénes somos</h3>
      <p>Conoce el origen, la esencia y la historia detrás de nuestra marca.</p>
    </a>
  `;
}

function removeDistributorSection() {
  document.querySelector('#distribuidor')?.remove();
  document.querySelectorAll('a[href="#distribuidor"]').forEach((link) => link.remove());
}

function wireHeartLikes() {
  document.querySelectorAll('.heart').forEach((heart) => {
    heart.setAttribute('type', 'button');
    heart.setAttribute('aria-label', 'Me gusta');

    heart.addEventListener('click', () => {
      const isLiked = heart.classList.toggle('liked');
      heart.textContent = isLiked ? '♥' : '♡';
      heart.setAttribute('aria-label', isLiked ? 'Quitar me gusta' : 'Me gusta');
      heart.classList.remove('heart-pulse');
      void heart.offsetWidth;
      heart.classList.add('heart-pulse');

      if (isLiked) {
        const burst = document.createElement('span');
        burst.className = 'heart-burst';
        burst.textContent = '♥';
        heart.appendChild(burst);
        setTimeout(() => burst.remove(), 850);
      }
    });
  });
}

function wireIconCards() {
  document.querySelectorAll('.feature-card').forEach((card) => {
    card.addEventListener('click', () => {
      card.classList.remove('icon-tap');
      void card.offsetWidth;
      card.classList.add('icon-tap');

      const burst = document.createElement('span');
      burst.className = 'icon-burst';
      burst.textContent = '✦';
      card.appendChild(burst);
      setTimeout(() => burst.remove(), 850);
    });
  });
}

function addContactButtons() {
  const contactSection = document.querySelector('.newsletter > div');
  if (!contactSection || document.querySelector('.contact-buttons')) return;

  const contactButtons = document.createElement('div');
  contactButtons.className = 'contact-buttons';
  contactButtons.innerHTML = `
    <a class="contact-btn instagram" href="#" aria-label="Instagram Douxell"><span>◎</span> Instagram</a>
    <a class="contact-btn whatsapp-contact" href="${whatsappPedidoUrl}" target="_blank" rel="noopener" aria-label="WhatsApp Douxell"><span>✆</span> WhatsApp</a>
    <a class="contact-btn email" href="#" aria-label="Correo Douxell"><span>✉</span> Correo</a>
  `;
  contactSection.appendChild(contactButtons);
}

replaceHeaderIcons();
replaceFloatingActions();
initMenu();
initTopBannerRotator();
updateProductPricingText();
renderCart();
applyPromoCallout();
updateTestimonials();
updateOriginBadge();
simplifyFeatureStrip();
removeDistributorSection();
wireCartToggles();
wireCartButtons();
wireHeartLikes();
wireIconCards();
addContactButtons();
