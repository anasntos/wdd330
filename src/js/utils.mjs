// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}
// or a more concise version if you are into that sort of thing:
// export const qs = (selector, parent = document) => parent.querySelector(selector);

// retrieve data from localstorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}
// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener("click", callback);
}

// render a template with data and insert it into a parent element
export function renderWithTemplate(template, parent, data, callback) {
  parent.innerHTML = "";
  data.forEach(item => {
    const clone = template.content.cloneNode(true);
    if (callback) {
      callback(clone, item);
    }
    parent.appendChild(clone);
  });
}


export async function loadTemplate(path) {
  const response = await fetch(path);
  const template = await response.text();
  return template;
}

export async function loadHeaderFooter() {
  const header = await loadTemplate('/partials/header.html');
  const footer = await loadTemplate('/partials/footer.html');

  const headerElement = document.getElementById('main-header');
  const footerElement = document.getElementById('main-footer');

  renderWithTemplate(header, headerElement);
  renderWithTemplate(footer, footerElement);
}
