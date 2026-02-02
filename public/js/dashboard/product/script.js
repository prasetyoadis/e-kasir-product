// ===============================================
// GLOBAL FUNCTION: TAB SWITCHING
// Ditaruh di luar agar bisa diakses oleh onclick di HTML
// ===============================================
window.switchTab = function (event, tabName) {
    if (event) event.preventDefault();

    // 1. Reset tombol active
    document
        .querySelectorAll(".tab-link")
        .forEach((link) => link.classList.remove("active"));
    if (event) event.currentTarget.classList.add("active");

    // 2. Sembunyikan semua konten tab
    document.querySelectorAll(".tab-content").forEach((content) => {
        content.style.display = "none";
    });

    // 3. Tampilkan target dengan Display Flex (agar layout Card tidak rusak)
    const target = document.getElementById("tab-" + tabName);
    if (target) {
        target.style.display = "flex";
        target.style.flexDirection = "column";
    }
};

document.addEventListener("DOMContentLoaded", function () {
    console.log("Script Loaded & DOM Ready");

    // Helper Format Rupiah
    const formatRupiah = (num) => "Rp " + num.toLocaleString("id-ID");

    // ===============================================
    // BAGIAN 0: DATA SUMBER (ENRICHED SOURCE DATA)
    // ===============================================
    const sourceData = [
        {
            id: "uuid-1",
            sku: "SNJ-SBY-001",
            name: "Nasi Goreng Original",
            base_price: 15000,
            categories: ["Makanan", "Menu Utama", "Nasi"],
            image: { url: "../../asset/img/products/nasi-goreng.jpg" },
            is_active: true,
            // Data Detail
            desc: "Nasi goreng dimasak dengan bumbu rempah pilihan, dilengkapi telur mata sapi, kerupuk, dan acar segar.",
            weight: 300,
            dimension: "Bowl 15cm",
            gallery: [
                {
                    id: 1,
                    url: "../../asset/img/products/nasi-goreng.jpg",
                    isDefault: true,
                },
                {
                    id: 2,
                    url: "https://images.unsplash.com/photo-1603133872878-684f571d70f2?w=300",
                    isDefault: false,
                },
            ],
            variants: [
                {
                    id: 101,
                    name: "Reguler",
                    price: 15000,
                    sku: "SNJ-001-REG",
                    stock: 20,
                    active: true,
                },
                {
                    id: 102,
                    name: "Jumbo",
                    price: 20000,
                    sku: "SNJ-001-JMB",
                    stock: 10,
                    active: true,
                },
                {
                    id: 103,
                    name: "Pedas",
                    price: 16000,
                    sku: "SNJ-001-PDS",
                    stock: 15,
                    active: true,
                },
            ],
            inventory: [
                {
                    loc: "Dapur Utama",
                    variant: "Reguler",
                    qty: 20,
                    rack: "Rak Bumbu A",
                },
                {
                    loc: "Dapur Utama",
                    variant: "Jumbo",
                    qty: 10,
                    rack: "Rak Bumbu A",
                },
                {
                    loc: "Gudang Bahan",
                    variant: "Pedas",
                    qty: 15,
                    rack: "Freezer 1",
                },
            ],
            history: [
                {
                    type: "in",
                    title: "Restock Bahan",
                    desc: "Beras & Bumbu masuk (+50 porsi)",
                    date: "Hari ini, 07:00",
                    user: "Chef",
                },
                {
                    type: "out",
                    title: "Penjualan Lunch",
                    desc: "Order #POS-112 (-2 Reguler)",
                    date: "Hari ini, 12:30",
                    user: "Kasir",
                },
            ],
        },
        {
            id: "uuid-2",
            sku: "SNJ-SBY-002",
            name: "Soto Ayam",
            base_price: 16000,
            categories: ["Makanan", "Menu Utama", "Kuah"],
            image: { url: "../../asset/img/products/soto-ayam.jpg" },
            is_active: true,
            desc: "Soto ayam kuah kuning bening dengan suwiran ayam kampung, soun, dan koya gurih.",
            weight: 400,
            dimension: "Bowl 18cm",
            gallery: [
                {
                    id: 1,
                    url: "../../asset/img/products/soto-ayam.jpg",
                    isDefault: true,
                },
            ],
            variants: [
                {
                    id: 201,
                    name: "Biasa",
                    price: 16000,
                    sku: "SNJ-002-STD",
                    stock: 25,
                    active: true,
                },
            ],
            inventory: [
                {
                    loc: "Dapur Utama",
                    variant: "Biasa",
                    qty: 25,
                    rack: "Panci A",
                },
            ],
            history: [
                {
                    type: "in",
                    title: "Masak Kuah",
                    desc: "Persiapan kuah soto (50 porsi)",
                    date: "Hari ini, 06:00",
                    user: "Chef",
                },
            ],
        },
        {
            id: "uuid-3",
            sku: "SNJ-SBY-003",
            name: "Ayam Kremes",
            base_price: 17000,
            categories: ["Makanan", "Menu Utama", "Nasi"],
            image: { url: "../../asset/img/products/ayam-kremes.jpg" },
            is_active: true,
            desc: "Ayam goreng ungkep bumbu kuning digoreng kering dengan taburan kremesan renyah.",
            weight: 200,
            gallery: [
                {
                    id: 1,
                    url: "../../asset/img/products/ayam-kremes.jpg",
                    isDefault: true,
                },
            ],
            variants: [
                {
                    id: 301,
                    name: "Dada",
                    price: 17000,
                    sku: "SNJ-003-DD",
                    stock: 12,
                    active: true,
                },
            ],
            inventory: [],
            history: [],
        },
        {
            id: "uuid-4",
            sku: "SNJ-SBY-004",
            name: "Mie Ayam",
            base_price: 10000,
            categories: ["Makanan", "Menu Utama", "Mie"],
            image: { url: "../../asset/img/products/mie-ayam.jpg" },
            is_active: true,
            desc: "Mie telur kenyal dengan topping ayam kecap manis gurih dan sawi hijau.",
            weight: 300,
            gallery: [
                {
                    id: 1,
                    url: "../../asset/img/products/mie-ayam.jpg",
                    isDefault: true,
                },
            ],
            variants: [
                {
                    id: 401,
                    name: "Biasa",
                    price: 10000,
                    sku: "SNJ-004-MIE",
                    stock: 30,
                    active: true,
                },
            ],
            inventory: [],
            history: [],
        },
    ];

    // ===============================================
    // BAGIAN 1: LOGIKA HALAMAN LIST PRODUK (INDEX)
    // ===============================================
    const tableBody = document.getElementById("tableBody");

    if (tableBody) {
        console.log("Halaman Index Terdeteksi");

        // --- 1. SETUP DATA INDEX ---
        // Duplikasi data agar cukup untuk pagination
        let duplicatedData = [];
        for (let i = 0; i < 4; i++) {
            duplicatedData = duplicatedData.concat(sourceData);
        }

        const products = duplicatedData.map((item, index) => {
            const totalStock = item.variants
                ? item.variants.reduce((acc, curr) => acc + curr.stock, 0)
                : 0;
            return {
                id: index + 1,
                original_id: item.id,
                name: item.name,
                sku: item.sku,
                category: item.categories[0],
                price: item.base_price,
                stock: totalStock,
                status: item.is_active ? "Aktif" : "Nonaktif",
                img: item.image.url,
            };
        });

        let state = {
            data: products,
            filteredData: products,
            currentPage: 1,
            itemsPerPage: 10,
        };

        // DOM Elements
        const searchInput = document.getElementById("searchInput");
        const btnPrev = document.getElementById("btnPrev");
        const btnNext = document.getElementById("btnNext");
        const pageInfo = document.getElementById("pageInfo");
        const gotoPageInput = document.getElementById("gotoPageInput"); // Input Halaman
        const btnGo = document.getElementById("btnGo"); // Tombol Go

        // Modal Elements
        const modal = document.getElementById("modalForm");
        const productForm = document.getElementById("productForm");
        const modalTitle = document.getElementById("modalTitle");
        const btnTambah = document.getElementById("btnTambah");
        const btnClose = document.getElementById("closeModal");
        const btnBatal = document.getElementById("btnBatal");

        // Form Inputs
        const inputId = document.getElementById("productId");
        const inputNama = document.getElementById("inputNama");
        const inputImage = document.getElementById("inputImage");
        const imagePreview = document.getElementById("imagePreview");
        const previewContainer =
            document.getElementById("imagePreviewContainer") ||
            document.getElementById("previewContainer");
        const inputKategori = document.getElementById("inputKategori");
        const inputHarga = document.getElementById("inputHarga");
        const inputStatus = document.getElementById("inputStatus");
        const statusLabel = document.getElementById("statusLabel");

        // --- 2. FUNGSI UPDATE CONTROLS (PAGINATION FIX) ---
        function updatePaginationControls() {
            const totalPages = Math.ceil(
                state.filteredData.length / state.itemsPerPage,
            );

            // Update Text Info
            if (pageInfo) {
                const startIndex =
                    (state.currentPage - 1) * state.itemsPerPage + 1;
                const endIndex = Math.min(
                    startIndex + state.itemsPerPage - 1,
                    state.filteredData.length,
                );
                if (state.filteredData.length === 0) {
                    pageInfo.textContent = "Showing 0 of 0 entries";
                } else {
                    pageInfo.textContent = `Showing ${startIndex} to ${endIndex} of ${state.filteredData.length} entries`;
                }
            }

            // Update Buttons State
            if (btnPrev) btnPrev.disabled = state.currentPage === 1;
            if (btnNext)
                btnNext.disabled =
                    state.currentPage === totalPages || totalPages === 0;

            // Update Go To Input
            if (gotoPageInput) {
                gotoPageInput.max = totalPages;
                gotoPageInput.value = state.currentPage;
            }
        }

        // --- 3. RENDER TABEL ---
        function renderTable() {
            const startIndex = (state.currentPage - 1) * state.itemsPerPage;
            const endIndex = startIndex + state.itemsPerPage;
            const pageData = state.filteredData.slice(startIndex, endIndex);

            tableBody.innerHTML = "";
            if (pageData.length === 0) {
                tableBody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding: 20px;">Tidak ada data ditemukan</td></tr>`;
                updatePaginationControls();
                return;
            }

            pageData.forEach((item) => {
                const tr = document.createElement("tr");
                let badgeClass =
                    item.status === "Nonaktif"
                        ? "badge-inactive"
                        : "badge-active";
                let dotClass =
                    item.status === "Nonaktif" ? "bg-gray" : "bg-green";

                tr.innerHTML = `
                    <td>
                        <div class="product-cell">
                            <img src="${item.img}" class="product-img" onerror="this.src='https://via.placeholder.com/56'">
                            <div class="product-info">
                                <h4>${item.name}</h4>
                            </div>
                        </div>
                    </td>
                    <td>${item.category}</td>
                    <td><span class="badge ${badgeClass}"><span class="dot ${dotClass}"></span> ${item.status}</span></td>
                    <td><div style="display:flex;align-items:center;gap:8px;"><span class="dot ${dotClass}"></span> <span style="font-weight:500;">${item.stock}</span></div></td>
                    <td>
                        <div class="action-buttons">
                            <button class="btn-outline" onclick="window.location.href='/dashboard/products/detail?id=${item.original_id}'">Detail</button>
                            <button class="btn-outline" onclick="openEdit(${item.id})">Edit</button>
                        </div>
                    </td>
                `;
                tableBody.appendChild(tr);
            });

            updatePaginationControls();
        }

        // --- 4. EVENT LISTENERS PAGINATION ---
        if (btnPrev) {
            btnPrev.addEventListener("click", () => {
                if (state.currentPage > 1) {
                    state.currentPage--;
                    renderTable();
                }
            });
        }
        if (btnNext) {
            btnNext.addEventListener("click", () => {
                const totalPages = Math.ceil(
                    state.filteredData.length / state.itemsPerPage,
                );
                if (state.currentPage < totalPages) {
                    state.currentPage++;
                    renderTable();
                }
            });
        }
        if (btnGo) {
            btnGo.addEventListener("click", () => {
                const page = parseInt(gotoPageInput.value);
                const totalPages = Math.ceil(
                    state.filteredData.length / state.itemsPerPage,
                );
                if (page >= 1 && page <= totalPages) {
                    state.currentPage = page;
                    renderTable();
                } else {
                    alert(`Halaman tidak valid. Masukkan 1 - ${totalPages}`);
                }
            });
        }
        if (searchInput) {
            searchInput.addEventListener("input", () => {
                const query = searchInput.value.toLowerCase();
                state.filteredData = state.data.filter((item) =>
                    item.name.toLowerCase().includes(query),
                );
                state.currentPage = 1;
                renderTable();
            });
        }

        // --- 5. PREVIEW IMAGE ---
        if (inputImage) {
            inputImage.addEventListener("change", function (event) {
                const file = event.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function (e) {
                        if (imagePreview) imagePreview.src = e.target.result;
                        if (previewContainer)
                            previewContainer.style.display = "block";
                    };
                    reader.readAsDataURL(file);
                }
            });
        }

        // --- 6. CRUD FUNCTIONS ---
        function resetForm() {
            if (productForm) productForm.reset();
            if (inputId) inputId.value = "";

            // Reset Preview
            if (inputImage) inputImage.value = "";
            if (imagePreview) imagePreview.src = "";
            if (previewContainer) previewContainer.style.display = "none";

            if (inputStatus) inputStatus.checked = true;
            if (statusLabel) statusLabel.textContent = "Aktif";
        }

        if (btnTambah) {
            btnTambah.addEventListener("click", () => {
                resetForm();
                if (modalTitle) modalTitle.textContent = "Tambah Produk";
                if (modal) modal.classList.add("open");
            });
        }

        window.openEdit = function (id) {
            const product = state.data.find((p) => p.id === id);
            if (!product) return;
            resetForm();
            if (modalTitle) modalTitle.textContent = "Edit Produk";

            if (inputId) inputId.value = product.id;
            if (inputNama) inputNama.value = product.name;
            if (inputKategori) inputKategori.value = product.category;
            if (inputHarga) inputHarga.value = product.price;
            if (inputStatus) inputStatus.checked = product.status === "Aktif";
            if (statusLabel) statusLabel.textContent = product.status;

            // Show Image
            if (
                product.img &&
                product.img !== "https://via.placeholder.com/56"
            ) {
                if (imagePreview) imagePreview.src = product.img;
                if (previewContainer) previewContainer.style.display = "block";
            }
            if (modal) modal.classList.add("open");
        };

        if (productForm) {
            productForm.addEventListener("submit", (e) => {
                e.preventDefault();
                const id = inputId.value;
                const isEdit = id !== "";
                const index = isEdit
                    ? state.data.findIndex((p) => p.id == id)
                    : -1;

                let finalImage = "https://via.placeholder.com/56";
                if (inputImage && inputImage.files && inputImage.files[0]) {
                    finalImage = URL.createObjectURL(inputImage.files[0]);
                } else if (isEdit && index !== -1) {
                    finalImage = state.data[index].img;
                }

                const formData = {
                    id: isEdit ? parseInt(id) : Date.now(),
                    name: inputNama.value,
                    category: inputKategori.value,
                    price: parseInt(inputHarga.value),
                    stock: isEdit && index !== -1 ? state.data[index].stock : 0,
                    status: inputStatus.checked ? "Aktif" : "Nonaktif",
                    img: finalImage,
                };

                if (isEdit && index !== -1) {
                    state.data[index] = { ...state.data[index], ...formData };
                } else {
                    state.data.unshift(formData);
                }

                if (modal) modal.classList.remove("open");
                renderTable();
            });
        }

        if (inputStatus)
            inputStatus.addEventListener("change", function () {
                statusLabel.textContent = this.checked ? "Aktif" : "Nonaktif";
            });
        const closeModalFunc = () => modal.classList.remove("open");
        if (btnClose) btnClose.addEventListener("click", closeModalFunc);
        if (btnBatal) btnBatal.addEventListener("click", closeModalFunc);

        // Run Table
        renderTable();
    }

    // ===============================================
    // BAGIAN 2: LOGIKA HALAMAN DETAIL (POPULASI DATA)
    // ===============================================
    const detailTitle = document.querySelector(".prod-title");

    if (detailTitle) {
        // A. AMBIL DATA DARI URL
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get("id");
        let currentProduct = sourceData.find((p) => p.id === productId);

        // Fallback jika ID tidak ada (Demo purpose)
        if (!currentProduct) {
            currentProduct = sourceData[0];
        }

        if (currentProduct) {
            // 1. HEADER (Hapus Harga & SKU, cuma nama & gambar)
            detailTitle.textContent = currentProduct.name;
            const mainImg = document.querySelector(".prod-main-img");
            if (mainImg) mainImg.src = currentProduct.image.url;

            // 2. TAB INFO
            const setTxt = (id, val) => {
                const el = document.getElementById(id);
                if (el) el.textContent = val;
            };

            setTxt("detailName", currentProduct.name);
            setTxt("detailCategory", currentProduct.categories.join(", "));
            setTxt("detailDesc", currentProduct.desc || "-");
            setTxt("detailWeight", (currentProduct.weight || 0) + " Gram");
            setTxt("detailDim", currentProduct.dimension || "-");

            // 3. TAB GAMBAR
            const galleryGrid = document.getElementById("galleryGrid");
            if (galleryGrid) {
                galleryGrid.innerHTML = "";
                const galleries = currentProduct.gallery || [
                    { id: 1, url: currentProduct.image.url, isDefault: true },
                ];
                galleries.forEach((img) => {
                    const card = document.createElement("div");
                    card.className = "img-card";
                    card.innerHTML = `
                        <div class="img-thumb-wrapper">
                            <img src="${img.url}" class="img-thumb" onerror="this.src='https://via.placeholder.com/300'">
                            ${img.isDefault ? '<span class="default-badge">Default</span>' : ""}
                            <button class="menu-trigger">⋮</button>
                        </div>`;
                    galleryGrid.appendChild(card);
                });
            }

            // 4. TAB VARIAN
            const variantTableBody =
                document.getElementById("variantTableBody");
            if (variantTableBody) {
                variantTableBody.innerHTML = "";
                const variants = currentProduct.variants || [];
                variants.forEach((v) => {
                    const tr = document.createElement("tr");
                    tr.innerHTML = `
                        <td><strong>${v.name}</strong></td>
                        <td>${formatRupiah(v.price)}</td>
                        <td style="color:var(--text-sub)">${v.sku}</td>
                        <td>${v.stock}</td>
                        <td><span class="badge badge-active">Aktif</span></td>
                        <td><button class="btn-icon">✎</button></td>
                    `;
                    variantTableBody.appendChild(tr);
                });
            }

            // 5. TAB STOK
            const stockTableBody = document.getElementById("stockTableBody");
            if (stockTableBody) {
                stockTableBody.innerHTML = "";
                const inventory = currentProduct.inventory || [];
                let totalStock = 0;
                inventory.forEach((inv) => {
                    totalStock += inv.qty;
                    const tr = document.createElement("tr");
                    tr.innerHTML = `
                        <td>${inv.loc}</td>
                        <td>${inv.variant}</td>
                        <td><strong>${inv.qty}</strong></td>
                        <td>${inv.rack}</td>
                        <td><span class="badge badge-active" style="font-size:11px;">Ready</span></td>
                    `;
                    stockTableBody.appendChild(tr);
                });
                setTxt("headerTotalStock", totalStock);
            }

            // 6. TAB HISTORI
            const historyTimeline = document.getElementById("historyTimeline");
            if (historyTimeline) {
                historyTimeline.innerHTML = "";
                const histories = currentProduct.history || [];
                histories.forEach((h) => {
                    const item = document.createElement("div");
                    item.className = "history-item";
                    let markerClass =
                        h.type === "in"
                            ? "in"
                            : h.type === "out"
                              ? "out"
                              : "edit";
                    item.innerHTML = `
                        <div class="history-marker ${markerClass}"></div>
                        <div class="history-content">
                            <h4>${h.title}</h4>
                            <p>${h.desc}</p>
                            <span class="history-date">${h.date} &bull; Oleh ${h.user}</span>
                        </div>
                    `;
                    historyTimeline.appendChild(item);
                });
            }
        }

        // --- Modal Variant Logic ---
        const modalVariant = document.getElementById("modalVariant");
        const variantForm = document.getElementById("variantForm");

        window.openVariantModal = function () {
            if (variantForm) variantForm.reset();
            if (modalVariant) modalVariant.classList.add("open");
        };
        window.closeVariantModal = function () {
            if (modalVariant) modalVariant.classList.remove("open");
        };

        // --- Gallery Upload (Simulasi) ---
        const inputGalleryUpload =
            document.getElementById("inputGalleryUpload");
        if (inputGalleryUpload) {
            inputGalleryUpload.addEventListener("change", function () {
                if (this.files && this.files[0]) {
                    alert("Gambar berhasil diupload (Simulasi)");
                }
            });
        }
    }
});
