// =============================================
// SHOPPING CART CLASS
// =============================================

// CLASS: ShoppingCart
// This is like a blueprint for creating a shopping cart
class ShoppingCart {
    
    // CONSTRUCTOR: Runs when we create a new cart
    constructor() {
        this.items = [];  // Array to store cart items
        this.loadFromStorage();  // Load saved cart
        this.setupButtons();  // Setup all buttons
    }
    
    // =========================================
    // LOCALSTORAGE METHODS
    // =========================================
    
    // Load cart from browser memory
    loadFromStorage() {
        const savedCart = localStorage.getItem('cartItems');
        
        if (savedCart) {
            this.items = JSON.parse(savedCart);
        } else {
            this.items = [];
        }
        
        this.updateDisplay();
    }
    
    // Save cart to browser memory
    saveToStorage() { 
        localStorage.setItem('cartItems', JSON.stringify(this.items));
    }
    
    // =========================================
    // ADD/REMOVE/UPDATE METHODS
    // =========================================
    
    // Add item to cart
    addItem(id, name, price) {
        // Check if item already exists
        let found = false;
        
        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i].id === id) {
                // Item exists, increase quantity
                this.items[i].quantity = this.items[i].quantity + 1;
                found = true;
                break;
            }
        }
        
        // If not found, add new item
        if (!found) {
            const newItem = {
                id: id,
                name: name,
                price: parseFloat(price),
                quantity: 1
            };
            this.items.push(newItem);
        }
        
        this.saveToStorage();
        this.updateDisplay();
        this.showNotification(name);
        this.animateCartIcon();
    }
    
    // Remove item from cart
    removeItem(id) {
        const newItems = [];
        
        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i].id !== id) {
                newItems.push(this.items[i]);
            }
        }
        
        this.items = newItems;
        this.saveToStorage();
        this.updateDisplay();
    }
    
    // Change item quantity
    changeQuantity(id, change) {
        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i].id === id) {
                this.items[i].quantity = this.items[i].quantity + change;
                
                // Remove if quantity is 0 or less
                if (this.items[i].quantity <= 0) {
                    this.removeItem(id);
                    return;
                }
                break;
            }
        }
        
        this.saveToStorage();
        this.updateDisplay();
    }
    
    // Clear all items
    clearAll() {
        if (this.items.length === 0) return;
        
        const confirm = window.confirm('Clear all items from cart?');
        
        if (confirm) {
            this.items = [];
            this.saveToStorage();
            this.updateDisplay();
        }
    }
    
    // =========================================
    // CALCULATE METHODS
    // =========================================
    
    // Calculate totals
    calculateTotals() {
        let subtotal = 0;
        
        // Add up all items
        for (let i = 0; i < this.items.length; i++) {
            const itemTotal = this.items[i].price * this.items[i].quantity;
            subtotal = subtotal + itemTotal;
        }
        
        // Calculate shipping
        let shipping = 0;
        if (subtotal > 0 && subtotal <= 1000) {
            shipping = 25;
        }
        
        const total = subtotal + shipping;
        
        return {
            subtotal: subtotal,
            shipping: shipping,
            total: total
        };
    }
    
    // Count total items
    getTotalItems() {
        let total = 0;
        
        for (let i = 0; i < this.items.length; i++) {
            total = total + this.items[i].quantity;
        }
        
        return total;
    }
    
    // =========================================
    // DISPLAY UPDATE METHODS
    // =========================================
    
    // Update everything on screen
    updateDisplay() {
        this.updateBadge();
        this.updateItemsList();
        this.updateTotals();
    }
    
    // Update cart badge number
    updateBadge() {
        const badge = document.getElementById('cartBadge');
        const total = this.getTotalItems();
        
        badge.textContent = total;
        
        if (total > 0) {
            badge.style.display = 'flex';
        } else {
            badge.style.display = 'none';
        }
    }
    
    // Update cart items list
    updateItemsList() {
        const cartBody = document.getElementById('cartBody');
        const emptyMessage = document.getElementById('cartEmpty');
        const footer = document.getElementById('cartFooter');
        
        // Remove old items
        const oldItems = cartBody.querySelectorAll('.cart-item');
        for (let i = 0; i < oldItems.length; i++) {
            oldItems[i].remove();
        }
        
        // If cart is empty
        if (this.items.length === 0) {
            emptyMessage.style.display = 'block';
            footer.style.display = 'none';
            return;
        }
        
        // Cart has items
        emptyMessage.style.display = 'none';
        footer.style.display = 'block';
        
        // Add each item
        for (let i = 0; i < this.items.length; i++) {
            const itemHTML = this.createItemHTML(this.items[i]);
            cartBody.appendChild(itemHTML);
        }
    }
    
    // Create HTML for one item
    createItemHTML(item) {
        const div = document.createElement('div');
        div.className = 'cart-item';
        
        div.innerHTML = `
            <div class="cart-item-image">
                <span style="font-size: 2rem;">📦</span>
            </div>
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price text-gradient">$${item.price.toFixed(2)}</div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn" data-id="${item.id}" data-action="decrease">−</button>
                    <span class="quantity-value">${item.quantity}</span>
                    <button class="quantity-btn" data-id="${item.id}" data-action="increase">+</button>
                </div>
            </div>
            <div class="cart-item-actions">
                <button class="cart-item-remove" data-id="${item.id}">🗑️</button>
            </div>
        `;
        
        // Setup buttons for this item
        const decreaseBtn = div.querySelector('[data-action="decrease"]');
        const increaseBtn = div.querySelector('[data-action="increase"]');
        const removeBtn = div.querySelector('.cart-item-remove');
        
        // Use arrow functions to keep "this" context
        decreaseBtn.addEventListener('click', () => {
            this.changeQuantity(item.id, -1);
        });
        
        increaseBtn.addEventListener('click', () => {
            this.changeQuantity(item.id, 1);
        });
        
        removeBtn.addEventListener('click', () => {
            this.removeItem(item.id);
        });
        
        return div;
    }
    
    // Update totals display
    updateTotals() {
        const totals = this.calculateTotals();
        
        const subtotalEl = document.getElementById('cartSubtotal');
        const shippingEl = document.getElementById('cartShipping');
        const totalEl = document.getElementById('cartTotal');
        
        subtotalEl.textContent = '$' + totals.subtotal.toFixed(2);
        
        if (totals.shipping === 0 && totals.subtotal > 0) {
            shippingEl.textContent = 'FREE';
        } else {
            shippingEl.textContent = '$' + totals.shipping.toFixed(2);
        }
        
        totalEl.textContent = '$' + totals.total.toFixed(2);
    }
    
    // =========================================
    // UI METHODS
    // =========================================
    
    // Show notification
    showNotification(productName) {
        const notification = document.getElementById('cartNotification');
        const text = document.getElementById('notificationText');
        
        text.textContent = productName + ' added to cart';
        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
    
    // Animate cart icon
    animateCartIcon() {
        const icon = document.getElementById('cartIcon');
        icon.classList.add('bounce');
        
        setTimeout(() => {
            icon.classList.remove('bounce');
        }, 500);
    }
    
    // Open cart modal
    openModal() {
        const modal = document.getElementById('cartModal');
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    // Close cart modal
    closeModal() {
        const modal = document.getElementById('cartModal');
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Checkout
    checkout() {
        if (this.items.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        
        const totals = this.calculateTotals();
        alert('Checkout - Total: $' + totals.total.toFixed(2) + '\n\nThis is a demo!');
    }
    
    // =========================================
    // SETUP METHODS
    // =========================================
    
    // Setup all button event listeners
    setupButtons() {
        // Cart icon
        const cartIcon = document.getElementById('cartIcon');
        cartIcon.addEventListener('click', () => {
            this.openModal();
        });
        
        // Close button
        const closeBtn = document.getElementById('cartClose');
        closeBtn.addEventListener('click', () => {
            this.closeModal();
        });
        
        // Click outside to close
        const modal = document.getElementById('cartModal');
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                this.closeModal();
            }
        });
        
        // Clear cart button
        const clearBtn = document.getElementById('cartClear');
        clearBtn.addEventListener('click', () => {
            this.clearAll();
        });
        
        // Checkout button
        const checkoutBtn = document.getElementById('cartCheckout');
        checkoutBtn.addEventListener('click', () => {
            this.checkout();
        });
        
        // Add to cart buttons
        const addButtons = document.querySelectorAll('.add-to-cart-btn');
        
        for (let i = 0; i < addButtons.length; i++) {
            addButtons[i].addEventListener('click', (event) => {
                const product = event.target.closest('.product');
                const id = product.dataset.id;
                const name = product.dataset.name;
                const price = product.dataset.price;
                
                this.addItem(id, name, price);
                
                // Button feedback
                const btn = addButtons[i];
                btn.classList.add('added');
                btn.innerHTML = '<span>✓</span><span>Added!</span>';
                
                setTimeout(() => {
                    btn.classList.remove('added');
                    btn.innerHTML = '<span>🛒</span><span>Add to Cart</span>';
                }, 2000);
            });
        }
        
        // ESC key to close
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                this.closeModal();
            }
        });
    }
}

// =============================================
// CREATE CART WHEN PAGE LOADS
// =============================================
document.addEventListener('DOMContentLoaded', () => {
    // Create one cart instance for the whole site
    window.myCart = new ShoppingCart();
});
