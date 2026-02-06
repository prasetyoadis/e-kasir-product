document.addEventListener("DOMContentLoaded", () => {
    // --- 1. CONFIGURATION ---
    // Mengarah ke file JSON variant yang baru
    const API_URL =
        "/test-response/success/product-variant/200-get-all-variant.json";
    const ROWS_PER_PAGE = 5;
    const DEFAULT_IMAGE = "asset/img/products/no_image.jpg";

    // --- STATE MANAGEMENT ---
    let allProductsData = [];
    let filteredData = [];
    let currentPage = 1;
    let currentFilterType = "all";
    let currentSearchQuery = "";

    // --- 2. DOM ELEMENTS (INVENTORY PAGE) ---
    const tableBody = document.getElementById("inventory-body");
    const totalProductsEl = document.getElementById("total-products");
    const lowStockCountEl = document.getElementById("low-stock-count");
    const outStockCountEl = document.getElementById("out-stock-count");
    const paginationInfoEl = document.getElementById("pagination-info");
    const btnPrev = document.getElementById("btn-prev");
    const btnNext = document.getElementById("btn-next");

    // Search & Filter Elements
    const tableSearchInput = document.querySelector(".search-small input");
    const filterButtons = document.querySelectorAll(".tab-small");

    // --- DOM ELEMENTS (MODAL ADJUSTMENT) ---
    const modalOverlay = document.getElementById("adjustModal");
    const closeModalBtn = document.getElementById("closeModalBtn");
    const cancelBtn = document.getElementById("cancelBtn");
    const saveBtn = document.getElementById("saveBtn");

    // Modal Inputs
    const modalImg = document.getElementById("modalProductImg");
    const modalName = document.getElementById("modalProductName");
    const modalSku = document.getElementById("modalProductSku");
    const modalCurrentStock = document.getElementById("modalCurrentStock");
    const modalProductIdHidden = document.getElementById("modalProductId");
    const adjustAmountInput = document.getElementById("adjustAmount");

    // Toggle buttons
    const toggleButtons = document.querySelectorAll(".btn-toggle");
    const adjustmentTypeHidden = document.getElementById("adjustmentType");

    // --- 3. HELPER FUNCTIONS ---
    function getStatus(stock, minStock) {
        if (stock === 0)
            return { label: "Habis", class: "badge-danger", dot: "dot-danger" };
        if (stock <= minStock)
            return { label: "Low", class: "badge-low", dot: "dot-warning" };
        return { label: "Aman", class: "badge-safe", dot: "dot-success" };
    }

    // --- 4. FETCH DATA ---
    fetch(API_URL)
        .then((response) => {
            if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
            return response.json();
        })
        .then((jsonResponse) => {
            // Mengakses data dari result.data sesuai struktur JSON baru
            const products = jsonResponse.result.data;

            // --- MAPPING DATA (Disesuaikan dengan JSON Varian) ---
            allProductsData = products.map((item) => {
                let imageUrl = item.image?.url || DEFAULT_IMAGE;

                return {
                    id: item.id,
                    name: item.name, // Nama sudah lengkap (cth: "Sego Njamoer Original Reguler")
                    sku: item.sku,
                    image: imageUrl,
                    min_stock: item.min_stock || 0,
                    stock: item.stock || 0,
                };
            });

            filteredData = [...allProductsData];
            updateStats(allProductsData);
            applyGlobalFilters();
        })
        .catch((error) => {
            console.error("Error Fetching Inventory:", error);
            if (tableBody)
                tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:red;">Error memuat data: ${error.message}</td></tr>`;
        });

    // --- 5. CORE LOGIC: FILTER & SEARCH ---
    function applyGlobalFilters() {
        let tempData = [...allProductsData];

        // Filter by Status Tab
        if (currentFilterType === "low") {
            tempData = tempData.filter(
                (item) => item.stock <= item.min_stock && item.stock > 0,
            );
        } else if (currentFilterType === "out") {
            tempData = tempData.filter((item) => item.stock === 0);
        }

        // Filter by Search
        if (currentSearchQuery) {
            const query = currentSearchQuery.toLowerCase();
            tempData = tempData.filter(
                (item) =>
                    item.name.toLowerCase().includes(query) ||
                    item.sku.toLowerCase().includes(query),
            );
        }

        filteredData = tempData;
        currentPage = 1;
        renderPagination(filteredData, tableBody, ROWS_PER_PAGE, currentPage);
    }

    // Event Listener Search
    if (tableSearchInput) {
        tableSearchInput.addEventListener("keyup", (e) => {
            currentSearchQuery = e.target.value;
            applyGlobalFilters();
        });
    }

    // Event Listener Filter Tabs
    filterButtons.forEach((btn) => {
        btn.addEventListener("click", (e) => {
            filterButtons.forEach((b) => b.classList.remove("active"));
            e.target.classList.add("active");

            const clickedText = e.target.textContent.trim().toLowerCase();

            if (clickedText.includes("low")) {
                currentFilterType = "low";
            } else if (
                clickedText.includes("out") ||
                clickedText.includes("habis")
            ) {
                currentFilterType = "out";
            } else {
                currentFilterType = "all";
            }
            applyGlobalFilters();
        });
    });

    // --- 6. PAGINATION RENDERER (SESUAI GAMBAR) ---
    function renderPagination(items, wrapper, rows_per_page, page) {
        if (!wrapper) return;
        wrapper.innerHTML = "";

        if (items.length === 0) {
            wrapper.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 20px;">Tidak ada produk ditemukan.</td></tr>`;
            if (paginationInfoEl)
                paginationInfoEl.innerText = "Showing 0 to 0 of 0 entries";
            if (btnPrev) btnPrev.disabled = true;
            if (btnNext) btnNext.disabled = true;
            return;
        }

        page--;
        let start = rows_per_page * page;
        let end = start + rows_per_page;
        let paginatedItems = items.slice(start, end);

        paginatedItems.forEach((item) => {
            const status = getStatus(item.stock, item.min_stock);

            const row = document.createElement("tr");

            // --- STRUKTUR KOLOM SESUAI GAMBAR ---
            // 1. Produk (Img + Name)
            // 2. SKU
            // 3. Stok (+ Status Dot)
            // 4. Min Stok
            // 5. Status Badge
            // 6. Action (Adjust Button Only)

            row.innerHTML = `
                <td>
                    <div class="product-cell">
                        <img src="${item.image}" alt="${item.name}" class="product-img" onerror="this.src='${DEFAULT_IMAGE}'">
                        <div class="product-info">
                            <div>${item.name}</div>
                        </div>
                    </div>
                </td>
                <td>${item.sku}</td>
                <td><strong>${item.stock}</strong> <span class="dot ${status.dot}"></span></td>
                <td>${item.min_stock}</td>
                <td><span class="badge ${status.class}">${status.label}</span></td>
                <td style="text-align: right;">
                    <button class="btn-adjust open-modal-btn" data-id="${item.id}">
                        <i class="fa-solid fa-arrow-up"></i> Adjust
                    </button>
                </td>
            `;
            wrapper.appendChild(row);
        });

        updatePaginationControls(items.length, start, end);
    }

    function updatePaginationControls(totalItems, start, end) {
        const displayEnd = end > totalItems ? totalItems : end;
        if (paginationInfoEl)
            paginationInfoEl.innerText = `Showing ${start + 1} to ${displayEnd} of ${totalItems} entries`;

        const totalPages = Math.ceil(totalItems / ROWS_PER_PAGE);
        if (btnPrev) btnPrev.disabled = currentPage === 1;
        if (btnNext) btnNext.disabled = currentPage === totalPages;
    }

    // Pagination Click Events
    if (btnPrev) {
        btnPrev.addEventListener("click", () => {
            if (currentPage > 1) {
                currentPage--;
                renderPagination(
                    filteredData,
                    tableBody,
                    ROWS_PER_PAGE,
                    currentPage,
                );
            }
        });
    }

    if (btnNext) {
        btnNext.addEventListener("click", () => {
            const totalPages = Math.ceil(filteredData.length / ROWS_PER_PAGE);
            if (currentPage < totalPages) {
                currentPage++;
                renderPagination(
                    filteredData,
                    tableBody,
                    ROWS_PER_PAGE,
                    currentPage,
                );
            }
        });
    }

    // Update Top Stats
    function updateStats(data) {
        if (totalProductsEl) totalProductsEl.innerText = data.length;
        if (lowStockCountEl)
            lowStockCountEl.innerText = data.filter(
                (i) => i.stock <= i.min_stock && i.stock > 0,
            ).length;
        if (outStockCountEl)
            outStockCountEl.innerText = data.filter(
                (i) => i.stock === 0,
            ).length;
    }

    // =========================================
    // --- 7. MODAL LOGIC (ADJUSTMENT) ---
    // =========================================

    if (tableBody) {
        tableBody.addEventListener("click", (e) => {
            const btn = e.target.closest(".open-modal-btn");
            if (btn) {
                const id = btn.dataset.id;
                const product = allProductsData.find((p) => p.id == id);
                if (product) openModal(product);
            }
        });
    }

    function openModal(product) {
        if (document.getElementById("adjustForm"))
            document.getElementById("adjustForm").reset();
        resetToggleButtons();

        if (modalImg) {
            modalImg.src = product.image;
            modalImg.onerror = () => (modalImg.src = DEFAULT_IMAGE);
        }
        if (modalName) modalName.textContent = product.name;
        if (modalSku) modalSku.textContent = product.sku;
        if (modalCurrentStock) modalCurrentStock.textContent = product.stock;
        if (modalProductIdHidden) modalProductIdHidden.value = product.id;

        if (modalOverlay) modalOverlay.classList.add("show");
    }

    function closeModal() {
        if (modalOverlay) modalOverlay.classList.remove("show");
    }

    if (closeModalBtn) closeModalBtn.addEventListener("click", closeModal);
    if (cancelBtn) cancelBtn.addEventListener("click", closeModal);

    if (modalOverlay) {
        modalOverlay.addEventListener("click", (e) => {
            if (e.target === modalOverlay) closeModal();
        });
    }

    // Logic Tombol Toggle (Tambah/Kurang)
    toggleButtons.forEach((btn) => {
        btn.addEventListener("click", (e) => {
            toggleButtons.forEach((b) => b.classList.remove("active"));
            e.currentTarget.classList.add("active");
            if (adjustmentTypeHidden)
                adjustmentTypeHidden.value =
                    e.currentTarget.getAttribute("data-type");
        });
    });

    function resetToggleButtons() {
        toggleButtons.forEach((b) => b.classList.remove("active"));
        const addBtn = document.querySelector('.btn-toggle[data-type="add"]');
        if (addBtn) addBtn.classList.add("active");
        if (adjustmentTypeHidden) adjustmentTypeHidden.value = "add";
    }

    // Handle Simpan Adjustment (Simulasi Alert)
    if (saveBtn) {
        saveBtn.addEventListener("click", () => {
            const productId = modalProductIdHidden.value;
            const type = adjustmentTypeHidden.value;
            const amount = adjustAmountInput.value;

            if (!amount || amount <= 0) {
                alert("Mohon masukkan jumlah yang valid.");
                return;
            }

            const actionText = type === "add" ? "menambah" : "mengurangi";
            alert(
                `Berhasil ${actionText} stok produk ID ${productId} sebanyak ${amount}.`,
            );

            // Di sini nanti bisa ditambahkan logic update data ke server
            closeModal();
        });
    }
});
