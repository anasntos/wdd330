export default class CheckoutProcess {
  constructor(cartItems) {
    this.cartItems = cartItems || [];
    this.subtotal = 0;
    this.shipping = 10; // valor fixo
    this.taxRate = 0.06; // 6% de imposto
    this.total = 0;
  }

  // Calcula subtotal e atualiza na tela
  calculateSubtotal() {
    this.subtotal = this.cartItems.reduce((sum, item) => sum + parseFloat(item.FinalPrice), 0);
    document.getElementById('subtotal').textContent = this.subtotal.toFixed(2);
    document.getElementById('orderSubtotal').textContent = `Subtotal: $${this.subtotal.toFixed(2)}`;
  }

  // Calcula tax, shipping e total e atualiza na tela
  calculateTotals(zipCode) {
    // Aqui você poderia ajustar shipping dependendo do zipCode se quiser
    const tax = this.subtotal * this.taxRate;
    this.total = this.subtotal + this.shipping + tax;

    document.getElementById('orderTax').textContent = `Tax (6%): $${tax.toFixed(2)}`;
    document.getElementById('orderShipping').textContent = `Shipping: $${this.shipping.toFixed(2)}`;
    document.getElementById('orderTotal').textContent = `Order Total: $${this.total.toFixed(2)}`;
  }

  // Simplifica os items para enviar ao servidor
  packageItems() {
    return this.cartItems.map(item => ({
      id: item.id || item.ID,
      name: item.Name,
      color: item.Colors[0].ColorName,
      price: parseFloat(item.FinalPrice),
      quantity: 1
    }));
  }

  // Envia o pedido para o servidor
  async checkout(form) {
    const formData = new FormData(form);
    const customer = Object.fromEntries(formData.entries());
    const items = this.packageItems();

    const payload = {
      customer,
      items,
      totals: {
        subtotal: this.subtotal,
        shipping: this.shipping,
        tax: this.subtotal * this.taxRate,
        total: this.total
      }
    };

    try {
      const response = await fetch('https://example.com/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('Network response was not ok');

      const data = await response.json();
      console.log('Checkout successful:', data);
      alert('Order placed successfully!');
      localStorage.removeItem('so-cart'); // limpa o carrinho
      window.location.href = 'thank-you.html';
    } catch (error) {
      console.error('Checkout failed:', error);
      alert('Checkout failed. Please try again.');
    }
  }
}
