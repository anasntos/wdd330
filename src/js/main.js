import { loadHeaderFooter } from './utils.mjs';

loadHeaderFooter();

document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('registerModal');
  const closeBtn = document.querySelector('.close-btn');
  const registerBtn = document.getElementById('registerBtn');

  // Mostrar modal apenas na primeira visita
  if (!localStorage.getItem('hasVisited')) {
    modal.style.display = 'block';
  }

  // Fechar modal ao clicar no X
  closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
    localStorage.setItem('hasVisited', 'true');
  });

  // Fechar modal e ir para página de registro
  registerBtn.addEventListener('click', () => {
    localStorage.setItem('hasVisited', 'true');
    window.location.href = 'register.html'; // troque para a página de registro real
  });

  // Fechar modal clicando fora do conteúdo
  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
      localStorage.setItem('hasVisited', 'true');
    }
  });
});
