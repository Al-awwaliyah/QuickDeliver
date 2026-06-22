 // Supabase Configuration
        // ---------------------------------------------------------------
        const SUPABASE_URL = 'https://thdbbhwaqxbcjxqaysgg.supabase.co';
        const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRoZGJiaHdhcXhiY2p4cWF5c2dnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1Mjk3MDgsImV4cCI6MjA3OTEwNTcwOH0.SR-Xur_HJc3Nq1m7mkZYYiWNbVpyi8YcIw7fMgISoS0';

        // Guard against the Supabase CDN script failing/being blocked.
        // Previously this line threw immediately and killed everything that
        // ran after it at the top level of the script.
        let supabaseClient = null;
        try {
            if (window.supabase && typeof window.supabase.createClient === 'function') {
                supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            } else {
                console.error('Supabase library did not load. Auth/orders features will not work until this is fixed.');
            }
        } catch (err) {
            console.error('Failed to initialize Supabase client:', err);
        }

        function requireSupabase() {
            if (!supabaseClient) {
                showNotification('Service temporarily unavailable. Please refresh and try again.', true);
                return false;
            }
            return true;
        }

        // ---------------------------------------------------------------
        // Static data
        // ---------------------------------------------------------------
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
            { id: 1, name: 'Jollof Rice & Chicken', category: 1, price: 2500, icon: '🍚', desc: 'Classic Nigerian Jollof with fried chicken', rating: 4.8, deliveryTime: '25-35 min', restaurant: 'Delight Restaurant Offa' },
            { id: 2, name: 'Amala & Abula', category: 1, price: 1800, icon: '🍲', desc: 'Yam flour with Gbegiri & Ewedu soup', rating: 4.9, deliveryTime: '30-40 min', restaurant: 'Delight Restaurant Offa' },
            { id: 3, name: 'Pounded Yam & Egusi', category: 1, price: 2200, icon: '🥘', desc: 'Fresh pounded yam with egusi soup', rating: 4.7, deliveryTime: '35-45 min', restaurant: 'Iya Alata Offa' },
            { id: 4, name: 'Fried Rice Combo', category: 1, price: 2800, icon: '🍱', desc: 'Fried rice with chicken & plantain', rating: 4.6, deliveryTime: '30-40 min', restaurant: 'Delight Restaurant Offa' },
            { id: 5, name: 'Suya (Stick)', category: 2, price: 1500, icon: '🍖', desc: 'Spicy grilled beef suya', rating: 4.8, deliveryTime: '20-30 min', restaurant: 'Mallam Suya Spot' },
            { id: 6, name: 'Akara & Bread', category: 2, price: 800, icon: '🍞', desc: 'Bean cakes with bread', rating: 4.5, deliveryTime: '15-20 min', restaurant: 'Mama Akara' },
            { id: 7, name: 'Fried Chicken', category: 2, price: 1500, icon: '🍗', desc: '3 pieces spicy fried chicken', rating: 4.6, deliveryTime: '20-30 min', restaurant: 'Tasty Fried Chicken' },
            { id: 8, name: 'Small Chops', category: 2, price: 3000, icon: '🥘', desc: 'Puff puff, spring rolls, samosa', rating: 4.7, deliveryTime: '25-35 min', restaurant: 'Small Chops Palace' }
        ];

        let cart = [];
        let selectedCategory = null;
        let currentUser = null;
        let userOrders = [];
        let userRole = null;

        // ---------------------------------------------------------------
        // Page navigation
        // ---------------------------------------------------------------
        function showPage(pageId) {
            document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
            const target = document.getElementById(pageId);
            if (!target) return;
            target.classList.add('active');

            if (pageId === 'browsePage') {
                initBrowsePage();
            } else if (pageId === 'dashboardPage') {
                initDashboard();
            } else if (pageId === 'riderPage') {
                initRiderDashboard();
            } else if (pageId === 'adminPage') {
                initAdminDashboard();
            }
        }

        function scrollToFeatures() {
            document.getElementById('features').scrollIntoView({ behavior: 'smooth' });
        }

        function switchAuthTab(tab) {
            document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));

            if (tab === 'login') {
                document.getElementById('loginTabBtn').classList.add('active');
                document.getElementById('loginForm').classList.add('active');
            } else {
                document.getElementById('signupTabBtn').classList.add('active');
                document.getElementById('signupForm').classList.add('active');
            }
        }

        function updateRoleFields() {
            const role = document.getElementById('signupRole').value;
            const vehicleField = document.getElementById('vehicleField');
            vehicleField.style.display = role === 'rider' ? 'block' : 'none';
        }

        // ---------------------------------------------------------------
        // Auth / session
        // ---------------------------------------------------------------
        async function initApp() {
            if (!requireSupabase()) return;

            const { data } = await supabaseClient.auth.getUser();
            const user = data && data.user;
            if (user) {
                currentUser = user;
                await loadUserData();
                await determineUserRole();
            }

            supabaseClient.auth.onAuthStateChange((event, session) => {
                if (event === 'SIGNED_IN') {
                    currentUser = session.user;
                    loadUserData();
                    determineUserRole();
                } else if (event === 'SIGNED_OUT') {
                    currentUser = null;
                    userRole = null;
                    cart = [];
                    userOrders = [];
                }
            });
        }

        async function determineUserRole() {
            if (!currentUser || !supabaseClient) return;

            try {
                const { data: profile } = await supabaseClient
                    .from('profiles')
                    .select('*')
                    .eq('id', currentUser.id)
                    .single();

                if (profile) {
                    userRole = profile.role || 'customer';

                    if (userRole === 'admin') {
                        showPage('adminPage');
                    } else if (userRole === 'rider') {
                        showPage('riderPage');
                    } else {
                        showPage('dashboardPage');
                    }
                }
            } catch (error) {
                console.error('Error determining role:', error);
                userRole = 'customer';
            }
        }

        async function loadUserData() {
            if (!currentUser || !supabaseClient) return;

            const { data: profile } = await supabaseClient
                .from('profiles')
                .select('*')
                .eq('id', currentUser.id)
                .single();

            if (profile) {
                currentUser.profile = profile;
            }

            await loadUserOrders();
        }

        async function loadUserOrders() {
            if (!currentUser || !supabaseClient) return;

            const { data } = await supabaseClient
                .from('orders')
                .select('*')
                .eq('user_id', currentUser.id)
                .order('created_at', { ascending: false });

            if (data) {
                userOrders = data;
            }
        }

        async function handleLogin(e) {
            e.preventDefault();
            if (!requireSupabase()) return;

            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;

            try {
                const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
                if (error) throw error;

                currentUser = data.user;
                await loadUserData();
                showNotification('Login successful! Welcome back.');
                setTimeout(() => showPage('dashboardPage'), 1000);
            } catch (error) {
                showNotification('Login failed: ' + error.message, true);
            }
        }

        async function handleSignup(e) {
            e.preventDefault();
            if (!requireSupabase()) return;

            const name = document.getElementById('signupName').value;
            const email = document.getElementById('signupEmail').value;
            const phone = document.getElementById('signupPhone').value;
            const address = document.getElementById('signupAddress').value;
            const role = document.getElementById('signupRole').value;
            const vehicle = document.getElementById('signupVehicle').value;
            const password = document.getElementById('signupPassword').value;
            const confirmPassword = document.getElementById('signupConfirmPassword').value;

            if (password !== confirmPassword) {
                showNotification('Passwords do not match!', true);
                return;
            }

            if (!role) {
                showNotification('Please select a role', true);
                return;
            }

            try {
                const { data, error } = await supabaseClient.auth.signUp({
                    email,
                    password,
                    options: { data: { full_name: name, phone, address, role } }
                });

                if (error) throw error;

                if (data.user) {
                    const profileData = {
                        id: data.user.id,
                        full_name: name,
                        email,
                        phone,
                        address,
                        role,
                        vehicle_type: role === 'rider' ? vehicle : null,
                        status: 'active'
                    };

                    const { error: profileError } = await supabaseClient.from('profiles').insert([profileData]);
                    if (profileError) console.error('Profile error:', profileError);

                    if (role === 'rider') {
                        await supabaseClient.from('rider_earnings').insert([{
                            rider_id: data.user.id,
                            total_earnings: 0,
                            total_deliveries: 0
                        }]);
                    }
                }

                currentUser = data.user;
                userRole = role;
                showNotification('Account created successfully!');
                setTimeout(() => showPage(role === 'rider' ? 'riderPage' : 'dashboardPage'), 2000);
            } catch (error) {
                showNotification('Signup failed: ' + error.message, true);
            }
        }

        async function handleLogout() {
            if (!requireSupabase()) return;

            try {
                const { error } = await supabaseClient.auth.signOut();
                if (error) throw error;

                currentUser = null;
                cart = [];
                userOrders = [];
                updateCartUI();
                showNotification('Logged out successfully.');
                setTimeout(() => showPage('landingPage'), 1000);
            } catch (error) {
                showNotification('Logout failed: ' + error.message, true);
            }
        }

        // ---------------------------------------------------------------
        // Customer dashboard
        // ---------------------------------------------------------------
        async function initDashboard() {
            if (!currentUser) {
                showPage('authPage');
                return;
            }

            const firstName = (currentUser.user_metadata?.full_name || currentUser.email).split(' ')[0];
            document.getElementById('userName').textContent = firstName;
            document.getElementById('dashboardUserName').textContent = firstName;
            document.getElementById('userAvatar').textContent = firstName.charAt(0).toUpperCase();

            await loadUserOrders();

            document.getElementById('totalOrders').textContent = userOrders.length;
            document.getElementById('pendingOrders').textContent = userOrders.filter(o => o.status === 'pending').length;
            document.getElementById('completedOrders').textContent = userOrders.filter(o => o.status === 'completed').length;

            const totalSpent = userOrders.reduce((sum, order) => sum + parseFloat(order.total || 0), 0);
            document.getElementById('totalSpent').textContent = `₦${totalSpent.toLocaleString()}`;

            displayRecentOrders();
        }

        function displayRecentOrders() {
            const ordersList = document.getElementById('recentOrdersList');

            if (userOrders.length === 0) {
                ordersList.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-icon">📦</div>
                        <p>No orders yet. Start browsing products!</p>
                        <button class="btn-browse" data-goto="browsePage" style="margin-top: 1rem;">Browse Products</button>
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

        // ---------------------------------------------------------------
        // Browse / shopping
        // ---------------------------------------------------------------
        function initBrowsePage() {
            renderCategories();
            renderProducts(products);
            updateCartUI();
        }

        function renderCategories() {
            const grid = document.getElementById('categoryGrid');
            grid.innerHTML = categories.map(cat => `
                <div class="category-card" data-category-id="${cat.id}">
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
                            <button class="add-to-cart" data-product-id="${product.id}">Add to Cart</button>
                        </div>
                    </div>
                </div>
            `).join('');
        }

        function filterByCategory(categoryId) {
            document.querySelectorAll('.category-card').forEach(card => {
                card.classList.toggle('active', Number(card.dataset.categoryId) === categoryId);
            });

            selectedCategory = categoryId;
            renderProducts(products.filter(p => p.category === categoryId));
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
            if (!product) return;
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
                                <button class="qty-btn" data-qty-action="dec" data-id="${item.id}">-</button>
                                <span>${item.quantity}</span>
                                <button class="qty-btn" data-qty-action="inc" data-id="${item.id}">+</button>
                            </div>
                        </div>
                        <button class="remove-btn" data-remove-id="${item.id}">×</button>
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
                showNotification('Your cart is empty!', true);
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

        function updateDeliveryFeeDisplay() {
            const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const deliverySelect = document.getElementById('deliveryTime');
            let deliveryFee = 0;
            if (deliverySelect.value === 'express') deliveryFee = 500;
            if (deliverySelect.value === 'same-day') deliveryFee = 1000;

            const total = subtotal + deliveryFee;
            document.getElementById('summaryDelivery').textContent = `₦${deliveryFee.toLocaleString()}`;
            document.getElementById('summaryTotal').textContent = `₦${total.toLocaleString()}`;
        }

        async function submitOrder(event) {
            event.preventDefault();
            if (!requireSupabase()) return;
            if (!currentUser) {
                showNotification('Please log in before placing an order.', true);
                return;
            }

            const orderNumber = Math.floor(100000 + Math.random() * 900000);
            const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const deliverySelect = document.getElementById('deliveryTime');
            let deliveryFee = 0;
            if (deliverySelect.value === 'express') deliveryFee = 500;
            if (deliverySelect.value === 'same-day') deliveryFee = 1000;
            const total = subtotal + deliveryFee;

            const orderData = {
                user_id: currentUser.id,
                order_number: orderNumber,
                items: JSON.stringify(cart),
                items_count: cart.length,
                subtotal,
                delivery_fee: deliveryFee,
                total,
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

            await saveOrderToDatabase(orderData, orderNumber);
        }

        async function saveOrderToDatabase(orderData, orderNumber) {
            try {
                const { data, error } = await supabaseClient.from('orders').insert([orderData]).select();
                if (error) throw error;

                userOrders.unshift(data[0]);

                document.getElementById('orderNumber').textContent = orderNumber;
                document.getElementById('checkoutForm').style.display = 'none';
                document.getElementById('successMessage').style.display = 'block';

                cart = [];
                updateCartUI();

                showNotification('Order placed successfully!');
            } catch (error) {
                showNotification('Error placing order: ' + error.message, true);
                console.error('Order error:', error);
            }
        }

        function closeSuccessMessage() {
            document.getElementById('checkoutModal').classList.remove('active');
            document.getElementById('checkoutForm').style.display = 'block';
            document.getElementById('successMessage').style.display = 'none';
            // Fixed: this used to call document.querySelector('form').reset(),
            // which grabs the FIRST <form> in the whole document (could be the
            // login form on another page) instead of the checkout form.
            document.getElementById('checkoutOrderForm').reset();
            showPage('dashboardPage');
        }

        // ---------------------------------------------------------------
        // Rider dashboard
        // ---------------------------------------------------------------
        async function initRiderDashboard() {
            if (!currentUser || userRole !== 'rider') {
                showPage('authPage');
                return;
            }
            if (!supabaseClient) return;

            const firstName = (currentUser.user_metadata?.full_name || currentUser.email).split(' ')[0];
            document.getElementById('riderName').textContent = firstName;
            document.getElementById('riderAvatar').textContent = firstName.charAt(0).toUpperCase();

            const { data: earnings } = await supabaseClient
                .from('rider_earnings')
                .select('*')
                .eq('rider_id', currentUser.id)
                .single();

            if (earnings) {
                document.getElementById('totalEarnings').textContent = `₦${earnings.total_earnings.toLocaleString()}`;
                document.getElementById('totalDeliveries').textContent = earnings.total_deliveries;
            }

            await loadAvailableOrders();
            await loadActiveDeliveries();
        }

        async function loadAvailableOrders() {
            try {
                const { data: orders } = await supabaseClient
                    .from('orders')
                    .select('*')
                    .eq('status', 'pending')
                    .limit(10);

                const list = document.getElementById('availableOrdersList');
                if (!orders || orders.length === 0) {
                    list.innerHTML = '<p style="text-align: center; color: #999;">No available orders</p>';
                    return;
                }

                list.innerHTML = orders.map(order => `
                    <div class="order-item">
                        <div class="order-info">
                            <h4>Order #${order.order_number}</h4>
                            <p>📍 ${order.delivery_address}, ${order.delivery_city}</p>
                            <p>₦${parseFloat(order.total).toLocaleString()}</p>
                        </div>
                        <button class="btn-sm btn-update" data-accept-order="${order.id}">Accept Delivery</button>
                    </div>
                `).join('');
            } catch (error) {
                console.error('Error loading orders:', error);
            }
        }

        async function loadActiveDeliveries() {
            try {
                const { data: deliveries } = await supabaseClient
                    .from('orders')
                    .select('*')
                    .eq('assigned_rider', currentUser.id)
                    .neq('status', 'completed');

                const list = document.getElementById('activeDeliveriesList');
                const count = deliveries ? deliveries.length : 0;
                document.getElementById('activeDeliveries').textContent = count;

                if (!deliveries || deliveries.length === 0) {
                    list.innerHTML = '<p style="text-align: center; color: #999;">No active deliveries</p>';
                    return;
                }

                list.innerHTML = deliveries.map(delivery => `
                    <div class="order-item">
                        <div class="order-info">
                            <h4>Order #${delivery.order_number}</h4>
                            <p>📍 ${delivery.delivery_address}</p>
                            <p>Status: <span style="color: var(--warning);">${delivery.status}</span></p>
                        </div>
                        <div style="display: flex; gap: 0.5rem;">
                            <button class="btn-sm btn-update" data-delivery-id="${delivery.id}" data-delivery-status="on_way">On Way</button>
                            <button class="btn-sm btn-update" data-delivery-id="${delivery.id}" data-delivery-status="completed">Delivered</button>
                        </div>
                    </div>
                `).join('');
            } catch (error) {
                console.error('Error loading deliveries:', error);
            }
        }

        async function acceptOrder(orderId) {
            try {
                const { error } = await supabaseClient
                    .from('orders')
                    .update({ assigned_rider: currentUser.id, status: 'processing' })
                    .eq('id', orderId);

                if (error) throw error;

                showNotification('Order accepted! Start delivery.');
                await loadAvailableOrders();
                await loadActiveDeliveries();
            } catch (error) {
                showNotification('Error accepting order: ' + error.message, true);
            }
        }

        async function updateDeliveryStatus(orderId, newStatus) {
            try {
                const { error } = await supabaseClient
                    .from('orders')
                    .update({ status: newStatus })
                    .eq('id', orderId);

                if (error) throw error;

                showNotification('Delivery status updated!');
                await loadActiveDeliveries();

                if (newStatus === 'completed') {
                    await updateRiderEarnings();
                }
            } catch (error) {
                showNotification('Error updating status: ' + error.message, true);
            }
        }

        async function updateRiderEarnings() {
            try {
                const { data: earnings } = await supabaseClient
                    .from('rider_earnings')
                    .select('*')
                    .eq('rider_id', currentUser.id)
                    .single();

                if (earnings) {
                    const newEarnings = earnings.total_earnings + 1500;
                    const newDeliveries = earnings.total_deliveries + 1;

                    await supabaseClient
                        .from('rider_earnings')
                        .update({ total_earnings: newEarnings, total_deliveries: newDeliveries })
                        .eq('rider_id', currentUser.id);

                    document.getElementById('totalEarnings').textContent = `₦${newEarnings.toLocaleString()}`;
                    document.getElementById('totalDeliveries').textContent = newDeliveries;
                }
            } catch (error) {
                console.error('Error updating earnings:', error);
            }
        }

        // ---------------------------------------------------------------
        // Admin dashboard
        // ---------------------------------------------------------------
        async function initAdminDashboard() {
            if (!currentUser || userRole !== 'admin') {
                showPage('authPage');
                return;
            }
            if (!supabaseClient) return;

            const firstName = (currentUser.user_metadata?.full_name || currentUser.email).split(' ')[0];
            document.getElementById('adminName').textContent = firstName;
            document.getElementById('adminAvatar').textContent = firstName.charAt(0).toUpperCase();

            const { data: users } = await supabaseClient.from('profiles').select('*').eq('role', 'customer');
            const { data: riders } = await supabaseClient.from('profiles').select('*').eq('role', 'rider');
            const { data: orders } = await supabaseClient.from('orders').select('*');

            document.getElementById('totalUsers').textContent = users ? users.length : 0;
            document.getElementById('totalRiders').textContent = riders ? riders.length : 0;
            document.getElementById('adminTotalOrders').textContent = orders ? orders.length : 0;

            const totalRev = orders ? orders.reduce((sum, o) => sum + parseFloat(o.total || 0), 0) : 0;
            document.getElementById('totalRevenue').textContent = `₦${totalRev.toLocaleString()}`;
        }

        function showAdminSection(section) {
            if (section === 'users') loadAdminUsers();
            else if (section === 'riders') loadAdminRiders();
            else if (section === 'orders') loadAdminOrders();
            else if (section === 'payments') loadAdminPayments();
        }

        async function loadAdminUsers() {
            try {
                const { data: users } = await supabaseClient.from('profiles').select('*').eq('role', 'customer');
                const content = document.getElementById('adminContent');
                if (!users || users.length === 0) {
                    content.innerHTML = '<p>No users found</p>';
                    return;
                }

                content.innerHTML = `
                    <h3>Customers (${users.length})</h3>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr style="background: var(--light);">
                            <th style="padding: 1rem; text-align: left;">Name</th>
                            <th style="padding: 1rem; text-align: left;">Email</th>
                            <th style="padding: 1rem; text-align: left;">Phone</th>
                            <th style="padding: 1rem; text-align: left;">Status</th>
                        </tr>
                        ${users.map(u => `
                            <tr style="border-bottom: 1px solid #eee;">
                                <td style="padding: 1rem;">${u.full_name}</td>
                                <td style="padding: 1rem;">${u.email}</td>
                                <td style="padding: 1rem;">${u.phone}</td>
                                <td style="padding: 1rem;">${u.status}</td>
                            </tr>
                        `).join('')}
                    </table>
                `;
            } catch (error) {
                document.getElementById('adminContent').innerHTML = `<p>Error: ${error.message}</p>`;
            }
        }

        async function loadAdminRiders() {
            try {
                const { data: riders } = await supabaseClient.from('profiles').select('*').eq('role', 'rider');
                const content = document.getElementById('adminContent');
                if (!riders || riders.length === 0) {
                    content.innerHTML = '<p>No riders found</p>';
                    return;
                }

                content.innerHTML = `
                    <h3>Delivery Riders (${riders.length})</h3>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr style="background: var(--light);">
                            <th style="padding: 1rem; text-align: left;">Name</th>
                            <th style="padding: 1rem; text-align: left;">Phone</th>
                            <th style="padding: 1rem; text-align: left;">Vehicle</th>
                            <th style="padding: 1rem; text-align: left;">Status</th>
                        </tr>
                        ${riders.map(r => `
                            <tr style="border-bottom: 1px solid #eee;">
                                <td style="padding: 1rem;">${r.full_name}</td>
                                <td style="padding: 1rem;">${r.phone}</td>
                                <td style="padding: 1rem;">${r.vehicle_type}</td>
                                <td style="padding: 1rem;">${r.status}</td>
                            </tr>
                        `).join('')}
                    </table>
                `;
            } catch (error) {
                document.getElementById('adminContent').innerHTML = `<p>Error: ${error.message}</p>`;
            }
        }

        async function loadAdminOrders() {
            try {
                const { data: orders } = await supabaseClient
                    .from('orders')
                    .select('*')
                    .order('created_at', { ascending: false })
                    .limit(20);

                const content = document.getElementById('adminContent');
                if (!orders || orders.length === 0) {
                    content.innerHTML = '<p>No orders found</p>';
                    return;
                }

                content.innerHTML = `
                    <h3>Recent Orders</h3>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr style="background: var(--light);">
                            <th style="padding: 1rem; text-align: left;">Order #</th>
                            <th style="padding: 1rem; text-align: left;">Customer</th>
                            <th style="padding: 1rem; text-align: left;">Amount</th>
                            <th style="padding: 1rem; text-align: left;">Status</th>
                        </tr>
                        ${orders.map(o => `
                            <tr style="border-bottom: 1px solid #eee;">
                                <td style="padding: 1rem;">#${o.order_number}</td>
                                <td style="padding: 1rem;">${o.customer_name}</td>
                                <td style="padding: 1rem;">₦${parseFloat(o.total).toLocaleString()}</td>
                                <td style="padding: 1rem;"><span style="background: var(--warning); padding: 0.3rem 0.8rem; border-radius: 10px; font-size: 0.85rem;">${o.status}</span></td>
                            </tr>
                        `).join('')}
                    </table>
                `;
            } catch (error) {
                document.getElementById('adminContent').innerHTML = `<p>Error: ${error.message}</p>`;
            }
        }

        async function loadAdminPayments() {
            try {
                const { data: orders } = await supabaseClient
                    .from('orders')
                    .select('*')
                    .order('created_at', { ascending: false });

                const content = document.getElementById('adminContent');
                const totalPayments = orders ? orders.reduce((sum, o) => sum + parseFloat(o.total || 0), 0) : 0;

                content.innerHTML = `
                    <h3>Payment Summary</h3>
                    <div style="background: var(--light); padding: 2rem; border-radius: 8px; margin-bottom: 2rem;">
                        <p style="font-size: 2rem; font-weight: bold; color: var(--primary);">₦${totalPayments.toLocaleString()}</p>
                        <p>Total Revenue</p>
                    </div>
                    <h3>Recent Payments</h3>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr style="background: var(--light);">
                            <th style="padding: 1rem; text-align: left;">Order #</th>
                            <th style="padding: 1rem; text-align: left;">Amount</th>
                            <th style="padding: 1rem; text-align: left;">Method</th>
                            <th style="padding: 1rem; text-align: left;">Date</th>
                        </tr>
                        ${orders && orders.length > 0 ? orders.slice(0, 20).map(o => `
                            <tr style="border-bottom: 1px solid #eee;">
                                <td style="padding: 1rem;">#${o.order_number}</td>
                                <td style="padding: 1rem;">₦${parseFloat(o.total).toLocaleString()}</td>
                                <td style="padding: 1rem;">${o.payment_method}</td>
                                <td style="padding: 1rem;">${new Date(o.created_at).toLocaleDateString()}</td>
                            </tr>
                        `).join('') : '<tr><td colspan="4" style="padding: 1rem; text-align: center;">No payments</td></tr>'}
                    </table>
                `;
            } catch (error) {
                document.getElementById('adminContent').innerHTML = `<p>Error: ${error.message}</p>`;
            }
        }

        // ---------------------------------------------------------------
        // Notifications
        // ---------------------------------------------------------------
        function showNotification(message, isError) {
            const notification = document.getElementById('notification');
            if (!notification) return; // defensive: never throw just because of a UI toast
            notification.textContent = message;
            notification.classList.toggle('error', !!isError);
            notification.classList.add('show');

            clearTimeout(notification._hideTimer);
            notification._hideTimer = setTimeout(() => {
                notification.classList.remove('show');
            }, 3000);
        }

        // ---------------------------------------------------------------
        // Event wiring (all done via addEventListener / delegation instead
        // of inline onclick="" attributes — this is the fix for "Get
        // Started" and "Login" appearing to do nothing in environments
        // that restrict inline event-handler attributes, e.g. via a
        // Content-Security-Policy, sandboxed preview, or some browser
        // extensions. addEventListener also keeps logic out of HTML strings
        // and avoids relying on the implicit/global `event` object.)
        // ---------------------------------------------------------------
        document.addEventListener('DOMContentLoaded', wireUpEvents);
        // In case the script runs after DOMContentLoaded already fired
        // (e.g. script placed at end of body, which is the case here):
        if (document.readyState !== 'loading') {
            wireUpEvents();
        }

        function wireUpEvents() {
            // Landing page
            document.getElementById('getStartedBtn')?.addEventListener('click', () => showPage('authPage'));
            document.getElementById('ctaSignupBtn')?.addEventListener('click', () => showPage('authPage'));
            document.getElementById('learnMoreBtn')?.addEventListener('click', scrollToFeatures);
            document.getElementById('navLoginLink')?.addEventListener('click', (e) => {
                e.preventDefault();
                showPage('authPage');
            });

            // Auth page
            document.getElementById('authBackLink')?.addEventListener('click', (e) => {
                e.preventDefault();
                showPage('landingPage');
            });
            document.getElementById('loginTabBtn')?.addEventListener('click', () => switchAuthTab('login'));
            document.getElementById('signupTabBtn')?.addEventListener('click', () => switchAuthTab('signup'));
            document.querySelectorAll('.auth-switch-link').forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    switchAuthTab(link.dataset.tab);
                });
            });
            document.getElementById('loginForm')?.addEventListener('submit', handleLogin);
            document.getElementById('signupForm')?.addEventListener('submit', handleSignup);
            document.getElementById('signupRole')?.addEventListener('change', updateRoleFields);

            // Logout buttons (dashboard / rider / admin)
            document.getElementById('dashboardLogoutBtn')?.addEventListener('click', handleLogout);
            document.getElementById('riderLogoutBtn')?.addEventListener('click', handleLogout);
            document.getElementById('adminLogoutBtn')?.addEventListener('click', handleLogout);

            // Generic "data-goto" navigation (dashboard quick actions, nav links, etc.)
            document.body.addEventListener('click', (e) => {
                const gotoEl = e.target.closest('[data-goto]');
                if (gotoEl) {
                    e.preventDefault();
                    showPage(gotoEl.dataset.goto);
                }
            });

            // Browse page
            document.getElementById('openCartBtn')?.addEventListener('click', toggleCart);
            document.getElementById('closeCartBtn')?.addEventListener('click', toggleCart);
            document.getElementById('searchBtn')?.addEventListener('click', searchProducts);
            document.getElementById('searchInput')?.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') searchProducts();
            });
            document.getElementById('checkoutBtn')?.addEventListener('click', openCheckout);
            document.getElementById('checkoutCancelBtn')?.addEventListener('click', closeCheckout);
            document.getElementById('continueShoppingBtn')?.addEventListener('click', closeSuccessMessage);
            document.getElementById('checkoutOrderForm')?.addEventListener('submit', submitOrder);
            document.getElementById('deliveryTime')?.addEventListener('change', updateDeliveryFeeDisplay);

            document.getElementById('checkoutModal')?.addEventListener('click', function (e) {
                if (e.target === this) closeCheckout();
            });

            // Category grid (delegated — content is rendered dynamically)
            document.getElementById('categoryGrid')?.addEventListener('click', (e) => {
                const card = e.target.closest('.category-card');
                if (card) filterByCategory(Number(card.dataset.categoryId));
            });

            // Product grid (delegated)
            document.getElementById('productGrid')?.addEventListener('click', (e) => {
                const btn = e.target.closest('[data-product-id]');
                if (btn) addToCart(Number(btn.dataset.productId));
            });

            // Cart items (delegated)
            document.getElementById('cartItems')?.addEventListener('click', (e) => {
                const qtyBtn = e.target.closest('[data-qty-action]');
                if (qtyBtn) {
                    const id = Number(qtyBtn.dataset.id);
                    updateQuantity(id, qtyBtn.dataset.qtyAction === 'inc' ? 1 : -1);
                    return;
                }
                const removeBtn = e.target.closest('[data-remove-id]');
                if (removeBtn) removeFromCart(Number(removeBtn.dataset.removeId));
            });

            // Admin quick actions
            document.getElementById('adminQuickActions')?.addEventListener('click', (e) => {
                const card = e.target.closest('[data-section]');
                if (card) showAdminSection(card.dataset.section);
            });

            // Rider: available orders / active deliveries (delegated)
            document.getElementById('availableOrdersList')?.addEventListener('click', (e) => {
                const btn = e.target.closest('[data-accept-order]');
                if (btn) acceptOrder(Number(btn.dataset.acceptOrder));
            });
            document.getElementById('activeDeliveriesList')?.addEventListener('click', (e) => {
                const btn = e.target.closest('[data-delivery-id]');
                if (btn) updateDeliveryStatus(Number(btn.dataset.deliveryId), btn.dataset.deliveryStatus);
            });
        }

        // Initialize app
        initApp();