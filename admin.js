// Admin Panel - Product Management
// Only accessible on localhost/this PC

// Check if running on localhost (basic security)
// Only allow access from localhost or file:// protocol (local file)
const isLocalAccess = window.location.hostname === 'localhost' || 
                     window.location.hostname === '127.0.0.1' || 
                     window.location.hostname === '' ||
                     window.location.protocol === 'file:';

if (!isLocalAccess) {
    document.body.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: center; height: 100vh; flex-direction: column; padding: 2rem;">
            <h1 style="color: #ef4444; margin-bottom: 1rem;">Access Denied</h1>
            <p style="color: #64748b; text-align: center; max-width: 500px;">
                This admin panel is only accessible from localhost or when opened as a local file. 
                Please open this file directly from your computer or use localhost.
            </p>
            <a href="index.html" class="btn" style="margin-top: 2rem;">Go to Homepage</a>
        </div>
    `;
    throw new Error('Admin panel access denied');
}

// Initialize Admin Panel
document.addEventListener('DOMContentLoaded', () => {
    const addProductBtn = document.getElementById('add-product-btn');
    const productForm = document.getElementById('product-form');
    const productFormElement = document.getElementById('product-form-element');
    const cancelBtn = document.getElementById('cancel-btn');
    const productsListContainer = document.getElementById('products-list-container');
    const imageInput = document.getElementById('product-images');
    const imagePreviewContainer = document.getElementById('image-preview-container');
    const formTitle = document.getElementById('form-title');
    const productIdInput = document.getElementById('product-id');

    let selectedImages = [];
    let editingProductId = null;

    // Load and display products
    function loadProducts() {
        const products = getProductsFromStorage();
        displayProducts(products);
    }

    // Get products from localStorage
    function getProductsFromStorage() {
        const stored = localStorage.getItem('adminProducts');
        return stored ? JSON.parse(stored) : [];
    }

    // Save products to localStorage
    function saveProductsToStorage(products) {
        localStorage.setItem('adminProducts', JSON.stringify(products));
    }

    // Display products list
    function displayProducts(products) {
        if (products.length === 0) {
            productsListContainer.innerHTML = '<div class="empty-state">No products yet. Click "Add New Product" to get started.</div>';
            return;
        }

        productsListContainer.innerHTML = products.map((product, index) => {
            const firstImage = product.images && product.images.length > 0 
                ? `<img src="${product.images[0]}" alt="${product.name}" />`
                : '<div style="font-size: 2rem;">⚡</div>';
            
            return `
                <div class="product-item">
                    <div class="product-item-image">
                        ${firstImage}
                    </div>
                    <div class="product-item-info">
                        <h3>${product.name}</h3>
                        <p><strong>Category:</strong> ${product.category} | <strong>Images:</strong> ${product.images ? product.images.length : 0}</p>
                        <p>${product.specs}</p>
                    </div>
                    <div class="product-item-actions">
                        <button class="btn" onclick="editProduct(${index})">Edit</button>
                        <button class="btn btn-danger" onclick="deleteProduct(${index})">Delete</button>
                    </div>
                </div>
            `;
        }).join('');
    }

    // Add product
    addProductBtn.addEventListener('click', () => {
        editingProductId = null;
        productIdInput.value = '';
        productFormElement.reset();
        selectedImages = [];
        imagePreviewContainer.innerHTML = '';
        formTitle.textContent = 'Add New Product';
        productForm.classList.add('active');
        addProductBtn.style.display = 'none';
    });

    // Cancel form
    cancelBtn.addEventListener('click', () => {
        productForm.classList.remove('active');
        addProductBtn.style.display = 'inline-block';
        productFormElement.reset();
        selectedImages = [];
        imagePreviewContainer.innerHTML = '';
        editingProductId = null;
    });

    // Handle image selection
    imageInput.addEventListener('change', (e) => {
        const files = Array.from(e.target.files);
        selectedImages = [];
        imagePreviewContainer.innerHTML = '';

        files.forEach((file, index) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                const imageData = event.target.result;
                selectedImages.push(imageData);

                const preview = document.createElement('div');
                preview.className = 'image-preview';
                preview.innerHTML = `
                    <img src="${imageData}" alt="Preview ${index + 1}" />
                    <button type="button" class="remove-image" onclick="removeImage(${selectedImages.length - 1})">×</button>
                `;
                imagePreviewContainer.appendChild(preview);
            };
            reader.readAsDataURL(file);
        });
    });

    // Remove image from selection
    window.removeImage = function(index) {
        selectedImages.splice(index, 1);
        updateImagePreviews();
    };

    // Update image previews
    function updateImagePreviews() {
        imagePreviewContainer.innerHTML = '';
        selectedImages.forEach((imageData, index) => {
            const preview = document.createElement('div');
            preview.className = 'image-preview';
            preview.innerHTML = `
                <img src="${imageData}" alt="Preview ${index + 1}" />
                <button type="button" class="remove-image" onclick="removeImage(${index})">×</button>
            `;
            imagePreviewContainer.appendChild(preview);
        });
    }

    // Edit product
    window.editProduct = function(index) {
        const products = getProductsFromStorage();
        const product = products[index];
        
        editingProductId = index;
        productIdInput.value = index;
        document.getElementById('product-name').value = product.name;
        document.getElementById('product-category').value = product.category;
        document.getElementById('product-specs').value = product.specs;
        
        selectedImages = product.images || [];
        updateImagePreviews();
        
        formTitle.textContent = 'Edit Product';
        productForm.classList.add('active');
        addProductBtn.style.display = 'none';
        
        // Scroll to form
        productForm.scrollIntoView({ behavior: 'smooth' });
    };

    // Delete product
    window.deleteProduct = function(index) {
        if (confirm('Are you sure you want to delete this product?')) {
            const products = getProductsFromStorage();
            products.splice(index, 1);
            saveProductsToStorage(products);
            loadProducts();
        }
    };

    // Handle form submission
    productFormElement.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('product-name').value.trim();
        const category = document.getElementById('product-category').value;
        const specs = document.getElementById('product-specs').value.trim();

        if (!name || !category || !specs) {
            alert('Please fill in all required fields.');
            return;
        }

        if (selectedImages.length === 0) {
            alert('Please select at least one image for the product.');
            return;
        }

        const products = getProductsFromStorage();
        const productData = {
            name,
            category,
            specs,
            images: selectedImages
        };

        if (editingProductId !== null) {
            // Update existing product
            products[editingProductId] = productData;
        } else {
            // Add new product
            products.push(productData);
        }

        saveProductsToStorage(products);
        loadProducts();
        
        // Reset form
        productFormElement.reset();
        selectedImages = [];
        imagePreviewContainer.innerHTML = '';
        productForm.classList.remove('active');
        addProductBtn.style.display = 'inline-block';
        editingProductId = null;

        alert(editingProductId !== null ? 'Product updated successfully!' : 'Product added successfully!');
    });

    // Initial load
    loadProducts();
});

