import { loadHeaderFooter } from '../js/utils.mjs';
import { getLocalStorage } from './utils.mjs';

// Carrega header e footer
loadHeaderFooter();

// Seleciona elementos do DOM
const productList = document.querySelector('.product-list');
const subtotalElement = document.getElementById('subtotal'); // usa o existente no HTML
const checkoutBtn = document.getElementById('checkoutBtn') || createCheckoutButton();

// Cria botão de checkout caso não exista
function createCheckoutButton() {
  const btn = document.createElement('button');
  btn.id = 'checkoutBtn';
  btn.className = 'checkout-button';
  btn.textContent = 'Checkout';
  productList.parentElement.appendChild(btn);
  return btn;
}

// Renderiza produtos e subtotal
function renderCartContents() {
  const cartItems = getLocalStorage('so-cart') || [];

  // Renderiza produtos
  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  productList.innerHTML = htmlItems.join('');

  // Atualiza subtotal
  const subtotal = cartItems.reduce((total, item) => total + Number(item.FinalPrice), 0);
  if (subtotalElement) {
    subtotalElement.textContent = `Subtotal: $${subtotal.toFixed(2)}`;
  }
}

// Template do item do carrinho
function cartItemTemplate(item) {
  return `
    <li class="cart-card divider">
      <a href="#" class="cart-card__image">
        <img src="${item.Image}" alt="${item.Name}" />
      </a>
      <a href="#">
        <h2 class="card__name">${item.Name}</h2>
      </a>
      <p class="cart-card__color">${item.Colors[0].ColorName}</p>
      <p class="cart-card__quantity">qty: 1</p>
      <p class="cart-card__price">$${item.FinalPrice}</p>
    </li>
  `;
}

// Botão de checkout
checkoutBtn.addEventListener('click', () => {
  const cartItems = getLocalStorage('so-cart') || [];
  if (cartItems.length === 0) {
    alert('Seu carrinho está vazio!');
    return;
  }
  window.location.href = 'checkout/index.html';
});

// Inicializa renderização
renderCartContents();
