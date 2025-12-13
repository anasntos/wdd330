import ExternalServices from "./ExternalServices.mjs";
import { setLocalStorage, loadHeaderFooter, qs, renderWithTemplate } from "./utils.mjs";

loadHeaderFooter();

// pegar o id do produto da URL
const productId = new URLSearchParams(window.location.search).get("product");

// carregar dados do produto
const dataSource = new ProductData("tents");

// função para adicionar ao carrinho
function addProductToCart(product) {
  let cart = JSON.parse(localStorage.getItem("so-cart")) || [];
  cart.push(product);
  setLocalStorage("so-cart", cart);
}

async function showProductDetails() {
  const product = await dataSource.findProductById(productId);

  // carregar template da página
  const template = qs("#product-template");

  // renderizar conteúdo
  renderWithTemplate(
    template,
    qs(".product-detail"),
    product,
    () => {
      // adicionar evento ao botão Add to Cart
      qs("#addToCart").addEventListener("click", () => {
        addProductToCart(product);
      });
    }
  );
}

showProductDetails();

const newsletterForm = document.querySelector("#newsletter-form");
const message = document.querySelector("#newsletter-message");

newsletterForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const email = document.querySelector("#newsletter-email").value;

  message.textContent = "Thank you for subscribing!";
  newsletterForm.reset();

  // opcional: salvar no localStorage
  localStorage.setItem("newsletterEmail", email);
});
