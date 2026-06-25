const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');
const cartPanel = document.getElementById('cartPanel');
const closeCart = document.querySelector('.close-cart');
const cartToggles = document.querySelectorAll('.cart-toggle');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const cartCount = document.getElementById('cartCount');
const floatCartCount = document.getElementById('floatCartCount');
const addCartButtons = document.querySelectorAll('.add-cart');
const modal = document.getElementById('welcomeModal');
const closeModal = document.querySelector('.close-modal');
const forms = document.querySelectorAll('form');

const formatter = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
});

const cart = [];

menuToggle?.addEventListener('click', () => {
  mainNav.classList.toggle('open');
});

document.querySelectorAll('.main-nav a').forEach((link) => {
  link.addEventListener('click', () => mainNav.classList.remove('open'));
});

cartToggles.forEach((button) => {
  button.addEventListener('click', () => {
    cartPanel.classList.add('open');
  });
});

closeCart?.addEventListener('click', () => {
  cartPanel.classList.remove('open');
});

addCartButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const card = button.closest('.product-card');
    const name = card.dataset.name;
    const price = Number(card.dataset.price);
    const item = cart.find((product) => product.name === name);

    if (item) {
      item.quantity += 1;
    } else {
      cart.push({ name, price, quantity: 1 });
    }

    renderCart();
    cartPanel.classList.add('open');
  });
});

function renderCart() {
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

  cartCount.textContent = totalItems;
  floatCartCount.textContent = totalItems;
  cartTotal.textContent = formatter.format(total);

  const message = cart.length
    ? `Hola, quiero hacer un pedido Douxell: ${cart.map((item) => `${item.quantity} ${item.name}`).join(', ')}. Total aproximado: ${formatter.format(total)}`
    : 'Hola, quiero conocer los productos Douxell';

  document.querySelector('.cart-whatsapp').href = `https://wa.me/573000000000?text=${encodeURIComponent(message)}`;
}

setTimeout(() => {
  if (!localStorage.getItem('douxellModalClosed')) {
    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
  }
}, 900);

function closeWelcomeModal() {
  modal.classList.remove('show');
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('no-scroll');
  localStorage.setItem('douxellModalClosed', 'true');
}

closeModal?.addEventListener('click', closeWelcomeModal);

modal?.addEventListener('click', (event) => {
  if (event.target === modal) {
    closeWelcomeModal();
  }
});

forms.forEach((form) => {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    alert('Gracias por conectar con Douxell. Muy pronto recibirás nuestras novedades.');
    if (form.classList.contains('modal-form')) {
      closeWelcomeModal();
    }
    form.reset();
  });
});

renderCart();
