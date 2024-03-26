import items from "./items.json";
import formatCurrency from "./util/formatCurrency";

const cartButton = document.querySelector("[data-cart-button]");
const cartItemsWrapper = document.querySelector("[data-cart-items-wrapper]");
let shoppingCart = [];
const IMAGE_URL = "https://dummyimage.com/210x130";
const cartItemTemplate = document.querySelector("#cart-item-template");
const cartItemContainer = document.querySelector("[data-cart-items-container]");
const cartQuantity = document.querySelector("[data-cart-quantity]");
const cartTotal = document.querySelector("[data-cart-total]");
const cart = document.querySelector("[data-cart]");
const SESSION_STORAGE_KEY = "SHOPPING_CART_cart";
export default function setUpShoppingCart() {
  document.addEventListener("click", (e) => {
    if (e.target.matches("[data-remove-from-cart-button]")) {
      const id = parseInt(e.target.closest("[data-item]").dataset.itemId);
      removeFromCart(id);
    }
  });
  cartButton.addEventListener("click", () => {
    cartItemsWrapper.classList.toggle("invisible");
  });
  shoppingCart = loadCart();
  renderCart();
}

// remove items to the cart
// show/hide the cart button when it goes from 0 to 1
// persist across multiple pages
// calculate the accurate total
// handle multiple of the same item in the cart

// Show/hide items from the cart when clicked

export function addToCart(id) {
  const existingItem = shoppingCart.find((entry) => entry.id === id);
  if (existingItem) {
    existingItem.quantity++;
  } else {
    shoppingCart.push({ id: id, quantity: 1 });
  }
  renderCart();
  saveCart();
}

function renderCart() {
  if (shoppingCart.length === 0) {
    hideCart();
  } else {
    showCart();
    renderCartItems();
  }
}

function removeFromCart(id) {
  const existingItem = shoppingCart.find((entry) => entry.id === id);
  if (existingItem == null) return;
  shoppingCart = shoppingCart.filter((entry) => entry.id !== id);
  renderCart();
  saveCart();
}

function hideCart() {
  cart.classList.add("invisible");
  cartItemsWrapper.classList.add("invisible");
}

function showCart() {
  cart.classList.remove("invisible");
}
// Add items to the cart
// handle click event for adding
// handle multiple of the same item in the cart
// calculate the accurate total

function saveCart() {
  sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(shoppingCart));
}

function loadCart() {
  const cart = sessionStorage.getItem(SESSION_STORAGE_KEY);
  return JSON.parse(cart) || [];
}

function renderCartItems() {
  cartItemContainer.innerHTML = "";
  cartQuantity.innerText = shoppingCart.length;
  cartTotal.innerText = formatCurrency(0);
  let totalprice = 0;
  shoppingCart.forEach((entry) => {
    const item = items.find((i) => entry.id === i.id);
    const cartItem = cartItemTemplate.content.cloneNode(true);

    const container = cartItem.querySelector("[data-item]");
    container.dataset.itemId = item.id;

    const name = cartItem.querySelector("[data-name]");
    name.innerText = item.name;

    const image = cartItem.querySelector("[data-image]");
    image.src = `${IMAGE_URL}/${item.imageColor}/${item.imageColor}`;

    if (entry.quantity > 1) {
      const quantity = cartItem.querySelector("[data-quantity]");
      quantity.innerText = `x${entry.quantity}`;
    }

    const price = cartItem.querySelector("[data-price]");
    const cost = (item.priceCents * entry.quantity) / 100;
    price.innerText = formatCurrency(cost);
    totalprice += cost;

    cartItemContainer.appendChild(cartItem);
  });
  cartTotal.innerText = formatCurrency(totalprice);
}
