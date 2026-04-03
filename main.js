 var swiper = new Swiper(".mySwiper", {
    loop:true,
    navigation: {
        nextEl: "#next",
        prevEl: "#prev",
    },
});

const cartIcon = document.querySelector('.cart-icon');
const cartTab = document.querySelector('.cart-tab');
const closeBtn = document.querySelector('.close-btn');
const cardList = document.querySelector('.card-list');
const cartList = document.querySelector('.cart-list');

cartIcon.addEventListener("click",()=>cartTab.classList.add('cart-tab-active'));
closeBtn.addEventListener('click',() => cartTab.classList.remove('cart-tab-active'));


let productList = [];
let cartProduct = [];

const showCards = () => {
        productList.forEach(product => {
            const orderCard = document.createElement('div');
            orderCard.classList.add('order-card');

            orderCard.innerHTML = `
            <div class="order-card">
                <div class="card-image">
                    <img src="${product.image}">
                </div>
                <h4>${product.name}</h4>
                <h4 class="price">${product.price}</h4>
                <a herf="#" class="btn card-btn">Add to cart</a>
            </div> 
            `;

            cardList.appendChild(orderCard)

            const cardBtn  = orderCard.querySelector('.card-btn');
            cardBtn.addEventListener('click',(e) => {
                e.preventDefault();
                addToCart(product);
            });
        });
};

const addToCart =  (product) => {

    const existingProduct = cartProduct.find(item => item.id === product.id);
    if (existingProduct){
        alert('Item already in your cart!');
        return;
    }
    cartProduct.push(product);

    let quantity = 1;

    const cartItem = document.createElement('div');
    cartItem.classList.add('item');

    cartItem.innerHTML = `
        <div class="item-image">
            <img src="${product.image}">
        </div>
        <div class="detail">
            <h4>${product.name}</h4>
            <h4 class="item-total">${product.price}</h4>
        </div>
       <div class="flex">
            <a href="#" class="quantity-btn minus">
                <i class="fa-solid fa-minus"></i>
            </a>
            <h4 class="quantity-value">${quantity}</h4>
            <a href="#" class="quantity-btn plus">
                <i class="fa-solid fa-plus"></i>
            </a>
        </div>
    `;

    cartList.appendChild(cartItem);

    const plusBtn = cartItem.querySelector('.plus');
    const quantityValue = cartItem.querySelector('.quantity-value');

    plusBtn.addEventListener('click', (e) => {
        e.preventDefault();
        quantity++;
        quantityValue.textCotent = quantity;
    })
}

const initApp = () => {

    fetch('products.json').then
    (response => response.json()).then
    (date => {
        productList = date;
        showCards();
    })
}

initApp();