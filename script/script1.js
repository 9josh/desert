import data from './data.js';

const desertWrapper = document.querySelector('.desert-list-wrapper');


// adding unique "id"s to data objects
data.forEach((obj, index) => {
    obj.id = index + 1;
});

document.addEventListener('DOMContentLoaded', getDesertContent);

// Desert items array to be added to desert wrapper
let desertItems = [];
let basket = JSON.parse(localStorage.getItem('storedData')) || [];

// Function to display desert items 
function getDesertContent() {
    desertItems = data.map((item) => {
        let { imgaging, price, name, category, id } = item;   
        let search = basket.find((x) => x.id == id) || []; 

        return `
            <!-- Product begins -->
            <div class="product" id="product-${id}">
                <!-- Product image and button -->
                <div class="prod-img-butt">
                    <img width="200" src="${imgaging}" alt="creme brulee">
                    <button class="prod-add-button">
                        <i class="bi bi-cart3"></i> Add to Cart
                        <div class="add-minus-icons">
                            <div>
                                <svg id="decrement-${id}" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-dash" viewBox="0 0 16 16">
                                    <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8"/>
                                </svg>

                                <p class="quantity" id="quantity-${id}">
                                ${search.item === undefined ? 0 : search.item}
                                </p>

                                <svg id="increment-${id}" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus" viewBox="0 0 16 16">
                                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
                                </svg>
                            </div>
                        </div>
                    </button>
                </div>

                <!-- Product details -->
                <div class="product-details">
                    <p class="prod-name">${name}</p>
                    <h3 class="prod-category">${category}</h3>
                    <h4 class="prod-price">$ ${price.toFixed(2)}</h4>
                </div>
            </div>
        `;
    }).join(" ");
    desertWrapper.innerHTML = desertItems;

    // add eventlisteners to increment and decrement
    data.forEach((item) => {
          document.getElementById(`increment-${item.id}`).addEventListener('click', () => increment(`${item.id}`));
          document.getElementById(`decrement-${item.id}`).addEventListener('click', () => decrement(`${item.id}`));
    });
};


// Increase and decrease desert count and update functions
   // increment
function increment(id) {
    let search = basket.find((x) => x.id === id);
    if (search === undefined) {
        basket.push({
            id: id,
            item: 1
        })
    }
    else {
        search.item += 1
    }

    localStorage.setItem("storedData", JSON.stringify(basket));
    update(id);

    getCart(id);
    totalAmount()
}

   // decrement
function decrement(id) {
    let search = basket.find((x) => x.id === id);
    if (search === undefined) return
    if (search.item === 0) return
    else {
        search.item -= 1
    }

    update(id);
    basket = basket.filter((x) => x.item !== 0);
    localStorage.setItem("storedData", JSON.stringify(basket));

    getCart(id);

    totalAmount()

    
}
   // update 
const update = (id) => {
    let quantity = document.getElementById(`quantity-${id}`)
    let search = basket.find((x) => x.id === id);

    quantity.textContent = search.item; 
    
    calculate(); 

}   


// function to get and display selected desset items and display them
const getCart = (id) => {
    const cartItems = document.getElementById('selected-deserts');
    const emptyCart = document.getElementById('empty-cart');
    const totalConfirm = document.querySelector('.total-confirm');

    // display desert items if basket is not empty
     if (!(basket.length === 0)) {
        emptyCart.classList.add('d-none');
        cartItems.classList.remove('d-none')
        totalConfirm.classList.remove('d-none');

        cartItems.innerHTML = basket.map((x) => {
            let {id, item} = x;
            let search = data.find((y) => y.id == id);

            let price = search.price * item;

            return `
                  <div class="cart-item">
                        <div class="item-details">
                            <h4 class="item-name">${search.name}</h4>
                            <div class="item-pricing">
                                <P class="item-count">${item}x</p>
                                <P class="item-price">@ ${search.price}</p>
                                <P class="item-count-price">$ ${price.toFixed(2)}</p>
                            </div>
                        </div>
                        <div class="cancel-item" id="cancelItem-${id}">
                            x
                        </div>
               </div>
            `;

        }).join(" ");

        basket.forEach((x) => {
            document.getElementById(`cancelItem-${x.id}`).addEventListener('click', () => cancel(`${x.id}`));
        });

        document.querySelector('.order-btn').addEventListener('click', () => confirmOrder());


     }

     // display empty cart
     else {
        cartItems.classList.add('d-none')
        emptyCart.classList.remove('d-none');
        totalConfirm.classList.add('d-none');

        emptyCart.innerHTML = `
              <div class="empty-img-box">
                  <svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" fill="none" viewBox="0 0 128 128"><path fill="#260F08" d="M8.436 110.406c0 1.061 4.636 2.079 12.887 2.829 8.252.75 19.444 1.171 31.113 1.171 11.67 0 22.861-.421 31.113-1.171 8.251-.75 12.887-1.768 12.887-2.829 0-1.061-4.636-2.078-12.887-2.828-8.252-.75-19.443-1.172-31.113-1.172-11.67 0-22.861.422-31.113 1.172-8.251.75-12.887 1.767-12.887 2.828Z" opacity=".15"/><path fill="#87635A" d="m119.983 24.22-47.147 5.76 4.32 35.36 44.773-5.467a2.377 2.377 0 0 0 2.017-1.734c.083-.304.104-.62.063-.933l-4.026-32.986Z"/><path fill="#AD8A85" d="m74.561 44.142 47.147-5.754 1.435 11.778-47.142 5.758-1.44-11.782Z"/><path fill="#CAAFA7" d="M85.636 36.78a2.4 2.4 0 0 0-2.667-2.054 2.375 2.375 0 0 0-2.053 2.667l.293 2.347a3.574 3.574 0 0 1-7.066.88l-1.307-10.667 14.48-16.88c19.253-.693 34.133 3.6 35.013 10.8l1.28 10.533a1.172 1.172 0 0 1-1.333 1.307 4.696 4.696 0 0 1-3.787-4.08 2.378 2.378 0 1 0-4.72.587l.294 2.346a2.389 2.389 0 0 1-.484 1.755 2.387 2.387 0 0 1-1.583.899 2.383 2.383 0 0 1-1.755-.484 2.378 2.378 0 0 1-.898-1.583 2.371 2.371 0 0 0-1.716-2.008 2.374 2.374 0 0 0-2.511.817 2.374 2.374 0 0 0-.493 1.751l.293 2.373a4.753 4.753 0 0 1-7.652 4.317 4.755 4.755 0 0 1-1.788-3.17l-.427-3.547a2.346 2.346 0 0 0-2.666-2.053 2.4 2.4 0 0 0-2.08 2.667l.16 1.173a2.378 2.378 0 1 1-4.72.587l-.107-1.28Z"/><path stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width=".974" d="m81.076 28.966 34.187-4.16"/><path fill="#87635A" d="M7.45 51.793c-.96 8.48 16.746 17.44 39.466 19.947 22.72 2.506 42.08-2.16 43.04-10.667l-3.947 35.493c-.96 8.48-20.24 13.334-43.04 10.667S2.463 95.74 3.423 87.18l4.026-35.387Z"/><path fill="#AD8A85" d="M5.823 65.953c-.96 8.453 16.746 17.44 39.573 20.027 22.827 2.586 42.053-2.187 43.013-10.667L87.076 87.1c-.96 8.48-20.24 13.333-43.04 10.666C21.236 95.1 3.53 86.22 4.49 77.74l1.334-11.787Z"/><path fill="#CAAFA7" d="M60.836 42.78a119.963 119.963 0 0 0-10.347-1.627c-24-2.667-44.453 1.893-45.333 10.373l-2.133 18.88a3.556 3.556 0 1 0 7.066.8 3.574 3.574 0 1 1 7.094.8l-.8 7.094a5.93 5.93 0 1 0 11.786 1.333 3.556 3.556 0 0 1 7.067.8l-.267 2.347a3.573 3.573 0 0 0 7.094.826l.133-1.2a5.932 5.932 0 1 1 11.787 1.36l-.4 3.52a3.573 3.573 0 0 0 7.093.827l.933-8.267a1.174 1.174 0 0 1 1.307-.906 1.146 1.146 0 0 1 1.04 1.306 5.947 5.947 0 0 0 11.813 1.334l.534-4.72a3.556 3.556 0 0 1 7.066.8 3.573 3.573 0 0 0 7.094.826l1.786-15.546a2.373 2.373 0 0 0-2.08-2.667L44.143 55.74l16.693-12.96Z"/><path fill="#87635A" d="m59.156 57.66 1.68-14.88-16.827 13.173 15.147 1.707Z"/><path stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width=".974" d="M9.796 52.06c-.667 5.866 16.24 12.586 37.733 15.04 14.774 1.68 27.867.906 34.854-1.654"/></svg>
              </div>   
              <p class="empty-message">Your added items will appear here.</p>
     `;
     }
};
getCart();

// calculations 
const calculate = () => {
    let cartCount = document.querySelector('.cart-display .cart-count span');
    cartCount.textContent = `(${basket.map((x) => x.item).reduce((x,y) => x + y, 0)})` ;
};
calculate(); 


// function to cancel/ remove dessert items from cart 
const cancel = (id) => {
    basket = basket.filter((x) => !(x.id == id));
    localStorage.setItem("storedData", JSON.stringify(basket));

    getCart();
    calculate(); 

    totalAmount();
    
    getDesertContent();
};


// total amount 
const totalAmount = () => {
    if (basket.length !== 0) {
        let amount = basket.map((x) => {
            let {item, id} = x
            let search = data.find((y) => y.id == id);

            return Number((item * search.price).toFixed(2));
        });

        let total = amount.reduce((x,y) => x + y, 0);

        document.getElementById('total').textContent = `$ ${total.toFixed(2)}`;

    }
    else return
};
totalAmount();


// display confirmation order
const confirmOrder = () => {
    const confirmation = document.querySelector('.confirmation');
    const confirmedDesertWrap = document.querySelector('.confirmed-desert');
    
    if (basket.length !== 0) {
        confirmation.classList.remove('d-none');
        confirmedDesertWrap.innerHTML = basket.map((x) => {
            let {id, item} = x;
            let search = data.find((y) => y.id == id);

            return `
                 <div class="dess">
                              <div class="img-pricing">
                                 <div class="img-box">
                                    <img width="50" src=${search.imgaging} alt=${search.category}>
                                 </div>
                                 <div class="pricing-rate">
                                    <p class="dess-name">${search.name}</p>
                                    <p class="pricing-dess">
                                       <span class="dess-count">${item}x</span>
                                       <span class="dess-price">@ $${search.price}</span>
                                    </p>
                                 </div>
                              </div>
                              <div class="dess-count-price">
                                 <p>$ ${(item * search.price).toFixed(2)}</p>
                              </div>
                </div>
            `;
        }).join(' ');

        document.querySelector('.btn-box button').addEventListener('click', () => startNewOrder())
    }
    else return

   const total = () => {
    if (basket.length !== 0) {
        let amount = basket.map((x) => {
            let {item, id} = x
            let search = data.find((y) => y.id == id);

            return Number((item * search.price).toFixed(2));
        });

        let total = amount.reduce((x,y) => x + y, 0);

        document.querySelector('.amount-pay .amount').textContent = `$ ${total.toFixed(2)}`;

    }
    else return
   }

   total();

}

// start new order function 
const startNewOrder = () => {
     const confirmation = document.querySelector('.confirmation');
     confirmation.classList.add('d-none');

     basket = [];
     localStorage.setItem("storedData", JSON.stringify(basket));

     getDesertContent();
     calculate(); 
     getCart();
}

