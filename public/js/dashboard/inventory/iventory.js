document.addEventListener("DOMContentLoaded", () => {
    // --- 1. CONFIGURATION ---
    const API_URL = "/test-response/success/product/200-get-all-product.json";
    const ROWS_PER_PAGE = 5;

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

    // Selector Search yang Spesifik
    const tableSearchInput = document.querySelector(".search-small input");
    // Selector Tombol Filter
    const filterButtons = document.querySelectorAll(".tab-small");

    // --- DOM ELEMENTS (MODAL) ---
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
    const adjustNoteInput = document.getElementById("adjustNote");

    // Toggle buttons
    const toggleButtons = document.querySelectorAll(".btn-toggle");
    const adjustmentTypeHidden = document.getElementById("adjustmentType");

    const DEFAULT_IMAGE = "asset/img/products/no_image.jpg";

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
            const products = jsonResponse.result.data;

            // --- MAPPING DATA ---
            allProductsData = products.map((product) => {
                let imageUrl = product?.image?.url || DEFAULT_IMAGE;

                let displaySku = "-";
                if (product.variants && product.variants.length > 0) {
                    displaySku = product.variants[0].sku;
                }

                const stockVal =
                    product.total_stock !== undefined ? product.total_stock : 0;
                const minStockVal =
                    product.min_stock !== undefined ? product.min_stock : 0;

                return {
                    id: product.id,
                    name: product.name,
                    sku: displaySku,
                    image: imageUrl,
                    min_stock: minStockVal,
                    stock: stockVal,
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

        if (currentFilterType === "low") {
            tempData = tempData.filter(
                (item) => item.stock <= item.min_stock && item.stock > 0,
            );
        } else if (currentFilterType === "out") {
            tempData = tempData.filter((item) => item.stock === 0);
        }

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

    if (tableSearchInput) {
        tableSearchInput.addEventListener("keyup", (e) => {
            currentSearchQuery = e.target.value;
            applyGlobalFilters();
        });
    }

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

    // --- 6. PAGINATION RENDERER ---
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

            // --- BAGIAN YANG DIUPDATE ---
            // 1. SKU dihilangkan dari dalam <div class="product-info">
            // 2. Tombol Detail dihilangkan dari kolom terakhir
            row.innerHTML = `
                <td>
                    <div class="product-cell">
                        <img src="${item.image}" alt="${item.name}" class="product-img" onerror="this.onerror=null;this.src='asset/img/products/no_image.jpg';">
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
            modalImg.onerror = () =>
                (modalImg.src = "asset/img/products/no_image.jpg");
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
            closeModal();
        });
    }
});
