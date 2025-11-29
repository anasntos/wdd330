import { loadHeaderFooter } from '../js/utils.mjs';
loadHeaderFooter();

import { getLocalStorage } from './utils.mjs';

const productList = document.querySelector('.product-list');
const subtotalElement = document.createElement('p');
subtotalElement.id = 'subtotal';
subtotalElement.className = 'cart-subtotal';
productList.parentElement.appendChild(subtotalElement);

const checkoutBtn = document.createElement('button');
checkoutBtn.id = 'checkoutBtn';
checkoutBtn.className = 'checkout-button';
checkoutBtn.textContent = 'Checkout';
productList.parentElement.appendChild(checkoutBtn);

function renderCartContents() {
  const cartItems = getLocalStorage('so-cart') || [];

  // Renderiza os produtos
  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  productList.innerHTML = htmlItems.join('');

  // Calcula subtotal
  const subtotal = cartItems.reduce((total, item) => total + Number(item.FinalPrice), 0);
  subtotalElement.textContent = `Subtotal: $${subtotal.toFixed(2)}`;
}

// Template do item do carrinho
function cartItemTemplate(item) {
  return `
    <li class="cart-card divider">
      <a href="#" class="cart-card__image">
        <img
          src="${item.Image}"
          alt="${item.Name}"
        />
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

// Inicializa
renderCartContents();
