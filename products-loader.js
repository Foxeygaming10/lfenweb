// Load products from localStorage and display them
document.addEventListener('DOMContentLoaded', () => {
    const productsGrid = document.getElementById('products-grid');
    const searchInput = document.getElementById('product-search');
    const categoryFilter = document.getElementById('category-filter');

    // Get products from localStorage
    function getProductsFromStorage() {
        const stored = localStorage.getItem('adminProducts');
        return stored ? JSON.parse(stored) : [];
    }

    // Display products
    function displayProducts(products) {
        if (products.length === 0) {
            // Keep default products if no admin products exist
            return;
        }

        // Replace the grid with admin products
        productsGrid.innerHTML = products.map(product => {
            const firstImage = product.images && product.images.length > 0 
                ? `<img src="${product.images[0]}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover;" />`
                : '<div style="font-size: 3rem; color: var(--primary-color);">⚡</div>';
            
            return `
                <div class="product-card" data-category="${product.category}">
                    <div class="product-image">${firstImage}</div>
                    <div class="product-info">
                        <h3 class="product-name">${product.name}</h3>
                        <p class="product-specs">${product.specs}</p>
                        <a href="#" class="btn inquire-btn" data-product="${product.name}">Inquire Now</a>
                    </div>
                </div>
            `;
        }).join('');

        // Re-initialize product gallery after loading products
        if (typeof initializeProductGallery === 'function') {
            initializeProductGallery();
        }
    }

    // Filter products
    function filterProducts() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedCategory = categoryFilter.value.toLowerCase();
        const productCards = document.querySelectorAll('.product-card');

        productCards.forEach(card => {
            const productName = card.querySelector('.product-name').textContent.toLowerCase();
            const productSpecs = card.querySelector('.product-specs').textContent.toLowerCase();
            const productCategory = card.dataset.category?.toLowerCase() || '';

            const matchesSearch = productName.includes(searchTerm) || productSpecs.includes(searchTerm);
            const matchesCategory = !selectedCategory || selectedCategory === 'all' || productCategory === selectedCategory;

            if (matchesSearch && matchesCategory) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    // Load products
    const adminProducts = getProductsFromStorage();
    if (adminProducts.length > 0) {
        displayProducts(adminProducts);
    }

    // Add event listeners for filtering
    if (searchInput) {
        searchInput.addEventListener('input', filterProducts);
    }
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterProducts);
    }
});

