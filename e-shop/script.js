
const products = [
    {
        id: 1,
        name: "Kablosuz Kulaklık",
        category: "electronics",
        categoryName: "Elektronik",
        price: 1299,
        image: "images.jpg"
    },

    {
        id: 2,
        name: "Akıllı Saat",
        category: "electronics",
        categoryName: "Elektronik",
        price: 2499,
        image: "saat.jpg"
    },

    {
        id: 3,
        name: "Sneaker",
        category: "clothing",
        categoryName: "Giyim",
        price: 1899,
        image: "i.jpg"
    },

    {
        id: 4,
        name: "Basic T-Shirt",
        category: "clothing",
        categoryName: "Giyim",
        price: 499,
        image: "images (1).jpg"
    },

    {
        id: 5,
        name: "Güneş Gözlüğü",
        category: "accessories",
        categoryName: "Aksesuar",
        price: 799,
        image: "images (3).jpg"
    },

    {
        id: 6,
        name: "Cüzdan",
        category: "accessories",
        categoryName: "Aksesuar",
        price: 699,
        image: "images (4).jpg"
    },

    {
        id: 7,
        name: "Laptop",
        category: "electronics",
        categoryName: "Elektronik",
        price: 24999,
        image: "images (2).jpg"
    },

    {
        id: 8,
        name: "Sırt Çantası",
        category: "accessories",
        categoryName: "Aksesuar",
        price: 1199,
        image: "canta.jpg"
    }
];


const productList = document.getElementById("product-list");

const searchInput = document.getElementById("search-input");

const categoryFilter = document.getElementById("category-filter");

const cartCount = document.getElementById("cart-count");

const cartPanel = document.getElementById("cart-panel");

const cartItems = document.getElementById("cart-items");

const cartTotal = document.getElementById("cart-total");

const closeCart = document.getElementById("close-cart");

const overlay = document.getElementById("overlay");

const checkoutBtn = document.getElementById("checkout-btn");

// SEPET

// Daha önce kayıtlı sepet varsa al, yoksa boş array oluştur

let cart = JSON.parse(localStorage.getItem("cart")) || [];



// ÜRÜNLERİ GÖSTER


function displayProducts(productArray) {

    productList.innerHTML = "";

    if (productArray.length === 0) {

        productList.innerHTML = `
            <p>Ürün bulunamadı.</p>
        `;

        return;
    }


    productArray.forEach(product => {

        const productCard = document.createElement("div");

        productCard.classList.add("product-card");


        productCard.innerHTML = `

            <img
                src="${product.image}"
                alt="${product.name}"
                class="product-image"
            >

            <div class="product-info">

                <h3>${product.name}</h3>

                <p class="category">
                    ${product.categoryName}
                </p>

                <p class="price">
                    ${product.price.toLocaleString("tr-TR")} ₺
                </p>

                <button
                    class="add-cart"
                    onclick="addToCart(${product.id})"
                >
                    Sepete Ekle
                </button>

            </div>
        `;


        productList.appendChild(productCard);

    });
}

// SEPETE ÜRÜN EKLE


function addToCart(productId) {

    const product = products.find(
        product => product.id === productId
    );


    const existingProduct = cart.find(
        item => item.id === productId
    );


    if (existingProduct) {

        existingProduct.quantity++;

    } else {

        cart.push({
            ...product,
            quantity: 1
        });

    }


    saveCart();

    updateCart();


}

// SEPETTEN ÜRÜN SİL

function removeFromCart(productId) {

    cart = cart.filter(
        item => item.id !== productId
    );


    saveCart();

    updateCart();
}


// ÜRÜN ADEDİNİ DEĞİŞTİR

function changeQuantity(productId, change) {

    const product = cart.find(
        item => item.id === productId
    );


    if (!product) return;


    product.quantity += change;


    // Adet 0 olursa ürünü sil
    if (product.quantity <= 0) {

        removeFromCart(productId);

        return;
    }


    saveCart();

    updateCart();
}



// SEPETİ GÜNCELLE

function updateCart() {

    cartItems.innerHTML = "";


    // Toplam ürün sayısı

    const totalQuantity = cart.reduce(
        (total, item) => total + item.quantity,
        0
    );


    cartCount.textContent = totalQuantity;


    // Sepet boşsa

    if (cart.length === 0) {

        cartItems.innerHTML = `
            <div class="empty-cart">
                <p>Sepetin şu anda boş.</p>
            </div>
        `;

        cartTotal.textContent = "0 ₺";

        return;
    }


    // Ürünleri oluştur
    cart.forEach(item => {

        const cartItem = document.createElement("div");

        cartItem.classList.add("cart-item");


        cartItem.innerHTML = `

            <div class="cart-item-info">

                <h4>${item.name}</h4>

                <p class="cart-item-price">
                    ${item.price.toLocaleString("tr-TR")} ₺
                </p>

                <div class="quantity">

                    <button
                        onclick="changeQuantity(${item.id}, -1)"
                    >
                        -
                    </button>

                    <span>
                        ${item.quantity}
                    </span>

                    <button
                        onclick="changeQuantity(${item.id}, 1)"
                    >
                        +
                    </button>

                </div>

            </div>


            <button
                class="remove-btn"
                onclick="removeFromCart(${item.id})"
            >
                🗑️
            </button>

        `;


        cartItems.appendChild(cartItem);

    });


    // Toplam fiyat

    const totalPrice = cart.reduce(
        (total, item) => {
            return total + (item.price * item.quantity);
        },
        0
    );


    cartTotal.textContent =
        `${totalPrice.toLocaleString("tr-TR")} ₺`;
}



// LOCAL STORAGE

function saveCart() {

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );
}

// ARAMA

searchInput.addEventListener("input", filterProducts);

// KATEGORİ FİLTRESİ

categoryFilter.addEventListener(
    "change",
    filterProducts
);

// ÜRÜNLERİ FİLTRELE

function filterProducts() {

    const searchText =
        searchInput.value.toLowerCase();

    const selectedCategory =
        categoryFilter.value;


    const filteredProducts = products.filter(product => {

        const matchesSearch =
            product.name
                .toLowerCase()
                .includes(searchText);


        const matchesCategory =
            selectedCategory === "all" ||
            product.category === selectedCategory;


        return matchesSearch && matchesCategory;

    });


    displayProducts(filteredProducts);
}


// SEPETİ AÇ

document
    .querySelector(".cart")
    .addEventListener("click", () => {

        cartPanel.classList.add("active");

        overlay.classList.add("active");

    });



// SEPETİ KAPAT


closeCart.addEventListener("click", closeCartPanel);

overlay.addEventListener("click", closeCartPanel);


function closeCartPanel() {

    cartPanel.classList.remove("active");

    overlay.classList.remove("active");
}


// SİPARİŞ VER


checkoutBtn.addEventListener("click", () => {

    if (cart.length === 0) {

        alert("Sepetiniz boş!");

        return;
    }


    alert("Siparişiniz başarıyla oluşturuldu! 🎉");


    cart = [];

    saveCart();

    updateCart();

});

// UYGULAMAYI BAŞLAT


displayProducts(products);

updateCart();
