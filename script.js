 // Supabase Configuration
        const SUPABASE_URL = 'https://ehmghijjhelxbovpblii.supabase.co';
        const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVobWdoaWpqaGVseGJvdnBibGlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2NTM0NjksImV4cCI6MjA5MzIyOTQ2OX0.NvMSVf75keCM4KqE-Zhgu_-D3AJgEGD_CSMyGB07hNA';
        
        // Initialize Supabase client
        const { createClient } = supabase;
        const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        
        // Data
        const categories = [
            { id: 1, name: 'Local Restaurants', icon: '🍲' },
            { id: 2, name: 'Fast Food', icon: '🍗' },
            { id: 3, name: 'Bakery & Snacks', icon: '🥧' },
            { id: 4, name: 'Nigerian Dishes', icon: '🍚' },
            { id: 5, name: 'Groceries', icon: '🛒' },
            { id: 6, name: 'Electronics', icon: '📱' },
            { id: 7, name: 'Fashion', icon: '👗' },
            { id: 8, name: 'Pharmacy', icon: '💊' }
        ];

        const products = [
            // Local Restaurants - Offa & Kwara
            { id: 1, name: 'Jollof Rice & Chicken', category: 1, price: 2500, icon: '🍚', desc: 'Classic Nigerian Jollof with fried chicken', rating: 4.8, deliveryTime: '25-35 min', restaurant: 'Delight Restaurant Offa' },
            { id: 2, name: 'Amala & Abula', category: 1, price: 1800, icon: '🍲', desc: 'Yam flour with Gbegiri & Ewedu soup', rating: 4.9, deliveryTime: '30-40 min', restaurant: 'Delight Restaurant Offa' },
            { id: 3, name: 'Pounded Yam & Egusi', category: 1, price: 2200, icon: '🥘', desc: 'Fresh pounded yam with egusi soup', rating: 4.7, deliveryTime: '35-45 min', restaurant: 'Iya Alata Offa' },
            { id: 4, name: 'Fried Rice Combo', category: 1, price: 2800, icon: '🍱', desc: 'Fried rice with chicken & plantain', rating: 4.6, deliveryTime: '30-40 min', restaurant: 'Delight Restaurant Offa' },
            
            // Fast Food & Snacks
            { id: 5, name: 'Suya (Stick)', category: 2, price: 1500, icon: '🍖', desc: 'Spicy grilled beef suya', rating: 4.8, deliveryTime: '20-30 min', restaurant: 'Mallam Suya Spot' },
            { id: 6, name: 'Akara & Bread', category: 2, price: 800, icon: '🍞', desc: 'Bean cakes with bread', rating: 4.5, deliveryTime: '15-20 min', restaurant: 'Mama Akara' },
            { id: 7, name: 'Fried Chicken', category: 2, price: 1500, icon: '🍗', desc: '3 pieces spicy fried chicken', rating: 4.6, deliveryTime: '20-30 min', restaurant: 'Tasty Fried Chicken' },
            { id: 8, name: 'Small Chops', category: 2, price: 3000, icon: '🥘', desc: 'Puff puff, spring rolls, samosa', rating: 4.7, deliveryTime: '25-35 min', restaurant: 'Small Chops Palace' },
            
            // Bakery & Snacks
            { id: 9, name: 'Meat Pie', category: 3, price: 500, icon: '🥧', desc: 'Nigerian style meat pie', rating: 4.4, deliveryTime: '15-20 min', restaurant: 'Delight Bakery' },
            { id: 10, name: 'Chin Chin (Pack)', category: 3, price: 800, icon: '🍪', desc: 'Crunchy fried pastry snack', rating: 4.6, deliveryTime: '10-15 min', restaurant: 'Delight by Ire' },
            { id: 11, name: 'Puff Puff (12pcs)', category: 3, price: 500, icon: '🍩', desc: 'Sweet fried dough balls', rating: 4.5, deliveryTime: '15-20 min', restaurant: 'Offa Bakery' },
            { id: 12, name: 'Sausage Roll', category: 3, price: 600, icon: '🌭', desc: 'Fresh baked sausage roll', rating: 4.4, deliveryTime: '15-20 min', restaurant: 'Delight Bakery' },
            
            // Nigerian Dishes & Swallow
            { id: 13, name: 'Eba & Okro Soup', category: 4, price: 1500, icon: '🍲', desc: 'Garri with fresh okra soup', rating: 4.8, deliveryTime: '25-35 min', restaurant: 'Mama Put Offa' },
            { id: 14, name: 'Fufu & Egusi', category: 4, price: 2000, icon: '🥣', desc: 'Cassava fufu with egusi soup', rating: 4.9, deliveryTime: '30-40 min', restaurant: 'Iya Yusuf Kitchen' },
            { id: 15, name: 'White Rice & Stew', category: 4, price: 1200, icon: '🍚', desc: 'Steamed rice with tomato stew', rating: 4.7, deliveryTime: '20-30 min', restaurant: 'Mama Put Offa' },
            { id: 16, name: 'Beans & Plantain', category: 4, price: 1000, icon: '🍛', desc: 'Fried beans with ripe plantain', rating: 4.6, deliveryTime: '25-30 min', restaurant: 'Ewa Agoyin Spot' },
            
            // Groceries - Offa Market & Stores
            { id: 17, name: 'Rice (50kg bag)', category: 5, price: 85000, icon: '🌾', desc: 'Royal Stallion rice', rating: 4.5, deliveryTime: '1-2 hours', restaurant: 'Virem Stores Offa' },
            { id: 18, name: 'Garri (5kg)', category: 5, price: 3500, icon: '🥣', desc: 'Premium white garri', rating: 4.6, deliveryTime: '45-60 min', restaurant: 'Offa Market' },
            { id: 19, name: 'Palm Oil (4L)', category: 5, price: 8000, icon: '🛢️', desc: 'Fresh red palm oil', rating: 4.7, deliveryTime: '45-60 min', restaurant: 'Offa Market' },
            { id: 20, name: 'Tomatoes (Basket)', category: 5, price: 6000, icon: '🍅', desc: 'Fresh tomatoes', rating: 4.4, deliveryTime: '45-60 min', restaurant: 'Offa Market' },
            { id: 21, name: 'Yam Tuber', category: 5, price: 4000, icon: '🍠', desc: 'Medium size yam', rating: 4.5, deliveryTime: '45-60 min', restaurant: 'Offa Market' },
            { id: 22, name: 'Frozen Chicken', category: 5, price: 9600, icon: '🍗', desc: '2kg whole chicken', rating: 4.6, deliveryTime: '1-2 hours', restaurant: 'Virem Stores Offa' },
            
            // Electronics - Available in Kwara
            { id: 23, name: 'Tecno Smartphone', category: 6, price: 95000, icon: '📱', desc: 'Tecno Spark 10 Pro', rating: 4.7, deliveryTime: '2-3 hours', restaurant: 'Slot Ilorin' },
            { id: 24, name: 'Infinix Phone', category: 6, price: 78000, icon: '📱', desc: 'Infinix Hot 40i', rating: 4.6, deliveryTime: '2-3 hours', restaurant: 'Slot Ilorin' },
            { id: 25, name: 'Oraimo Earbuds', category: 6, price: 12000, icon: '🎧', desc: 'FreePods 4 wireless', rating: 4.8, deliveryTime: '2-3 hours', restaurant: 'Phone Accessories' },
            { id: 26, name: 'Power Bank 20000mAh', category: 6, price: 15000, icon: '🔋', desc: 'Oraimo power bank', rating: 4.7, deliveryTime: '2-3 hours', restaurant: 'Phone Accessories' },
            { id: 27, name: 'Phone Charger', category: 6, price: 3500, icon: '🔌', desc: 'Fast charging adapter', rating: 4.5, deliveryTime: '2-3 hours', restaurant: 'Phone Accessories' },
            
            // Fashion - Kwara/Offa Stores
            { id: 28, name: 'Ankara Fabric (6yds)', category: 7, price: 6000, icon: '👗', desc: 'Premium ankara print', rating: 4.5, deliveryTime: '1-2 days', restaurant: 'F&S Textile Offa' },
            { id: 29, name: 'Senator Material', category: 7, price: 8000, icon: '👔', desc: '5 yards senator fabric', rating: 4.6, deliveryTime: '1-2 days', restaurant: 'Raph Fashion' },
            { id: 30, name: 'Sneakers', category: 7, price: 15000, icon: '👟', desc: 'Quality sports shoes', rating: 4.4, deliveryTime: '1-2 days', restaurant: 'Shoe Plaza Ilorin' },
            { id: 31, name: 'Agbada Set', category: 7, price: 35000, icon: '🤵', desc: 'Complete native attire', rating: 4.7, deliveryTime: '2-3 days', restaurant: 'Native Wear Boutique' },
            { id: 32, name: 'Baby Clothes Set', category: 7, price: 8500, icon: '👶', desc: '5 pieces baby wear', rating: 4.6, deliveryTime: '1-2 days', restaurant: 'Divine Grace Kiddies' },
            
            // Pharmacy & Healthcare
            { id: 33, name: 'Paracetamol', category: 8, price: 500, icon: '💊', desc: 'Pain & fever relief', rating: 4.8, deliveryTime: '30-45 min', restaurant: 'HealthPlus Pharmacy' },
            { id: 34, name: 'Multivitamins', category: 8, price: 4500, icon: '💊', desc: 'Daily vitamin supplement', rating: 4.6, deliveryTime: '30-45 min', restaurant: 'MedPlus Pharmacy' },
            { id: 35, name: 'Hand Sanitizer', category: 8, price: 1500, icon: '🧴', desc: '500ml antibacterial gel', rating: 4.7, deliveryTime: '30-45 min', restaurant: 'City Pharmacy' },
            { id: 36, name: 'Face Mask (50pcs)', category: 8, price: 3000, icon: '😷', desc: 'Disposable face masks', rating: 4.5, deliveryTime: '30-45 min', restaurant: 'MedCare Pharmacy' }
        ];

        let cart = [];
        let selectedCategory = null;
        let currentUser = null;
        let userOrders = [];

        // Initialize app on load
        async function initApp() {
            // Check if user is already logged in
            const { data: { user } } = await supabaseClient.auth.getUser();
            if (user) {
                currentUser = user;
                await loadUserData();
            }
            
            // Listen for auth state changes
            supabaseClient.auth.onAuthStateChange((event, session) => {
                if (event === 'SIGNED_IN') {
                    currentUser = session.user;
                    loadUserData();
                } else if (event === 'SIGNED_OUT') {
                    currentUser = null;
                    cart = [];
                    userOrders = [];
                }
            });
        }

        // Load user data from database
        async function loadUserData() {
            if (!currentUser) return;
            
            // Load user profile
            const { data: profile } = await supabaseClient
                .from('profiles')
                .select('*')
                .eq('id', currentUser.id)
                .single();
            
            if (profile) {
                currentUser.profile = profile;
            }
            
            // Load user orders
            await loadUserOrders();
        }

        // Load user orders
        async function loadUserOrders() {
            if (!currentUser) return;
            
            const { data, error } = await supabaseClient
                .from('orders')
                .select('*')
                .eq('user_id', currentUser.id)
                .order('created_at', { ascending: false });
            
            if (data) {
                userOrders = data;
            }
        }

        // Page Navigation
        function showPage(pageId) {
            document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
            document.getElementById(pageId).classList.add('active');
            
            if (pageId === 'browsePage') {
                initBrowsePage();
            } else if (pageId === 'dashboardPage') {
                initDashboard();
            }
        }

        function scrollToFeatures() {
            document.getElementById('features').scrollIntoView({ behavior: 'smooth' });
        }

        // Auth Functions
        function switchAuthTab(tab) {
            document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
            
            if (tab === 'login') {
                document.querySelectorAll('.auth-tab')[0].classList.add('active');
                document.getElementById('loginForm').classList.add('active');
            } else {
                document.querySelectorAll('.auth-tab')[1].classList.add('active');
                document.getElementById('signupForm').classList.add('active');
            }
        }

        async function handleLogin(e) {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            try {
                const { data, error } = await supabase.auth.signInWithPassword({
                    email: email,
                    password: password,
                });
                
                if (error) throw error;
                
                currentUser = data.user;
                await loadUserData();
                showNotification('Login successful! Welcome back.');
                setTimeout(() => {
                    showPage('dashboardPage');
                }, 1000);
            } catch (error) {
                showNotification('Login failed: ' + error.message);
            }
        }

        async function handleSignup(e) {
            e.preventDefault();
            const name = document.getElementById('signupName').value;
            const email = document.getElementById('signupEmail').value;
            const phone = document.getElementById('signupPhone').value;
            const address = document.getElementById('signupAddress').value;
            const password = document.getElementById('signupPassword').value;
            const confirmPassword = document.getElementById('signupConfirmPassword').value;
            
            if (password !== confirmPassword) {
                showNotification('Passwords do not match!');
                return;
            }
            
            try {
                // Sign up the user
                const { data, error } = await supabaseClient.auth.signUp({
                    email: email,
                    password: password,
                    options: {
                        data: {
                            full_name: name,
                            phone: phone,
                            address: address
                        }
                    }
                });
                
                if (error) throw error;
                
                // Create profile in profiles table
                if (data.user) {
                    const { error: profileError } = await supabaseClient
                        .from('profiles')
                        .insert([
                            {
                                id: data.user.id,
                                full_name: name,
                                email: email,
                                phone: phone,
                                address: address
                            }
                        ]);
                    
                    if (profileError) console.error('Profile creation error:', profileError);
                }
                
                currentUser = data.user;
                showNotification('Account created successfully! Please check your email for verification.');
                setTimeout(() => {
                    showPage('dashboardPage');
                }, 2000);
            } catch (error) {
                showNotification('Signup failed: ' + error.message);
            }
        }

        async function handleLogout() {
            try {
                const { error } = await supabaseClient.auth.signOut();
                if (error) throw error;
                
                currentUser = null;
                cart = [];
                userOrders = [];
                updateCartUI();
                showNotification('Logged out successfully.');
                setTimeout(() => {
                    showPage('landingPage');
                }, 1000);
            } catch (error) {
                showNotification('Logout failed: ' + error.message);
            }
        }

        // Dashboard Functions
        async function initDashboard() {
            if (!currentUser) {
                showPage('authPage');
                return;
            }
            
            const firstName = (currentUser.user_metadata?.full_name || currentUser.email).split(' ')[0];
            document.getElementById('userName').textContent = firstName;
            document.getElementById('dashboardUserName').textContent = firstName;
            document.getElementById('userAvatar').textContent = firstName.charAt(0).toUpperCase();
            
            // Load orders from database
            await loadUserOrders();
            
            // Update stats
            document.getElementById('totalOrders').textContent = userOrders.length;
            document.getElementById('pendingOrders').textContent = userOrders.filter(o => o.status === 'pending').length;
            document.getElementById('completedOrders').textContent = userOrders.filter(o => o.status === 'completed').length;
            
            const totalSpent = userOrders.reduce((sum, order) => sum + parseFloat(order.total || 0), 0);
            document.getElementById('totalSpent').textContent = `₦${totalSpent.toLocaleString()}`;
            
            // Display recent orders
            displayRecentOrders();
        }

        function displayRecentOrders() {
            const ordersList = document.getElementById('recentOrdersList');
            
            if (userOrders.length === 0) {
                ordersList.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-icon">📦</div>
                        <p>No orders yet. Start browsing products!</p>
                        <button class="btn-browse" onclick="showPage('browsePage')" style="margin-top: 1rem;">Browse Products</button>
                    </div>
                `;
                return;
            }
            
            ordersList.innerHTML = userOrders.slice(0, 5).map(order => `
                <div class="order-item">
                    <div class="order-info">
                        <h4>Order #${order.order_number}</h4>
                        <p>${order.items_count} items • ₦${parseFloat(order.total).toLocaleString()} • ${new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                    <div class="order-status status-${order.status}">${order.status}</div>
                </div>
            `).join('');
        }

        // Browse Page Functions
        function initBrowsePage() {
            renderCategories();
            renderProducts(products);
            updateCartUI();
        }

        function renderCategories() {
            const grid = document.getElementById('categoryGrid');
            grid.innerHTML = categories.map(cat => `
                <div class="category-card" onclick="filterByCategory(${cat.id})">
                    <div class="category-icon">${cat.icon}</div>
                    <div>${cat.name}</div>
                </div>
            `).join('');
        }

        function renderProducts(productsToRender) {
            const grid = document.getElementById('productGrid');
            grid.innerHTML = productsToRender.map(product => `
                <div class="product-card">
                    <div class="product-image">${product.icon}</div>
                    <div class="product-info">
                        ${product.deliveryTime.includes('min') ? '<span class="product-badge">⚡ Fast Delivery</span>' : ''}
                        <div class="product-name">${product.name}</div>
                        <div class="product-desc">${product.desc}</div>
                        ${product.restaurant ? `<div style="font-size: 0.85rem; color: #999; margin-bottom: 0.5rem;">📍 ${product.restaurant}</div>` : ''}
                        <div class="product-meta">
                            <div class="product-rating">
                                <span>⭐</span>
                                <span>${product.rating}</span>
                            </div>
                            <div class="product-delivery">
                                <span>🕐</span>
                                <span>${product.deliveryTime}</span>
                            </div>
                        </div>
                        <div class="product-footer">
                            <div class="product-price">₦${product.price.toLocaleString()}</div>
                            <button class="add-to-cart" onclick="addToCart(${product.id})">Add to Cart</button>
                        </div>
                    </div>
                </div>
            `).join('');
        }

        function filterByCategory(categoryId, event) {
            const cards = document.querySelectorAll('.category-card');
            cards.forEach(card => card.classList.remove('active'));
            event.target.closest('.category-card').classList.add('active');
            
            selectedCategory = categoryId;
            const filtered = products.filter(p => p.category === categoryId);
            renderProducts(filtered);
        }

        function searchProducts() {
            const query = document.getElementById('searchInput').value.toLowerCase();
            const filtered = products.filter(p => 
                p.name.toLowerCase().includes(query) || 
                p.desc.toLowerCase().includes(query)
            );
            renderProducts(filtered);
        }

        function addToCart(productId) {
            const product = products.find(p => p.id === productId);
            const existingItem = cart.find(item => item.id === productId);
            
            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push({ ...product, quantity: 1 });
            }
            
            updateCartUI();
            showNotification(`${product.name} added to cart!`);
        }

        function updateCartUI() {
            const count = cart.reduce((sum, item) => sum + item.quantity, 0);
            document.getElementById('cartCount').textContent = count;
            
            const cartItemsContainer = document.getElementById('cartItems');
            
            if (cart.length === 0) {
                cartItemsContainer.innerHTML = `
                    <div class="empty-cart">
                        <div class="empty-cart-icon">🛒</div>
                        <p>Your cart is empty</p>
                    </div>
                `;
            } else {
                cartItemsContainer.innerHTML = cart.map(item => `
                    <div class="cart-item">
                        <div class="cart-item-image">${item.icon}</div>
                        <div class="cart-item-info">
                            <div class="cart-item-name">${item.name}</div>
                            <div class="cart-item-price">₦${item.price.toLocaleString()}</div>
                            <div class="cart-item-controls">
                                <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                                <span>${item.quantity}</span>
                                <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                            </div>
                        </div>
                        <button class="remove-btn" onclick="removeFromCart(${item.id})">×</button>
                    </div>
                `).join('');
            }
            
            const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            document.getElementById('cartTotal').textContent = `₦${total.toLocaleString()}`;
        }

        function updateQuantity(productId, change) {
            const item = cart.find(item => item.id === productId);
            if (item) {
                item.quantity += change;
                if (item.quantity <= 0) {
                    removeFromCart(productId);
                } else {
                    updateCartUI();
                }
            }
        }

        function removeFromCart(productId) {
            cart = cart.filter(item => item.id !== productId);
            updateCartUI();
            showNotification('Item removed from cart');
        }

        function toggleCart() {
            document.getElementById('cartSidebar').classList.toggle('open');
        }

        function openCheckout() {
            if (cart.length === 0) {
                showNotification('Your cart is empty!');
                return;
            }
            
            const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const deliveryFee = 0;
            const total = subtotal + deliveryFee;
            
            document.getElementById('summarySubtotal').textContent = `₦${subtotal.toLocaleString()}`;
            document.getElementById('summaryDelivery').textContent = `₦${deliveryFee.toLocaleString()}`;
            document.getElementById('summaryTotal').textContent = `₦${total.toLocaleString()}`;
            
            document.getElementById('checkoutModal').classList.add('active');
            document.getElementById('cartSidebar').classList.remove('open');
        }

        function closeCheckout() {
            document.getElementById('checkoutModal').classList.remove('active');
        }

        document.getElementById('deliveryTime')?.addEventListener('change', function() {
            const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            let deliveryFee = 0;
            
            if (this.value === 'express') deliveryFee = 500;
            if (this.value === 'same-day') deliveryFee = 1000;
            
            const total = subtotal + deliveryFee;
            
            document.getElementById('summaryDelivery').textContent = `₦${deliveryFee.toLocaleString()}`;
            document.getElementById('summaryTotal').textContent = `₦${total.toLocaleString()}`;
        });

        function submitOrder(event) {
            event.preventDefault();
            
            const orderNumber = Math.floor(100000 + Math.random() * 900000);
            const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const deliverySelect = document.getElementById('deliveryTime');
            let deliveryFee = 0;
            if (deliverySelect.value === 'express') deliveryFee = 500;
            if (deliverySelect.value === 'same-day') deliveryFee = 1000;
            const total = subtotal + deliveryFee;
            
            // Collect form data
            const orderData = {
                user_id: currentUser.id,
                order_number: orderNumber,
                items: JSON.stringify(cart),
                items_count: cart.length,
                subtotal: subtotal,
                delivery_fee: deliveryFee,
                total: total,
                status: 'pending',
                delivery_address: document.getElementById('address').value,
                delivery_city: document.getElementById('city').value,
                delivery_state: document.getElementById('state').value,
                customer_name: `${document.getElementById('firstName').value} ${document.getElementById('lastName').value}`,
                customer_email: document.getElementById('email').value,
                customer_phone: document.getElementById('phone').value,
                delivery_option: deliverySelect.value,
                payment_method: document.getElementById('paymentMethod').value,
                special_instructions: document.getElementById('specialInstructions').value
            };
            
            // Save to Supabase
            saveOrderToDatabase(orderData, orderNumber);
        }

        async function saveOrderToDatabase(orderData, orderNumber) {
            try {
                const { data, error } = await supabase
                    .from('orders')
                    .insert([orderData])
                    .select();
                
                if (error) throw error;
                
                // Update local orders
                userOrders.unshift(data[0]);
                
                document.getElementById('orderNumber').textContent = orderNumber;
                document.getElementById('checkoutForm').style.display = 'none';
                document.getElementById('successMessage').style.display = 'block';
                
                // Reset cart
                cart = [];
                updateCartUI();
                
                showNotification('Order placed successfully!');
            } catch (error) {
                showNotification('Error placing order: ' + error.message);
                console.error('Order error:', error);
            }
        }

        function closeSuccessMessage() {
            document.getElementById('checkoutModal').classList.remove('active');
            document.getElementById('checkoutForm').style.display = 'block';
            document.getElementById('successMessage').style.display = 'none';
            document.querySelector('form').reset();
            showPage('dashboardPage');
        }

        function showNotification(message) {
            const notification = document.getElementById('notification');
            notification.textContent = message;
            notification.classList.add('show');
            
            setTimeout(() => {
                notification.classList.remove('show');
            }, 3000);
        }

        const modal = document.getElementById('checkoutModal');
        if (modal) {
         modal.addEventListener('click', function(e) {
         if (e.target === this) {
            closeCheckout();
        }
            });
        }

        // Initialize
        initApp(); 