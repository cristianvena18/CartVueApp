let opciones = {
    data: () => ({
        product: new Product(1,
            'Medias',
            "Medias muy hermosas",
            'Sin marca',
            [
                { id: 1, color: 'Verde', image: './assets/images/socks_green.jpg', stock: 10, isOffered: true },
                { id: 2, color: 'Azul', image: './assets/images/socks_blue.jpg', stock: 20, isOffered: false }
            ]
        ),
        cart: new Cart(),
    }),
    methods: {
        increaseQuantity() {
            this.cart.storeProduct(this.product);
        },
        changeColor(id) {
            this.product.selectedModel = this.product.models.find(model => model.id === id) || {};
        },
        decreaseQuantity() {
            this.product = this.cart.decreaseProductQuantity(this.product);
        },
        cartHasProduct() {
            return this.cart.hasProductStored(this.product);
        }
    }
}

class Cart {
    constructor() {
        this.products = [];
    }

    findProduct(product) {
        return this.products.find(p => p.id === product.id && p.model.id === product.selectedModel.id);
    }

    storeProduct(product) {
        const storedProduct = this.findProduct(product);
        if (storedProduct) {
            this.__update(storedProduct);
        } else {
            this.products = this.products.concat({ id: product.id, model: { id: product.selectedModel.id, quantity: 1 } })
        }
    }

    decreaseProductQuantity(product) {
        const savedProduct = this.findProduct(product);
        if (savedProduct) {
            if (savedProduct.model.quantity > 1) {
                product.selectedModel.stock--;
                this.removeProduct(product);
                savedProduct.model.quantity--;
                this.products = this.products.concat([savedProduct]);
            } else {
                this.removeProduct(product);
            }
        } else {
            this.removeProduct(product);
        }
        return product;
    }

    removeProduct(product) {
        this.products = this.products.filter(p => p.id !== product.id && p.model.id !== product.selectedModel.id);
    }

    __update(product) {
        product.model.quantity++;
        this.removeProduct(product);
        this.products = this.products.concat([product]);
    }

    hasProductStored(product) {
        return this.products.length > 0 && this.products.some(p => p.id === product.id && p.model.id === product.selectedModel.id)
    }

    getQuantityProductsSaved() {
        return this.products.length;
    }
}

class Model {
    constructor(id, stock, image, isOffered) {
        this.id = id;
        this.stock = stock;
        this.image = image;
        this.isOffered = isOffered;
    }
}

class Product {
    constructor(id, name, description, brand, models) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.brand = brand;
        this.models = models;
        this.selectedModel = models[0] || {};
    }

    modelIsOffered() {
        return this.selectedModel.isOffered;
    }

    productHasModel(model) {
        return this.models.some(m => m.id === model.id);
    }
}

let app = Vue.createApp(opciones);

let appMontada = app.mount('#app');
