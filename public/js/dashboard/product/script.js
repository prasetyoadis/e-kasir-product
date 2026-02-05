/**
 * ============================================================================
 * 1. GLOBAL FUNCTION: TAB SWITCHING
 * ============================================================================
 * Digunakan di halaman Index (jika ada tab) dan Halaman Detail.
 */
window.switchTab = function (event, tabName) {
    if (event) event.preventDefault();

    // 1. Reset status aktif pada semua tombol tab
    document.querySelectorAll(".tab-link").forEach((link) => {
        link.classList.remove("active");
    });

    // Jika diklik manual (ada event), tambahkan class active ke tombol yang diklik
    if (event) event.currentTarget.classList.add("active");

    // 2. Sembunyikan SEMUA konten tab agar tidak tumpang tindih
    document.querySelectorAll(".tab-content").forEach((content) => {
        content.style.display = "none";
        content.classList.remove("active-content");
    });

    // 3. Tampilkan konten tab yang dipilih
    const target = document.getElementById("tab-" + tabName);
    if (target) {
        target.style.display = "block"; // Sesuai CSS active-content
        target.classList.add("active-content");
    }
};

/**
 * ============================================================================
 * 2. MAIN LOGIC (DOM READY)
 * ============================================================================
 */
document.addEventListener("DOMContentLoaded", function () {
    console.log("Script Loaded & DOM Ready");

    // --- KONFIGURASI PATH API ---
    // Sesuaikan dengan struktur folder public Anda
    const API_PATH_INDEX = "/test-response/success/product/200-get-all-product.json";
    const API_PATH_DETAIL = "/test-response/success/product/200-get-product.json";

    // --- DETEKSI HALAMAN ---
    const isIndexPage = document.getElementById("tableBody") !== null;
    const isDetailPage = document.querySelector(".prod-title") !== null;

    // --- ROUTING LOGIC ---
    if (isIndexPage) {
        console.log("Mode: Halaman List Produk");
        fetchData(API_PATH_INDEX, initIndexPage);
    }
    else if (isDetailPage) {
        console.log("Mode: Halaman Detail Produk");
        fetchData(API_PATH_DETAIL, initDetailPage);
    }

    // --- FUNGSI FETCH DATA (HELPER) ---
    function fetchData(url, callback) {
        fetch(url)
            .then((res) => {
                if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
                return res.json();
            })
            .then((json) => {
                if (json.result && json.result.data) {
                    callback(json.result.data);
                } else {
                    throw new Error("Format JSON tidak valid.");
                }
            })
            .catch((err) => {
                console.error("Fetch Error:", err);
                if(isDetailPage) alert("Gagal memuat data: " + err.message);
                if(isIndexPage) document.getElementById("tableBody").innerHTML = `<tr><td colspan="5" style="text-align:center; color:red;">${err.message}</td></tr>`;
            });
    }

    // ========================================================================
    // 3. LOGIKA HALAMAN INDEX (DAFTAR PRODUK)
    // ========================================================================
    function initIndexPage(dataList) {
        let originalData = [...dataList]; // Simpan data asli untuk filter

        // Elements
        const tableBody = document.getElementById("tableBody");
        const searchInput = document.getElementById("searchInput");
        const filterCategory = document.getElementById("filterCategory") || document.querySelector(".table-filter");

        // Modal Elements (Produk Utama)
        const modal = document.getElementById("modalForm");
        const modalTitle = document.getElementById("modalTitle");
        const btnTambah = document.getElementById("btnTambah");
        const btnClose = document.getElementById("closeModal");
        const btnBatal = document.getElementById("btnBatal");
        const productForm = document.getElementById("productForm");

        // Input Form Produk
        const inputId = document.getElementById("productId");
        const inputNama = document.getElementById("inputNama");
        const inputKategori = document.getElementById("inputKategori");
        const inputDesc = document.getElementById("inputDesc");
        const inputStatus = document.getElementById("inputStatus");
        const statusLabel = document.getElementById("statusLabel");
        const imagePreview = document.getElementById("imagePreview");
        const previewContainer = document.getElementById("imagePreviewContainer");

        // --- A. Render Tabel ---
        function renderTable(data) {
            tableBody.innerHTML = "";
            if (!data || data.length === 0) {
                tableBody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:20px;">Data tidak ditemukan</td></tr>`;
                return;
            }

            data.forEach((item) => {
                const isActive = item.is_active;
                const statusBadge = isActive
                    ? `<span class="badge badge-active"><span class="dot bg-green"></span> Aktif</span>`
                    : `<span class="badge badge-inactive"><span class="dot bg-gray"></span> Nonaktif</span>`;

                const dotStock = item.current_stock > 0 ? "bg-green" : "bg-red";
                const imgUrl = (item.image && item.image.url) ? item.image.url : "https://via.placeholder.com/56";
                const category = item.categories ? item.categories[0] : '-';

                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>
                        <div class="product-cell">
                            <img src="${imgUrl}" class="product-img" onerror="this.src='https://via.placeholder.com/56'">
                            <div class="product-info">
                                <h4>${item.name}</h4>
                                <small style="color:#888;">${item.sku || '-'}</small>
                            </div>
                        </div>
                    </td>
                    <td>${category}</td>
                    <td>${statusBadge}</td>
                    <td>
                        <div style="display:flex; align-items:center; gap:8px;">
                            <span class="dot ${dotStock}"></span>
                            <strong>${item.current_stock}</strong>
                        </div>
                    </td>
                    <td>
                        <div class="action-buttons">
                            <button class="btn-outline" onclick="window.location.href='/dashboard/products/detail?id=${item.id}'">Detail</button>
                            <button class="btn-outline" onclick="openEditProduct('${item.id}')">Edit</button>
                        </div>
                    </td>
                `;
                tableBody.appendChild(tr);
            });

            // Update Pagination Info (Placeholder)
            const pageInfo = document.getElementById("pageInfo");
            if(pageInfo) pageInfo.textContent = `Showing 1 to ${data.length} entries`;
        }

        // --- B. Filter Logic (Search + Category) ---
        function applyFilters() {
            const keyword = searchInput ? searchInput.value.toLowerCase() : "";
            const category = filterCategory ? filterCategory.value : "";

            const filtered = originalData.filter(item => {
                const matchName = item.name.toLowerCase().includes(keyword);
                let matchCat = true;
                if (category && category !== "") {
                    matchCat = item.categories && item.categories.includes(category);
                }
                return matchName && matchCat;
            });

            renderTable(filtered);
        }

        if (searchInput) searchInput.addEventListener("input", applyFilters);
        if (filterCategory) filterCategory.addEventListener("change", applyFilters);

        // --- C. Modal Logic (Produk Utama) ---
        function showModal() {
            if(modal) { modal.classList.add("open"); modal.style.display = "flex"; }
        }
        function hideModal() {
            if(modal) { modal.classList.remove("open"); modal.style.display = "none"; }
        }
        function resetForm() {
            if(productForm) productForm.reset();
            if(inputId) inputId.value = "";
            if(imagePreview) imagePreview.src = "";
            if(previewContainer) previewContainer.style.display = "none";
            if(inputStatus) inputStatus.checked = true;
            if(statusLabel) statusLabel.textContent = "Aktif";
        }

        if (btnTambah) btnTambah.addEventListener("click", () => {
            resetForm();
            if(modalTitle) modalTitle.textContent = "Tambah Produk";
            showModal();
        });

        if (btnClose) btnClose.addEventListener("click", hideModal);
        if (btnBatal) btnBatal.addEventListener("click", hideModal);

        if (inputStatus) {
            inputStatus.addEventListener("change", function() {
                if(statusLabel) statusLabel.textContent = this.checked ? "Aktif" : "Nonaktif";
            });
        }

        // Global Function untuk Edit Produk (Index)
        window.openEditProduct = function(id) {
            const product = originalData.find(p => p.id == id);
            if (!product) return;

            resetForm();
            if(modalTitle) modalTitle.textContent = "Edit Produk";

            if(inputId) inputId.value = product.id;
            if(inputNama) inputNama.value = product.name;
            if(inputDesc) inputDesc.value = product.description || "";
            if(inputKategori && product.categories) inputKategori.value = product.categories[0];

            if(inputStatus) {
                inputStatus.checked = product.is_active;
                statusLabel.textContent = product.is_active ? "Aktif" : "Nonaktif";
            }

            if (product.image && product.image.url) {
                 if(imagePreview) imagePreview.src = product.image.url;
                 if(previewContainer) previewContainer.style.display = "block";
            }
            showModal();
        };

        // Render Awal
        renderTable(dataList);
    }

    // ========================================================================
    // 4. LOGIKA HALAMAN DETAIL
    // ========================================================================
    function initDetailPage(detailData) {
        console.log("Detail Data Loaded:", detailData);

        // --- A. Render Header & Info (Versi Bersih: Tanpa SKU & Stok) ---
        const domTitle = document.querySelector(".prod-title");
        const domImg = document.querySelector(".prod-main-img");

        // 1. Set Judul
        if(domTitle) domTitle.textContent = detailData.name;

        // 2. Set Gambar Utama
        if (domImg && detailData.image && detailData.image.length > 0) {
            const defaultImg = detailData.image.find(img => img.is_default) || detailData.image[0];
            domImg.src = defaultImg.url;
        }

        // --- Info Tab Text (Bagian Bawah) ---
        const setText = (id, val) => { const el = document.getElementById(id); if(el) el.textContent = val; };
        setText("detailName", detailData.name);
        setText("detailCategory", detailData.categories ? detailData.categories.join(", ") : "-");
        setText("detailDesc", detailData.description || "-");


        // --- B. RENDER TABEL VARIAN (UPDATED: Parameter Edit Baru) ---
        const variantBody = document.getElementById("variantTableBody");
        if (variantBody && detailData.variants) {
            variantBody.innerHTML = "";
            detailData.variants.forEach((v) => {
                const tr = document.createElement("tr");

                const statusBadge = v.is_active
                    ? `<span class="badge badge-active"><span class="dot bg-green"></span> Aktif</span>`
                    : `<span class="badge badge-inactive"><span class="dot bg-gray"></span> Nonaktif</span>`;

                // DATA PREPARATION FOR EDIT MODAL
                // Escape petik satu pada deskripsi agar tidak merusak HTML onclick
                const safeDesc = (v.description || "").replace(/'/g, "&#39;");

                // Parameter: ID, Nama, Desc, HargaAwal, MinStock, Status
                const editButton = `
                    <button class="btn-sm btn-outline"
                        onclick="openEditVariantModal('${v.id}', '${v.variant_name}', '${safeDesc}', ${v.harga_awal}, ${v.min_stock}, ${v.is_active})">
                        <i class="fa-regular fa-pen-to-square"></i> Edit
                    </button>
                `;

                tr.innerHTML = `
                    <td><strong>${v.variant_name}</strong></td>
                    <td>${v.sku || '-'}</td>
                    <td>${v.stock} pcs</td>
                    <td>${statusBadge}</td>
                    <td style="text-align:right">${editButton}</td>
                `;
                variantBody.appendChild(tr);
            });
        }


        // --- C. Render Tabel Stok (Overview) ---
        const stockBody = document.getElementById("stockTableBody");
        if (stockBody && detailData.variants) {
            stockBody.innerHTML = "";
            detailData.variants.forEach((v) => {
                const tr = document.createElement("tr");
                const statusBadge = v.is_active ? `<span class="badge badge-active">Aktif</span>` : `<span class="badge badge-inactive">Nonaktif</span>`;
                tr.innerHTML = `
                    <td style="font-family:monospace">${v.sku || '-'}</td>
                    <td><strong>${v.stock}</strong></td>
                    <td>${statusBadge}</td>
                `;
                stockBody.appendChild(tr);
            });
        }


        // --- D. Render Galeri ---
        const galleryGrid = document.getElementById("galleryGrid");
        if (galleryGrid && detailData.image) {
            galleryGrid.innerHTML = "";
            detailData.image.forEach(img => {
                const card = document.createElement("div");
                card.className = "img-card";
                card.innerHTML = `
                    <div class="img-thumb-wrapper">
                        <img src="${img.url}" class="img-thumb">
                        ${img.is_default ? '<span class="default-badge">Default</span>' : ''}
                    </div>`;
                galleryGrid.appendChild(card);
            });
        }

        // --- Init Default Tab ---
        initDefaultTab();
    }

    // Fungsi Default Tab (Detail Page)
    function initDefaultTab() {
        const urlParams = new URLSearchParams(window.location.search);
        const tabParam = urlParams.get('tab');

        // Hide all first
        document.querySelectorAll(".tab-content").forEach(el => el.style.display = "none");
        document.querySelectorAll(".tab-link").forEach(el => el.classList.remove("active"));

        if (tabParam) {
            window.switchTab(null, tabParam);
            const activeLink = document.querySelector(`.tab-link[onclick*='${tabParam}']`);
            if (activeLink) activeLink.classList.add('active');
        } else {
            // Default Info
            window.switchTab(null, 'info');
            const infoLink = document.querySelector(".tab-link[onclick*='info']");
            if (infoLink) infoLink.classList.add('active');
        }
    }

    // ========================================================================
    // 5. MODAL LOGIC KHUSUS EDIT VARIAN (UPDATED FIELDS)
    // ========================================================================

    // Menerima parameter sesuai permintaan: Nama, Desc, Harga Awal, MinStock, Status
    window.openEditVariantModal = function(id, name, desc, hargaAwal, minStock, isActive) {
        const modal = document.getElementById("modalEditVariant");

        if(modal) {
            // Isi Form dengan data dari parameter
            const idInput = document.getElementById("editVarId");
            const nameInput = document.getElementById("editVarName");
            const descInput = document.getElementById("editVarDesc");
            const hargaInput = document.getElementById("editVarHargaAwal");
            const minStockInput = document.getElementById("editVarMinStock");
            const statusCheck = document.getElementById("editVarStatus");
            const statusLabel = document.getElementById("editVarStatusLabel");

            if(idInput) idInput.value = id;
            if(nameInput) nameInput.value = name;
            if(descInput) descInput.value = desc;
            if(hargaInput) hargaInput.value = hargaAwal;
            if(minStockInput) minStockInput.value = minStock;

            // Handle Boolean/String logic for status
            const isActiveBool = (isActive === true || isActive === "true");
            if(statusCheck) statusCheck.checked = isActiveBool;
            if(statusLabel) statusLabel.textContent = isActiveBool ? "Aktif" : "Non-Aktif";

            // Tampilkan Modal
            modal.classList.add("open");
            modal.style.display = "flex";
        }
    };

    window.closeEditVariantModal = function() {
        const modal = document.getElementById("modalEditVariant");
        if(modal) {
            modal.classList.remove("open");
            modal.style.display = "none";
        }
    };

    // Listener untuk Label Toggle Status Real-time (Modal Varian)
    const editStatusCheck = document.getElementById("editVarStatus");
    const editStatusLabel = document.getElementById("editVarStatusLabel");
    if(editStatusCheck && editStatusLabel) {
        editStatusCheck.addEventListener("change", function() {
            editStatusLabel.textContent = this.checked ? "Aktif" : "Non-Aktif";
        });
    }

    // Handle Submit Form Varian (Simulasi)
    const editForm = document.getElementById("editVariantForm");
    if(editForm) {
        editForm.addEventListener("submit", function(e) {
            e.preventDefault();
            const newName = document.getElementById("editVarName").value;
            const newDesc = document.getElementById("editVarDesc").value;

            alert(`Simulasi: Varian '${newName}' berhasil diperbarui!\nDeskripsi: ${newDesc}`);
            closeEditVariantModal();
        });
    }
});
