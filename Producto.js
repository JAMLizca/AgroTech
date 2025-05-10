// Efectos del Hero Section
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar el carrito
    initShoppingCart();
    
    // Inicializar efectos dinámicos
    initHeroBackground();
    createFloatingElements();
    initParallaxEffect();
    initTextAnimation();
    initCustomCursor();
    
    // Inicializar scroll suave
    initSmoothScroll();
    
    // Inicializar animaciones al hacer scroll
    initScrollAnimation();
});

// Función para inicializar el carrito de compras
function initShoppingCart() {
    // Crear el contenedor del carrito
    const cartContainer = document.createElement('div');
    cartContainer.className = 'cart-container';
    cartContainer.innerHTML = `
        <div class="cart-header">
            <h3><i class="fas fa-shopping-cart"></i> Carrito de Compras</h3>
            <button class="close-cart"><i class="fas fa-times"></i></button>
        </div>
        <div class="cart-items"></div>
        <div class="cart-footer">
            <div class="cart-total">
                <span>Total:</span>
                <span class="total-amount">$0.00</span>
            </div>
            <button class="checkout-btn">
                <i class="fas fa-credit-card"></i> Proceder al Pago
            </button>
        </div>
    `;
    document.body.appendChild(cartContainer);

    // Crear el botón flotante del carrito
    const cartButton = document.createElement('button');
    cartButton.className = 'cart-button';
    cartButton.innerHTML = `
        <i class="fas fa-shopping-cart"></i>
        <span class="cart-count">0</span>
    `;
    document.body.appendChild(cartButton);

    // Estado del carrito
    let cartItems = [];
    let isCartOpen = false;

    // Función para añadir al carrito
    function addToCart(productId, name, price, image) {
        const existingItem = cartItems.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cartItems.push({
                id: productId,
                name,
                price,
                image,
                quantity: 1
            });
        }

        updateCart();
        showNotification(name, image);
    }

    // Función para actualizar el carrito
    function updateCart() {
        const cartItemsContainer = document.querySelector('.cart-items');
        const cartCount = document.querySelector('.cart-count');
        const totalAmount = document.querySelector('.total-amount');
        
        // Actualizar contador
        const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        
        // Actualizar lista de items
        cartItemsContainer.innerHTML = cartItems.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <img src="${item.image}" alt="${item.name}">
                <div class="item-details">
                    <h4>${item.name}</h4>
                    <p>$${item.price.toFixed(2)}</p>
                    <div class="quantity-controls">
                        <button class="quantity-btn minus"><i class="fas fa-minus"></i></button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn plus"><i class="fas fa-plus"></i></button>
                    </div>
                </div>
                <button class="remove-item"><i class="fas fa-trash"></i></button>
            </div>
        `).join('');

        // Actualizar total
        const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        totalAmount.textContent = `$${total.toFixed(2)}`;

        // Añadir eventos a los botones de cantidad y eliminar
        document.querySelectorAll('.quantity-btn.minus').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const itemId = e.target.closest('.cart-item').dataset.id;
                const item = cartItems.find(item => item.id === itemId);
                if (item.quantity > 1) {
                    item.quantity--;
                    updateCart();
                }
            });
        });

        document.querySelectorAll('.quantity-btn.plus').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const itemId = e.target.closest('.cart-item').dataset.id;
                const item = cartItems.find(item => item.id === itemId);
                item.quantity++;
                updateCart();
            });
        });

        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const itemId = e.target.closest('.cart-item').dataset.id;
                cartItems = cartItems.filter(item => item.id !== itemId);
                updateCart();
            });
        });
    }

    // Función para mostrar notificación
    function showNotification(name, image) {
        const notification = document.createElement('div');
        notification.className = 'notification-overlay';
        notification.innerHTML = `
            <div class="notification-box">
                <div class="notification-icon">
                    <i class="fas fa-shopping-cart"></i>
                </div>
                <h3 class="notification-title">¡Producto Añadido!</h3>
                <p class="notification-message">${name} ha sido añadido al carrito</p>
                <button class="notification-close">Aceptar</button>
            </div>
        `;
        document.body.appendChild(notification);

        // Mostrar notificación
        setTimeout(() => notification.classList.add('show'), 100);

        // Cerrar notificación al hacer clic en el botón
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        });
    }

    // Event Listeners
    cartButton.addEventListener('click', () => {
        isCartOpen = !isCartOpen;
        cartContainer.classList.toggle('open', isCartOpen);
    });

    document.querySelector('.close-cart').addEventListener('click', () => {
        isCartOpen = false;
        cartContainer.classList.remove('open');
    });

    document.querySelector('.checkout-btn').addEventListener('click', () => {
        if (cartItems.length > 0) {
            const successOverlay = document.createElement('div');
            successOverlay.className = 'notification-overlay';
            successOverlay.innerHTML = `
                <div class="notification-box">
                    <div class="notification-icon">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <h3 class="notification-title">¡Compra Exitosa!</h3>
                    <p class="notification-message">Gracias por tu compra. Tu pedido ha sido procesado correctamente.</p>
                    <button class="notification-close">Aceptar</button>
                </div>
            `;
            document.body.appendChild(successOverlay);

            // Limpiar carrito
            cartItems = [];
            updateCart();
            isCartOpen = false;
            cartContainer.classList.remove('open');

            // Mostrar notificación
            setTimeout(() => successOverlay.classList.add('show'), 100);

            // Cerrar notificación al hacer clic en el botón
            successOverlay.querySelector('.notification-close').addEventListener('click', () => {
                successOverlay.classList.remove('show');
                setTimeout(() => successOverlay.remove(), 300);
            });
        }
    });

    // Añadir eventos a los botones de "Añadir al Carrito"
    document.querySelectorAll('.featured-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.featured-card');
            const id = card.dataset.id;
            const name = card.querySelector('h3').textContent;
            const price = parseFloat(card.querySelector('.featured-price').textContent.replace('$', ''));
            const image = card.querySelector('img').src;
            
            addToCart(id, name, price, image);
        });
    });
}

// Función para inicializar el fondo del hero
function initHeroBackground() {
    const heroSection = document.querySelector('.hero-section');
    const heroBackground = document.createElement('div');
    heroBackground.className = 'hero-background';
    heroSection.insertBefore(heroBackground, heroSection.firstChild);

    // Precargar la imagen
    const img = new Image();
    img.src = 'Img/tecnologia-en-la-agricultura-jacto.jpg';
    
    img.onload = () => {
        heroBackground.style.opacity = '0';
        heroBackground.style.transition = 'opacity 1s ease';
        setTimeout(() => {
            heroBackground.style.opacity = '1';
        }, 100);
    };

    // Efecto parallax mejorado
    let ticking = false;
    document.addEventListener('mousemove', (e) => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const { clientX, clientY } = e;
                const { left, top, width, height } = heroSection.getBoundingClientRect();
                const x = (clientX - left) / width;
                const y = (clientY - top) / height;
                
                heroBackground.style.transform = `
                    scale(1.1) 
                    translate(${x * 15}px, ${y * 15}px)
                `;
                ticking = false;
            });
            ticking = true;
        }
    });

    // Efecto de zoom suave al hacer scroll
    let scrollTicking = false;
    window.addEventListener('scroll', () => {
        if (!scrollTicking) {
            window.requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;
                const scale = 1 + (scrolled * 0.0003);
                heroBackground.style.transform = `scale(${scale})`;
                scrollTicking = false;
            });
            scrollTicking = true;
        }
    });

    // Efecto de brillo al cargar
    heroBackground.style.filter = 'brightness(0.8) contrast(0.9) saturate(0.9)';
    setTimeout(() => {
        heroBackground.style.transition = 'filter 2s ease';
        heroBackground.style.filter = 'brightness(1.1) contrast(1.1) saturate(1.2)';
    }, 100);
}

// Función para crear elementos flotantes
function createFloatingElements() {
    const heroSection = document.querySelector('.hero-section');
    for (let i = 0; i < 15; i++) {
        const element = document.createElement('div');
        element.className = 'floating-element';
        element.style.width = `${Math.random() * 20 + 10}px`;
        element.style.height = element.style.width;
        element.style.left = `${Math.random() * 100}%`;
        element.style.top = `${Math.random() * 100}%`;
        element.style.opacity = Math.random() * 0.3;
        element.style.animationDuration = `${Math.random() * 3 + 2}s`;
        element.style.animationDelay = `${Math.random() * 2}s`;
        heroSection.appendChild(element);
    }
}

// Función para efecto parallax
function initParallaxEffect() {
    const heroSection = document.querySelector('.hero-section');
    document.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const { left, top, width, height } = heroSection.getBoundingClientRect();
        const x = (clientX - left) / width;
        const y = (clientY - top) / height;
        
        heroSection.style.transform = `
            perspective(1000px)
            rotateX(${(y - 0.5) * 5}deg)
            rotateY(${(x - 0.5) * 5}deg)
        `;
    });
}

// Función para animación de texto
function initTextAnimation() {
    const title = document.querySelector('.hero-title');
    const text = title.textContent;
    title.textContent = '';
    
    text.split('').forEach((char, i) => {
        const span = document.createElement('span');
        span.textContent = char;
        span.style.animationDelay = `${i * 0.1}s`;
        title.appendChild(span);
    });
}

// Función para cursor personalizado
function initCustomCursor() {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    document.querySelectorAll('a, button').forEach(element => {
        element.addEventListener('mouseenter', () => cursor.classList.add('expand'));
        element.addEventListener('mouseleave', () => cursor.classList.remove('expand'));
    });
}

// Función para scroll suave
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Función para animaciones al hacer scroll
function initScrollAnimation() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, {
        threshold: 0.1
    });

    document.querySelectorAll('.category-card, .featured-card, .feature-card').forEach(element => {
        observer.observe(element);
    });
}

// Añadir estilos para el cursor personalizado
const style = document.createElement('style');
style.textContent = `
    .custom-cursor {
        position: fixed;
        width: 40px;
        height: 40px;
        border: 2px solid rgba(255, 255, 255, 0.5);
        border-radius: 50%;
        pointer-events: none;
        transform: translate(-50%, -50%);
        transition: width 0.3s, height 0.3s, border-color 0.3s;
        z-index: 9999;
    }
    
    .cursor-dot {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 8px;
        height: 8px;
        background: white;
        border-radius: 50%;
        transform: translate(-50%, -50%);
        transition: transform 0.3s;
    }
    
    .cursor-hover {
        width: 60px;
        height: 60px;
        border-color: var(--primary);
    }
    
    .cursor-hover .cursor-dot {
        transform: translate(-50%, -50%) scale(0.5);
    }
    
    @keyframes float {
        0%, 100% {
            transform: translateY(0) rotate(0deg);
        }
        50% {
            transform: translateY(-20px) rotate(180deg);
        }
    }
`;

document.head.appendChild(style);

// Añadir estilos adicionales para el carrito
const cartStyles = document.createElement('style');
cartStyles.textContent = `
    .cart-container {
        position: fixed;
        top: 0;
        right: -400px;
        width: 400px;
        height: 100vh;
        background: white;
        box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        transition: right 0.3s ease;
        display: flex;
        flex-direction: column;
    }

    .cart-container.open {
        right: 0;
    }

    .cart-header {
        padding: 20px;
        border-bottom: 1px solid #eee;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .cart-close {
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: #666;
    }

    .cart-items {
        flex: 1;
        overflow-y: auto;
        padding: 20px;
    }

    .cart-item {
        display: flex;
        align-items: center;
        padding: 10px;
        border-bottom: 1px solid #eee;
        animation: slideIn 0.3s ease;
    }

    .cart-item img {
        width: 60px;
        height: 60px;
        object-fit: cover;
        border-radius: 8px;
        margin-right: 15px;
    }

    .cart-item-details {
        flex: 1;
    }

    .cart-item h4 {
        margin: 0 0 5px 0;
        font-size: 1rem;
    }

    .cart-item-price {
        color: var(--primary);
        font-weight: 600;
    }

    .cart-item-quantity {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-top: 5px;
    }

    .quantity-btn {
        background: #f5f5f5;
        border: none;
        width: 25px;
        height: 25px;
        border-radius: 50%;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .quantity-btn:hover {
        background: var(--primary);
        color: white;
    }

    .remove-item {
        background: none;
        border: none;
        color: #ff4444;
        font-size: 20px;
        cursor: pointer;
        padding: 5px;
    }

    .cart-footer {
        padding: 20px;
        border-top: 1px solid #eee;
        background: #f9f9f9;
    }

    .cart-total {
        font-size: 1.2rem;
        font-weight: 600;
        margin-bottom: 15px;
    }

    .cart-checkout {
        width: 100%;
        padding: 12px;
        background: var(--gradient-1);
        color: white;
        border: none;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .cart-checkout:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow-1);
    }

    .cart-button {
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 60px;
        height: 60px;
        background: var(--gradient-1);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 24px;
        cursor: pointer;
        box-shadow: var(--shadow-2);
        z-index: 999;
        transition: all 0.3s ease;
    }

    .cart-button:hover {
        transform: scale(1.1);
    }

    .cart-count {
        position: absolute;
        top: -5px;
        right: -5px;
        background: #ff4444;
        color: white;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        font-weight: 600;
    }

    .cart-notification {
        position: fixed;
        top: 20px;
        right: -300px;
        background: white;
        padding: 15px;
        border-radius: 8px;
        box-shadow: var(--shadow-2);
        display: flex;
        align-items: center;
        gap: 15px;
        z-index: 1001;
        transition: right 0.3s ease;
    }

    .cart-notification.show {
        right: 20px;
    }

    .cart-notification img {
        width: 50px;
        height: 50px;
        object-fit: cover;
        border-radius: 4px;
    }

    .notification-content h4 {
        margin: 0 0 5px 0;
        font-size: 1rem;
    }

    .notification-content p {
        margin: 0;
        color: #666;
        font-size: 0.9rem;
    }

    .checkout-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1002;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
    }

    .checkout-overlay.show {
        opacity: 1;
        visibility: visible;
    }

    .checkout-content {
        background: white;
        padding: 40px;
        border-radius: 20px;
        text-align: center;
        transform: scale(0.8);
        transition: transform 0.3s ease;
    }

    .checkout-overlay.show .checkout-content {
        transform: scale(1);
    }

    .checkout-icon {
        width: 80px;
        height: 80px;
        background: var(--gradient-1);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 40px;
        margin: 0 auto 20px;
    }

    .checkout-close {
        margin-top: 20px;
        padding: 12px 30px;
        background: var(--gradient-1);
        color: white;
        border: none;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .checkout-close:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow-1);
    }

    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateX(20px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
`;

document.head.appendChild(cartStyles); 