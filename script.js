document.addEventListener("DOMContentLoaded", function() {
  // Mobile menu toggle
  const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
  const mainNav = document.querySelector(".main-nav");
  
  mobileMenuBtn.addEventListener("click", function() {
    mainNav.classList.toggle("active");
  });

  // Load approved products
  const container = document.getElementById("approvedProducts");
  const products = JSON.parse(localStorage.getItem("products")) || [];
  const approved = products.filter(p => p.status === "approved");

  if (approved.length === 0) {
    container.innerHTML = `<p class="no-products">No approved products yet. Check back later!</p>`;
  } else {
    approved.forEach(product => {
      const card = document.createElement("div");
      card.className = "product-card";
      card.innerHTML = `
        <div class="product-image">
          <img src="${product.image}" alt="${product.name}">
          <button class="wishlist-btn"><i class="far fa-heart"></i></button>
        </div>
        <div class="product-info">
          <h3>${product.name}</h3>
          <p class="product-desc">${product.description.substring(0, 50)}...</p>
          <div class="product-footer">
            <p class="product-price">₹${product.price}</p>
            <button class="chat-buy-btn" data-product="${product.name}">Chat to Buy</button>
          </div>
        </div>
      `;
      container.appendChild(card);
    });
  }

  // Chat functionality
  const chatWidget = document.querySelector(".chat-widget");
  const chatToggle = document.querySelector(".chat-toggle-btn");
  const chatClose = document.querySelector(".chat-close");
  const chatInput = document.querySelector(".chat-input input");
  const sendBtn = document.querySelector(".send-btn");
  const chatMessages = document.querySelector(".chat-messages");

  // Toggle chat widget
  chatToggle.addEventListener("click", function() {
    chatWidget.classList.toggle("active");
  });

  // Close chat widget
  chatClose.addEventListener("click", function() {
    chatWidget.classList.remove("active");
  });

  // Handle product chat buttons
  document.addEventListener("click", function(e) {
    if (e.target.classList.contains("chat-buy-btn")) {
      const productName = e.target.dataset.product;
      chatWidget.classList.add("active");
      chatInput.value = `Hi! I'm interested in buying your ${productName}. Is it still available?`;
      chatInput.focus();
    }
  });

  // Send message function
  function sendMessage() {
    const messageText = chatInput.value.trim();
    if (messageText !== "") {
      // Create user message
      const userMessage = document.createElement("div");
      userMessage.className = "message user-message";
      userMessage.innerHTML = `
        <div class="message-content">
          <p>${messageText}</p>
          <span class="message-time">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
        </div>
      `;
      chatMessages.appendChild(userMessage);
      chatInput.value = "";
      chatMessages.scrollTop = chatMessages.scrollHeight;

      // Simulate seller reply
      setTimeout(() => {
        const replyMessage = document.createElement("div");
        replyMessage.className = "message bot-message";
        replyMessage.innerHTML = `
          <div class="message-content">
            <p>Thanks for your interest! The item is still available. When would you like to meet on campus?</p>
            <span class="message-time">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
          </div>
        `;
        chatMessages.appendChild(replyMessage);
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }, 1000);
    }
  }

  // Send message on button click
  sendBtn.addEventListener("click", sendMessage);

  // Send message on Enter key
  chatInput.addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
      sendMessage();
    }
  });
});