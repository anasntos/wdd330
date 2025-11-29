import { setLocalStorage } from "./utils.mjs";
import { getLocalStorage } from "./utils.mjs";

export default class ProductDetails {
  constructor(productId, dataSource, element) {
    this.productId = productId;
    this.dataSource = dataSource;
    this.element = element;
  }

  async init() {
    const product = await this.dataSource.findProductById(this.productId);
    this.renderProductDetails(product);

    // botão add to cart
    document.querySelector("#addToCart")
      .addEventListener("click", () => this.addProductToCart(product));
  }

  async renderProductDetails(product) {
    const template = document.querySelector("#product-template");
    const clone = template.content.cloneNode(true);

    clone.querySelector(".product__image").src = product.Image;
    clone.querySelector(".product__image").alt = product.Name;
    clone.querySelector(".product__name").textContent = product.Name;
    clone.querySelector(".product__price").textContent = `$${product.FinalPrice}`;
    clone.querySelector(".product__color").textContent = product.Colors[0].ColorName;
    clone.querySelector(".product__description").textContent = product.Description;

    this.element.appendChild(clone);
  }

  addProductToCart(product) {
    const cart = getLocalStorage("so-cart") || [];
    cart.push(product);
    setLocalStorage("so-cart", cart);
    alert("Product added to cart!");
  }
}
