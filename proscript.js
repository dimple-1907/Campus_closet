// proscript.js
document.addEventListener("DOMContentLoaded", function() {
  const productGrid = document.getElementById("productGrid");
  const emptyState = document.getElementById("emptyState");
  const pendingCount = document.getElementById("pendingCount");
  
  // Load products from localStorage
  function loadProducts(filter = 'all') {
    const products = JSON.parse(localStorage.getItem("products")) || [];
    productGrid.innerHTML = '';
    
    const filteredProducts = products.filter(product => {
      if (filter === 'pending') return product.status === 'pending';
      if (filter === 'approved') return product.status === 'approved';
      return true;
    });
    
    // Update pending count
    const pendingProducts = products.filter(p => p.status === 'pending').length;
    pendingCount.textContent = pendingProducts;
    
    if (filteredProducts.length === 0) {
      emptyState.style.display = 'flex';
      if (filter === 'pending') {
        emptyState.querySelector('h3').textContent = 'No pending approvals';
        emptyState.querySelector('p').textContent = 'All products have been reviewed';
      } else if (filter === 'approved') {
        emptyState.querySelector('h3').textContent = 'No approved products';
        emptyState.querySelector('p').textContent = 'Approved products will appear here';
      } else {
        emptyState.querySelector('h3').textContent = 'No products found';
        emptyState.querySelector('p').textContent = 'Products submitted will appear here';
      }
    } else {
      emptyState.style.display = 'none';
      
      filteredProducts.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.dataset.id = product.dateSubmitted;
        
        card.innerHTML = `
          <div class="product-image">
            <img src="${product.image}" alt="${product.name}">
            <span class="status-tag ${product.status}">
              ${product.status === 'pending' ? 'Pending' : 'Approved'}
            </span>
          </div>
          <div class="product-info">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <div class="product-meta">
              <span>₹${product.price}</span>
              <span>${product.dateSubmitted}</span>
            </div>
            ${product.status === 'pending' ? `
            <div class="action-btns">
              <button class="btn btn-approve" onclick="approveProduct('${product.name}', '${product.dateSubmitted}')">
                <i class="fas fa-check"></i> Approve
              </button>
              <button class="btn btn-reject">
                <i class="fas fa-times"></i> Reject
              </button>
            </div>
            ` : ''}
          </div>
        `;
        
        productGrid.appendChild(card);
      });
    }
  }
  
  // Filter buttons functionality
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      loadProducts(this.dataset.filter);
    });
  });
  
  // Initial load
  loadProducts();
});

function approveProduct(name, timestamp) {
  const products = JSON.parse(localStorage.getItem("products")) || [];
  const index = products.findIndex(p => p.name === name && p.dateSubmitted === timestamp);
  if (index !== -1) {
    products[index].status = "approved";
    localStorage.setItem("products", JSON.stringify(products));
    location.reload();
  }
}

function rejectProduct(name, timestamp) {
  const products = JSON.parse(localStorage.getItem("products")) || [];
  const index = products.findIndex(p => p.name === name && p.dateSubmitted === timestamp);
  if (index !== -1) {
    products[index].status = "rejected";
    localStorage.setItem("products", JSON.stringify(products));
    location.reload();
  }
}
