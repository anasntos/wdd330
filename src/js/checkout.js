import { loadHeaderFooter } from "../js/utils.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";
import { getLocalStorage } from "./utils.mjs";

loadHeaderFooter();

// Pega os itens do carrinho do localStorage
const cartItems = getLocalStorage('so-cart') || [];

// Instancia a classe CheckoutProcess
const checkout = new CheckoutProcess(cartItems);

// Renderiza os itens no HTML
function renderCartItems() {
  const listEl = document.querySelector('.checkout-list');
  if (!listEl) return;

  listEl.innerHTML = cartItems.map(item => `
    <li class="cart-card divider">
      <span class="cart-card__name">${item.Name}</span>
      <span class="cart-card__color">${item.Colors[0].ColorName}</span>
      <span class="cart-card__price">$${parseFloat(item.FinalPrice).toFixed(2)}</span>
    </li>
  `).join('');
}

// Calcula e mostra o subtotal ao carregar a página
renderCartItems();
checkout.calculateSubtotal();

// Se você quiser atualizar totals ao preencher o Zip Code
const zipInput = document.querySelector('input[name="zip"]');
if (zipInput) {
  zipInput.addEventListener('blur', () => {
    checkout.calculateTotals(zipInput.value);
  });
}

// Evento de submit do formulário
const form = document.getElementById('checkoutForm');
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    await checkout.checkout(form);
  });
}
