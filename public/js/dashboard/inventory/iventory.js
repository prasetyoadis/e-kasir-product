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
    const searchInputs = document.querySelectorAll('input[type="text"]');
    const filterButtons = document.querySelectorAll(".tab, .tab-small");

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
            allProductsData = products.map((product) => {
                let imageUrl = product?.image?.url;

                // kalau null / undefined / empty
                if (!imageUrl) {
                    imageUrl = DEFAULT_IMAGE;
                } else {
                    if (!imageUrl.startsWith("/")) imageUrl = "/" + imageUrl;
                }

                return {
                    id: product.id,
                    name: product.name,
                    sku: product.sku,
                    image: imageUrl,
                    min_stock: product.min_stock,
                    stock: product.current_stock,
                };
            });
            filteredData = [...allProductsData];
            updateStats(allProductsData);
            applyGlobalFilters();
        })
        .catch((error) => {
            console.error("Error:", error);
            tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:red;">Error: ${error.message}</td></tr>`;
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

    searchInputs.forEach((input) => {
        input.addEventListener("keyup", (e) => {
            currentSearchQuery = e.target.value;
            applyGlobalFilters();
        });
    });

    filterButtons.forEach((btn) => {
        btn.addEventListener("click", (e) => {
            filterButtons.forEach((b) => b.classList.remove("active"));
            const clickedText = e.target.textContent.trim().toLowerCase();
            if (clickedText.includes("low")) {
                currentFilterType = "low";
                highlightButtons("Low Stock");
            } else if (
                clickedText.includes("out") ||
                clickedText.includes("habis")
            ) {
                currentFilterType = "out";
                highlightButtons("Out of Stock");
            } else {
                currentFilterType = "all";
                highlightButtons("All");
            }
            applyGlobalFilters();
        });
    });

    function highlightButtons(textToMatch) {
        filterButtons.forEach((b) => {
            if (b.textContent.trim() === textToMatch) b.classList.add("active");
        });
    }

    // --- 7. PAGINATION RENDERER ---
    function renderPagination(items, wrapper, rows_per_page, page) {
        wrapper.innerHTML = "";
        if (items.length === 0) {
            wrapper.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 20px;">Tidak ada produk ditemukan.</td></tr>`;
            paginationInfoEl.innerText = "Showing 0 to 0 of 0 entries";
            btnPrev.disabled = true;
            btnNext.disabled = true;
            return;
        }
        page--;
        let start = rows_per_page * page;
        let end = start + rows_per_page;
        let paginatedItems = items.slice(start, end);

        paginatedItems.forEach((item) => {
            const status = getStatus(item.stock, item.min_stock);
            const imgPath = item.image
                ? item.image
                : "https://via.placeholder.com/40";

            const row = document.createElement("tr");
            row.innerHTML = `
                <td>
                    <div class="product-cell">
                        <img src="${imgPath}" alt="${item.name}" class="product-img" onerror="this.onerror=null;this.src='/asset/img/products/no_image.jpg';">
                        <div class="product-info">
                            <div>${item.name}</div>
                            <span>${item.sku}</span>
                        </div>
                    </div>
                </td>
                <td>${item.sku}</td>
                <td><strong>${item.stock}</strong> <span class="dot ${status.dot}"></span></td>
                <td>${item.min_stock}</td>
                <td><span class="badge ${status.class}">${status.label}</span></td>
                <td>
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
        paginationInfoEl.innerText = `Showing ${start + 1} to ${displayEnd} of ${totalItems} entries`;
        const totalPages = Math.ceil(totalItems / ROWS_PER_PAGE);
        btnPrev.disabled = currentPage === 1;
        btnNext.disabled = currentPage === totalPages;
    }

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

    function updateStats(data) {
        totalProductsEl.innerText = data.length;
        lowStockCountEl.innerText = data.filter(
            (i) => i.stock <= i.min_stock && i.stock > 0,
        ).length;
        outStockCountEl.innerText = data.filter((i) => i.stock === 0).length;
    }

    // =========================================
    // --- 8. MODAL LOGIC (FIX EVENT DELEGATION) ---
    // =========================================

    // PERBAIKAN UTAMA: Menggunakan Event Delegation pada Table Body
    // Ini menangkap klik dimanapun di dalam tabel, lalu cek apakah itu tombol adjust
    tableBody.addEventListener("click", (e) => {
        // Cek apakah yang diklik adalah tombol dengan class 'open-modal-btn' atau anak elemennya (icon)
        const btn = e.target.closest(".open-modal-btn");

        if (btn) {
            // Ambil ID dari tombol
            const id = btn.dataset.id;

            // Cari data produk asli berdasarkan ID
            // (Pakai == agar tidak masalah tipe string vs number)
            const product = allProductsData.find((p) => p.id == id);

            if (product) {
                openModal(product);
            } else {
                console.error("Produk tidak ditemukan untuk ID:", id);
            }
        }
    });

    function openModal(product) {
        document.getElementById("adjustForm").reset();
        resetToggleButtons();

        modalImg.src = product.image;
        modalImg.onerror = () =>
            (modalImg.src = "https://via.placeholder.com/40?text=No+Img");
        modalName.textContent = product.name;
        modalSku.textContent = product.sku;
        modalCurrentStock.textContent = product.stock;
        modalProductIdHidden.value = product.id;

        modalOverlay.classList.add("show");
    }

    function closeModal() {
        modalOverlay.classList.remove("show");
    }

    closeModalBtn.addEventListener("click", closeModal);
    cancelBtn.addEventListener("click", closeModal);
    modalOverlay.addEventListener("click", (e) => {
        if (e.target === modalOverlay) closeModal();
    });

    toggleButtons.forEach((btn) => {
        btn.addEventListener("click", (e) => {
            toggleButtons.forEach((b) => b.classList.remove("active"));
            e.currentTarget.classList.add("active");
            adjustmentTypeHidden.value =
                e.currentTarget.getAttribute("data-type");
        });
    });

    function resetToggleButtons() {
        toggleButtons.forEach((b) => b.classList.remove("active"));
        document
            .querySelector('.btn-toggle[data-type="add"]')
            .classList.add("active");
        adjustmentTypeHidden.value = "add";
    }

    saveBtn.addEventListener("click", () => {
        const productId = modalProductIdHidden.value;
        const type = adjustmentTypeHidden.value;
        const amount = adjustAmountInput.value;
        const note = adjustNoteInput.value;

        if (!amount || amount <= 0) {
            alert("Mohon masukkan jumlah yang valid.");
            return;
        }

        // Simulasi Alert
        const actionText = type === "add" ? "menambah" : "mengurangi";
        alert(
            `Berhasil ${actionText} stok produk ID ${productId} sebanyak ${amount}.`,
        );
        closeModal();
    });
});

// =========================================
// --- SIDEBAR LOGIC (GLOBAL) ---
// =========================================

// Fungsi untuk membuka/tutup sidebar
function toggleSidebar() {
    const sidebar = document.getElementById("sidebar");
    const overlay = document.querySelector(".sidebar-overlay");
    const closeBtn = document.querySelector(".close-sidebar-btn");

    if (sidebar && overlay) {
        sidebar.classList.toggle("active");
        overlay.classList.toggle("active");

        // Atur visibility tombol close khusus di mobile
        if (window.innerWidth <= 768 && closeBtn) {
            closeBtn.style.display = sidebar.classList.contains("active")
                ? "block"
                : "none";
        }
    }
}

// Event Listener untuk mereset sidebar saat layar dibesarkan (Resize)
window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
        const sidebar = document.getElementById("sidebar");
        const overlay = document.querySelector(".sidebar-overlay");

        if (sidebar) sidebar.classList.remove("active");
        if (overlay) overlay.classList.remove("active");
    }
});
