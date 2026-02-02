document.addEventListener('DOMContentLoaded', function() {

    // ===============================================
    // BAGIAN 0: DATA SUMBER (SHARED DATA)
    // ===============================================
    // Data ini ditaruh di luar agar bisa diakses oleh Halaman Index & Detail

    const sourceData = [
        { "id": "uuid-1", "sku": "SNJ-SBY-001", "name": "Sego Njamoer Original", "base_price": 15000, "categories": ["Makanan", "Menu Utama", "Jamur"], "image": { "url" : "asset/img/products/snj-sby-001.webp" }, "is_active": true },
        { "id": "uuid-2", "sku": "SNJ-SBY-002", "name": "Sego Njamoer Sambal Ijo", "base_price": 16000, "categories": ["Makanan", "Menu Utama", "Pedas"], "image": { "url" : "asset/img/products/snj-sby-002.webp" }, "is_active": true },
        { "id": "uuid-3", "sku": "SNJ-SBY-003", "name": "Sego Njamoer Teriyaki", "base_price": 17000, "categories": ["Makanan", "Menu Utama", "Jamur"], "image": { "url" : "asset/img/products/snj-sby-003.webp" }, "is_active": true },
        { "id": "uuid-4", "sku": "SNJ-SBY-004", "name": "Jamur Crispy Original", "base_price": 10000, "categories": ["Snack", "Jamur"], "image": { "url" : "asset/img/products/snj-sby-004.webp" }, "is_active": true },
        { "id": "uuid-5", "sku": "SNJ-SBY-005", "name": "Jamur Crispy Balado", "base_price": 12000, "categories": ["Snack", "Pedas", "Jamur"], "image": { "url" : "asset/img/products/snj-sby-005.webp" }, "is_active": true },
        { "id": "uuid-6", "sku": "SNJ-SBY-006", "name": "Jamur Saus BBQ", "base_price": 13000, "categories": ["Snack", "Jamur"], "image": { "url" : "asset/img/products/snj-sby-006.webp" }, "is_active": true },
        { "id": "uuid-7", "sku": "SNJ-SBY-007", "name": "Nasi Putih", "base_price": 5000, "categories": ["Tambahan"], "image": { "url" : "asset/img/products/snj-sby-007.webp" }, "is_active": true },
        { "id": "uuid-8", "sku": "SNJ-SBY-008", "name": "Es Teh", "base_price": 5000, "categories": ["Minuman"], "image": { "url" : "asset/img/products/snj-sby-008.webp" }, "is_active": true },
        { "id": "uuid-9", "sku": "SNJ-SBY-009", "name": "Es Jeruk", "base_price": 6000, "categories": ["Minuman"], "image": { "url" : "asset/img/products/snj-sby-009.webp" }, "is_active": true },
        { "id": "uuid-10", "sku": "SNJ-SBY-010", "name": "Teh Hangat", "base_price": 4000, "categories": ["Minuman"], "image": { "url" : "asset/img/products/snj-sby-010.webp" }, "is_active": true }
    ];

    // ===============================================
    // BAGIAN 1: LOGIKA HALAMAN LIST PRODUK (INDEX)
    // ===============================================

    // Cek apakah tabel ada (Indikator Halaman Index)
    const tableBody = document.getElementById('tableBody');

    if (tableBody) {

        // --- 1. PREPARE DATA (DUPLIKASI UTK PAGINATION) ---
        let duplicatedData = [];
        for(let i = 0; i < 4; i++) { duplicatedData = duplicatedData.concat(sourceData); }

        const products = duplicatedData.map((item, index) => {
            const randomStock = Math.floor(Math.random() * 50);
            return {
                id: index + 1, // ID visual untuk urutan
                original_id: item.id, // UUID Asli untuk link detail
                name: item.name,
                sku: item.sku,
                category: item.categories[0],
                price: item.base_price,
                stock: randomStock,
                status: item.is_active ? 'Aktif' : 'Nonaktif',
                img: item.image.url ? item.image.url : 'asset/img/products/no_image.jpg'
            };
        });

        // --- 2. STATE MANAGEMENT ---
        let state = {
            data: products,
            filteredData: products,
            currentPage: 1,
            itemsPerPage: 15,
        };

        // --- 3. DOM ELEMENTS ---
        const searchInput = document.getElementById('searchInput');
        const categoryFilter = document.getElementById('categoryFilter');

        // Pagination
        const btnPrev = document.getElementById('btnPrev');
        const btnNext = document.getElementById('btnNext');
        const pageInfo = document.getElementById('pageInfo');
        const gotoPageInput = document.getElementById('gotoPageInput');
        const btnGo = document.getElementById('btnGo');

        // Modal Elements
        const modal = document.getElementById('modalForm');
        const productForm = document.getElementById('productForm');
        const modalTitle = document.getElementById('modalTitle');
        const btnTambah = document.getElementById('btnTambah');
        const btnClose = document.getElementById('closeModal');
        const btnBatal = document.getElementById('btnBatal');

        // Form Inputs
        const inputId = document.getElementById('productId');
        const inputNama = document.getElementById('inputNama');
        const inputSku = document.getElementById('inputSku');
        const inputKategori = document.getElementById('inputKategori');
        const inputHarga = document.getElementById('inputHarga');
        const inputStok = document.getElementById('inputStok');
        const inputStatus = document.getElementById('inputStatus');
        const statusLabel = document.getElementById('statusLabel');
        const btnSimpan = document.getElementById('btnSimpan');

        // --- 4. CORE FUNCTIONS ---

        function renderTable() {
            const startIndex = (state.currentPage - 1) * state.itemsPerPage;
            const endIndex = startIndex + state.itemsPerPage;
            const pageData = state.filteredData.slice(startIndex, endIndex);

            tableBody.innerHTML = '';

            if(pageData.length === 0) {
                tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 20px;">Tidak ada data ditemukan</td></tr>`;
                pageInfo.textContent = `Showing 0 of 0 entries`;
                return;
            }

            pageData.forEach(item => {
                const tr = document.createElement('tr');
                let badgeClass = ''; let dotClass = '';

                if (item.stock < 5) { badgeClass = 'badge-danger'; dotClass = 'bg-red'; }
                else if (item.stock < 15) { badgeClass = 'badge-warning'; dotClass = 'bg-yellow'; }
                else {
                    if(item.status === 'Nonaktif') { badgeClass = 'badge-inactive'; dotClass = 'bg-gray'; }
                    else { badgeClass = 'badge-active'; dotClass = 'bg-green'; }
                }

                // Perhatikan tombol Detail di bawah: window.location.href='detail-produk.html?id=${item.original_id}'
                tr.innerHTML = `
                    <td>
                        <div class="product-cell">
                            <img src="${item.img}" class="product-img" alt="${item.name}" onerror="this.onerror=null;this.src='/asset/img/products/no_image.jpg';">
                            <div class="product-info">
                                <h4>${item.name}</h4>
                                <p>${item.sku}</p>
                            </div>
                        </div>
                    </td>
                    <td>${item.category}</td>
                    <td class="price-text">Rp ${item.price.toLocaleString('id-ID')}</td>
                    <td>
                        <span class="badge ${badgeClass}">
                            <span class="dot ${dotClass}"></span> ${item.status}
                        </span>
                    </td>
                    <td>
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <span class="dot ${dotClass}"></span>
                            <span style="font-weight: 500;">${item.stock}</span>
                        </div>
                    </td>
                    <td>
                        <div class="action-buttons">
                            <button class="btn-outline" onclick="window.location.href='detail-produk.html?id=${item.original_id}'">Detail</button>
                            <button class="btn-outline" onclick="openEdit(${item.id})">Edit</button>
                        </div>
                    </td>
                `;
                tableBody.appendChild(tr);
            });

            const start = startIndex + 1;
            const end = Math.min(endIndex, state.filteredData.length);
            pageInfo.textContent = `Showing ${start} to ${end} of ${state.filteredData.length} entries`;

            updatePaginationControls();
        }

        function applyFilter() {
            const query = searchInput.value.toLowerCase();
            const category = categoryFilter.value;

            state.filteredData = state.data.filter(item => {
                const matchName = item.name.toLowerCase().includes(query);
                const matchCat = category === '' || item.category === category;
                return matchName && matchCat;
            });

            state.currentPage = 1;
            renderTable();
        }

        function updatePaginationControls() {
            const totalPages = Math.ceil(state.filteredData.length / state.itemsPerPage);
            btnPrev.disabled = state.currentPage === 1;
            btnNext.disabled = state.currentPage === totalPages || totalPages === 0;
            gotoPageInput.max = totalPages;
            gotoPageInput.value = state.currentPage;
        }

        // --- 5. MODAL & CRUD LOGIC (INDEX) ---
        function resetForm() {
            productForm.reset();
            inputId.value = '';
            inputStatus.checked = true;
            statusLabel.textContent = 'Aktif';
            [inputNama, inputSku, inputKategori, inputHarga, inputStok, inputStatus, btnSimpan].forEach(el => {
                el.disabled = false; el.style.opacity = '1';
            });
            btnSimpan.style.display = 'block';
        }

        if(btnTambah) {
            btnTambah.addEventListener('click', () => {
                resetForm(); modalTitle.textContent = "Tambah Produk"; modal.classList.add('open');
            });
        }

        // Helper untuk modal edit di halaman index
        const findProduct = (id) => state.data.find(p => p.id === id);

        window.openEdit = function(id) {
            const product = findProduct(id);
            if(!product) return;
            resetForm();
            modalTitle.textContent = "Edit Produk";
            inputId.value = product.id;
            inputNama.value = product.name;
            inputSku.value = product.sku;
            inputKategori.value = product.category;
            inputHarga.value = product.price;
            inputStok.value = product.stock;
            inputStatus.checked = product.status === 'Aktif';
            statusLabel.textContent = product.status;
            modal.classList.add('open');
        };

        if(productForm) {
            productForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const id = inputId.value;
                const isEdit = id !== '';
                const formData = {
                    id: isEdit ? parseInt(id) : Date.now(),
                    name: inputNama.value,
                    sku: inputSku.value,
                    category: inputKategori.value,
                    price: parseInt(inputHarga.value),
                    stock: parseInt(inputStok.value),
                    status: inputStatus.checked ? 'Aktif' : 'Nonaktif',
                    img: 'https://via.placeholder.com/56'
                };

                if (isEdit) {
                    const index = state.data.findIndex(p => p.id == id);
                    if(index !== -1) {
                        formData.img = state.data[index].img;
                        state.data[index] = { ...state.data[index], ...formData };
                    }
                } else {
                    state.data.unshift(formData);
                }
                modal.classList.remove('open');
                applyFilter();
                alert(isEdit ? 'Produk berhasil diperbarui!' : 'Produk berhasil ditambahkan!');
            });
        }

        if(inputStatus) {
            inputStatus.addEventListener('change', function() { statusLabel.textContent = this.checked ? 'Aktif' : 'Nonaktif'; });
        }

        const closeModalFunc = () => modal.classList.remove('open');
        if(btnClose) btnClose.addEventListener('click', closeModalFunc);
        if(btnBatal) btnBatal.addEventListener('click', closeModalFunc);
        if(modal) modal.addEventListener('click', (e) => { if(e.target === modal) closeModalFunc(); });

        // Event Listeners Index
        if(searchInput) searchInput.addEventListener('input', applyFilter);
        if(categoryFilter) categoryFilter.addEventListener('change', applyFilter);
        if(btnPrev) btnPrev.addEventListener('click', () => { if(state.currentPage > 1) { state.currentPage--; renderTable(); }});
        if(btnNext) btnNext.addEventListener('click', () => { const totalPages = Math.ceil(state.filteredData.length / state.itemsPerPage); if(state.currentPage < totalPages) { state.currentPage++; renderTable(); }});

        function goToPage() {
            const page = parseInt(gotoPageInput.value);
            const totalPages = Math.ceil(state.filteredData.length / state.itemsPerPage);
            if(page >= 1 && page <= totalPages) { state.currentPage = page; renderTable(); }
            else { alert(`Silakan masukkan halaman antara 1 - ${totalPages}`); gotoPageInput.value = state.currentPage; }
        }
        if(btnGo) btnGo.addEventListener('click', goToPage);
        if(gotoPageInput) gotoPageInput.addEventListener('keypress', (e) => { if(e.key === 'Enter') goToPage(); });

        // Init Table
        renderTable();
    }


    // ===============================================
    // BAGIAN 2: LOGIKA HALAMAN DETAIL (GALLERY)
    // ===============================================

    // Cek apakah kita ada di halaman detail (ada elemen galleryGrid)
    const galleryGrid = document.getElementById('galleryGrid');

    if (galleryGrid) {

        // --- 1. AMBIL ID DARI URL ---
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id');

        // Cari data produk berdasarkan ID URL dari sourceData
        const currentProduct = sourceData.find(p => p.id === productId);

        // --- 2. POPULATE HEADER DETAIL PRODUK ---
        if (currentProduct) {
            // Update Title
            const titleEl = document.querySelector('.prod-title');
            if(titleEl) titleEl.textContent = currentProduct.name;

            // Update SKU
            const skuEl = document.querySelector('.sku-badge');
            if(skuEl) skuEl.textContent = 'SKU: ' + currentProduct.sku;

            // Update Harga
            const priceEl = document.querySelector('.prod-price strong');
            if(priceEl) priceEl.textContent = 'Rp ' + currentProduct.base_price.toLocaleString('id-ID');

            // Update Gambar Utama Header
            const mainImgEl = document.querySelector('.prod-main-img');
            if(mainImgEl) {
                mainImgEl.src = currentProduct.image.url || 'https://via.placeholder.com/80';
                mainImgEl.alt = currentProduct.name;
            }

            // Update Status (Optional)
            const statusEl = document.querySelector('.status-pill');
            if(statusEl) {
                statusEl.textContent = currentProduct.is_active ? 'Aktif' : 'Nonaktif';
                if(!currentProduct.is_active) {
                    statusEl.classList.remove('active');
                    statusEl.style.background = '#F3F4F6';
                    statusEl.style.color = '#374151';
                }
            }
        } else {
            // Jika ID tidak ditemukan / user buka langsung detail-produk.html tanpa ID
            console.warn('Produk tidak ditemukan atau ID tidak ada di URL');
            // Opsional: Redirect kembali ke index atau tampilkan pesan error
        }


        // --- 3. GALLERY LOGIC ---

        // Setup data gallery awal (Simulasi: Gambar utama dari produk + dummy lainnya)
        let galleryData = [];

        if (currentProduct && currentProduct.image) {
            // Masukkan gambar utama produk sebagai gambar pertama (Default)
            galleryData.push({
                id: 999,
                url: currentProduct.image.url || 'https://via.placeholder.com/300',
                isDefault: true
            });
        }

        // Tambahkan dummy data tambahan agar galeri terlihat penuh
        galleryData.push(
            { id: 2, url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300', isDefault: false },
            { id: 3, url: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=300', isDefault: false },
            { id: 4, url: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=300', isDefault: false }
        );

        function renderGallery() {
            galleryGrid.innerHTML = '';

            galleryData.forEach(img => {
                const card = document.createElement('div');
                card.className = 'img-card';
                card.innerHTML = `
                    <div class="img-thumb-wrapper">
                        <img src="${img.url}" class="img-thumb" alt="Product Image" onerror="this.src='https://via.placeholder.com/300'">
                        ${img.isDefault ? '<span class="default-badge">Default</span>' : ''}

                        <button class="menu-trigger" onclick="toggleMenu(event, ${img.id})">⋮</button>

                        <div class="img-dropdown" id="dropdown-${img.id}">
                            ${!img.isDefault ? `<button onclick="setAsDefault(${img.id})">Atur Jadi Default</button>` : ''}
                            <button class="btn-delete" onclick="deleteImage(${img.id})">Hapus Gambar</button>
                        </div>
                    </div>
                `;
                galleryGrid.appendChild(card);
            });
        }

        window.toggleMenu = function(e, id) {
            e.stopPropagation();
            document.querySelectorAll('.img-dropdown').forEach(el => el.classList.remove('show'));
            document.querySelectorAll('.menu-trigger').forEach(el => el.classList.remove('active'));

            const dropdown = document.getElementById(`dropdown-${id}`);
            const trigger = e.currentTarget;
            if (dropdown) {
                dropdown.classList.toggle('show');
                trigger.classList.toggle('active');
            }
        };

        window.setAsDefault = function(id) {
            galleryData = galleryData.map(img => ({ ...img, isDefault: img.id === id }));
            renderGallery();
        };

        window.deleteImage = function(id) {
            if(confirm('Yakin ingin menghapus gambar ini?')) {
                galleryData = galleryData.filter(img => img.id !== id);
                renderGallery();
            }
        };

        document.addEventListener('click', function(e) {
            if (!e.target.closest('.img-card')) {
                document.querySelectorAll('.img-dropdown').forEach(el => el.classList.remove('show'));
                document.querySelectorAll('.menu-trigger').forEach(el => el.classList.remove('active'));
            }
        });

        const fileInput = document.getElementById('fileInput');
        if(fileInput) {
            fileInput.addEventListener('change', function(e) {
                if (this.files && this.files[0]) {
                    const newId = Date.now();
                    const newImg = {
                        id: newId,
                        url: URL.createObjectURL(this.files[0]),
                        isDefault: galleryData.length === 0
                    };
                    galleryData.push(newImg);
                    renderGallery();
                }
            });
        }

        // Init Gallery
        renderGallery();
    }
});
