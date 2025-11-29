// --- TEST SETUP: produtos de exemplo no localStorage ---
if (!localStorage.getItem("so-cart")) {
  const testCart = [
    {
      ID: "P001",
      Name: "Tent Deluxe",
      Colors: [{ ColorName: "Green" }],
      Image: "../images/tent1.jpg",
      FinalPrice: "99.99"
    },
    {
      ID: "P002",
      Name: "Sleeping Bag",
      Colors: [{ ColorName: "Blue" }],
      Image: "../images/sleepingbag.jpg",
      FinalPrice: "49.99"
    }
  ];
  localStorage.setItem("so-cart", JSON.stringify(testCart));
}

import { loadHeaderFooter } from "../js/utils.mjs";
import { getLocalStorage } from "./utils.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";

// Carrega header e footer
loadHeaderFooter();

// Pega elementos do DOM
const productList = document.querySelector(".checkout-list");
const checkoutForm = document.getElementById("checkoutForm");
const zipInput = checkoutForm.querySelector('input[name="zip"]');

// Pega os itens do carrinho
const cartItems = getLocalStorage("so-cart") || [];

// Instancia CheckoutProcess
const checkout = new CheckoutProcess(cartItems);

// Renderiza os produtos no checkout
function renderCartContents() {
  if (!productList) return;

  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  productList.innerHTML = htmlItems.join("");

  // Calcula subtotal inicial
  checkout.calculateSubtotal();
}

// Template de item do carrinho
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

// Calcula totais quando o usuário digitar o zip code
if (zipInput) {
  zipInput.addEventListener("input", (e) => {
    checkout.calculateTotals(e.target.value);
  });
}

// Submete o formulário de checkout
if (checkoutForm) {
  checkoutForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Define valores padrão para teste
    checkoutForm.querySelector('input[name="cardNumber"]').value = "1234123412341234";
    checkoutForm.querySelector('input[name="expiration"]').value = "12/30";
    checkoutForm.querySelector('input[name="code"]').value = "123";

    // Cria objeto final para envio
    const formData = new FormData(checkoutForm);
    const customer = Object.fromEntries(formData.entries());
    const items = checkout.packageItems();

    const orderObject = {
      orderDate: new Date().toISOString(),
      fname: customer.fname,
      lname: customer.lname,
      street: customer.street,
      city: customer.city,
      state: customer.state,
      zip: customer.zip,
      cardNumber: customer.cardNumber,
      expiration: customer.expiration,
      code: customer.code,
      items: items,
      orderTotal: checkout.total.toFixed(2),
      shipping: checkout.shipping,
      tax: (checkout.subtotal * checkout.taxRate).toFixed(2)
    };

    try {
      const response = await fetch("https://wdd330-backend.onrender.com/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderObject)
      });

      if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();
      console.log("Checkout successful:", data);
      alert("Order placed successfully!");
      localStorage.removeItem("so-cart"); // limpa o carrinho
      window.location.href = "../thank-you.html";
    } catch (error) {
      console.error("Checkout failed:", error);
      alert("Checkout failed. Please try again.");
    }
  });
}

// Inicializa renderização
renderCartContents();
