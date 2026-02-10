document.addEventListener("DOMContentLoaded", () => {
    // =====================================
    // 1. CONFIGURATION
    // =====================================
    const API_URL = "http://192.168.43.6:8002/api/variants"; // ⬅️ FIX: real API
    const INVENTORY_SUMMARY_API = "http://192.168.43.6:8002/api/inventories/summary";
    const TOKEN = localStorage.getItem("token");

    const DEFAULT_IMAGE = "/asset/img/products/no_image.jpg";


    // ================= STATE =================
    let allProductsData = [];
    let filteredData = [];
    let currentPage = 1;
    let currentFilterType = "all";
    let currentSearchQuery = "";

    let pagination = null; // ⬅️ ONLY FROM API META
    let low_stock = null;      // null = param dihilangkan
    let out_of_stock = null;  // null = param dihilangkan

    // 
    // ============= DOM ELEMENTS ==============
    // 
    const tableBody = document.getElementById("inventory-body");
    const totalProductsEl = document.getElementById("total-products");
    const lowStockCountEl = document.getElementById("low-stock-count");
    const outStockCountEl = document.getElementById("out-stock-count");
    const todayInCountEl = document.getElementById("in-today");
    const todayOutCountEl = document.getElementById("out-today");
    const paginationInfoEl = document.getElementById("pagination-info");
    const btnPrev = document.getElementById("btn-prev");
    const btnNext = document.getElementById("btn-next");

    const tableSearchInput = document.querySelector(".search-small input");
    const filterButtons = document.querySelectorAll(".tab-small");

    // =====================================
    // MODAL ELEMENTS (JANGAN DIHAPUS)
    // =====================================
    const modalOverlay = document.getElementById("adjustModal");
    const closeModalBtn = document.getElementById("closeModalBtn");
    const cancelBtn = document.getElementById("cancelBtn");
    const saveBtn = document.getElementById("saveBtn");

    const modalImg = document.getElementById("modalProductImg");
    const modalName = document.getElementById("modalProductName");
    const modalSku = document.getElementById("modalProductSku");
    const modalCurrentStock = document.getElementById("modalCurrentStock");
    const modalProductIdHidden = document.getElementById("modalProductId");
    const adjustAmountInput = document.getElementById("adjustAmount");

    const toggleButtons = document.querySelectorAll(".btn-toggle");
    const adjustmentTypeHidden = document.getElementById("adjustmentType");

    // ================= HELPERS =================
    const authHeader = () => ({
        "Authorization": `bearer ${TOKEN}`,
        "Content-Type": "application/json",
    });

    function getStatus(stock, minStock) {
        if (stock === 0)
            return { label: "Habis", class: "badge-danger", dot: "dot-danger" };
        if (stock <= minStock)
            return { label: "Low", class: "badge-low", dot: "dot-warning" };
        return { label: "Aman", class: "badge-safe", dot: "dot-success" };
    }

    // =====================================
    // FETCH API (REAL)
    // =====================================
    async function fetchVariants(page = 1) {
        if (!TOKEN) {
            console.error("Token tidak ditemukan di localStorage");
            return;
        }
            const params = new URLSearchParams();
            if (low_stock !== null) params.append("low_stock", low_stock);
            if (out_of_stock !== null) params.append("out_of_stock", out_of_stock);
            if (currentSearchQuery) params.append("search", currentSearchQuery);
            params.append("page", page);
            
            try {
                const res = await fetch(`${API_URL}?${params.toString()}`, {
                headers: authHeader(),
            });

            if (!res.ok) {
                throw new Error(`HTTP ${res.status}`);
            }

            const json = await res.json();

            // ⛔ jangan ngarang struktur
            const variants = json?.result?.data || [];
            // ⬅️ pagination FULLY from backend
            pagination = json.result.meta;
            
            allProductsData = variants.map((item) => {
                return {
                    id: item.id,
                    name: item.name || item.variant_name || "-",
                    sku: item.sku || "-",
                    image: item.image?.url || DEFAULT_IMAGE,
                    stock: item.stock ?? item.current_stock ?? 0,
                    min_stock: item.min_stock ?? 0,
                };
            });

            filteredData = [...allProductsData];
            applyGlobalFilters();
        } catch (err) {
            console.error("Error Fetching Variants:", err);
            if (tableBody) {
                tableBody.innerHTML = `
                    <tr>
                        <td colspan="6" style="text-align:center; color:red;">
                            Gagal memuat data inventory
                        </td>
                    </tr>
                `;
            }
        }
    }

    /*
     * 
     * FETCH INVENTORY SUMMARY
     */
    async function fetchInventorySummary() {
        if (!TOKEN) return;

        try {
            const res = await fetch(INVENTORY_SUMMARY_API, {
                headers: authHeader(),
            });

            if (!res.ok) {
                throw new Error(`HTTP ${res.status}`);
            }

            const json = await res.json();

            const summary = json?.result?.data;
            if (!summary) return;

            updateInventorySummary(summary);
        } catch (err) {
            console.error("Error Fetching Inventory Summary:", err);
        }
    }

    fetchVariants();
    fetchInventorySummary();

    // =====================================
    // FILTER + SEARCH
    // =====================================
    function applyGlobalFilters() {
        let tempData = [...allProductsData];

        if (currentFilterType === "low") {
            tempData = tempData.filter(
                (i) => i.stock <= i.min_stock && i.stock > 0,
            );
        } else if (currentFilterType === "out") {
            tempData = tempData.filter((i) => i.stock === 0);
        }

        filteredData = tempData;

        renderTable(filteredData, tableBody);
    }

    let searchTimeout = null;

    if (tableSearchInput) {
        tableSearchInput.addEventListener("keyup", (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                currentSearchQuery = e.target.value.trim();
                currentPage = 1;
                fetchVariants(1);
            }, 300);
        });
    }

    filterButtons.forEach((btn) => {
        btn.addEventListener("click", (e) => {
            filterButtons.forEach((b) => b.classList.remove("active"));
            e.target.classList.add("active");

            const text = e.target.textContent.toLowerCase();

            // reset dulu
            low_stock = null;
            out_of_stock = null;
            currentPage = 1;

            if (text.includes("low")) {
                currentFilterType = "low";
                low_stock = 1;
            } else if (text.includes("habis") || text.includes("out")) {
                currentFilterType = "out";
                out_of_stock = 1;
            } else {
                currentFilterType = "all";
                // ALL = gak kirim param apa pun
            }

            fetchVariants(1); // ⬅️ server-side filter
        });
    });


    // =====================================
    // PAGINATION (TETAP, SERVER-SIDE)
    // =====================================
    function renderTable(items, wrapper) {
        if (!wrapper) return;
        wrapper.innerHTML = "";

        if (!items.length) {
            wrapper.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align:center;">
                        Tidak ada data
                    </td>
                </tr>
            `;
            updatePaginationUI();
            return;
        }

        // ⛔ TIDAK ADA slice()
        // karena server sudah handle paging (?page=)

        items.forEach((item) => {
            const status = getStatus(item.stock, item.min_stock);

            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>
                    <div class="product-cell">
                        <img src="${item.image}" class="product-img"
                            onerror="this.src='${DEFAULT_IMAGE}'">
                        <div class="product-info">
                            <div>${item.name}</div>
                        </div>
                    </div>
                </td>
                <td>${item.sku}</td>
                <td><strong>${item.stock}</strong> <span class="dot ${status.dot}"></span></td>
                <td>${item.min_stock}</td>
                <td><span class="badge ${status.class}">${status.label}</span></td>
                <td style="text-align:right;">
                    <button class="btn-adjust open-modal-btn" data-id="${item.id}">
                        Adjust
                    </button>
                </td>
            `;
            wrapper.appendChild(tr);
        });

        updatePaginationUI(); // ⬅️ pakai meta API
    }


    // ================= PAGINATION UI =================
    function updatePaginationUI() {
        if (!pagination) return;

        const start =
            pagination.total === 0
                ? 0
                : (pagination.current_page - 1) * pagination.per_page + 1;

        const end = Math.min(
            pagination.current_page * pagination.per_page,
            pagination.total
        );

        paginationInfoEl.innerText =
            `Showing ${start}-${end} of ${pagination.total}`;

        btnPrev.disabled = pagination.current_page === 1;
        btnNext.disabled = pagination.current_page === pagination.last_page;
    }

    btnPrev.addEventListener("click", () => {
        if (!pagination || pagination.current_page === 1) return;
        fetchVariants(pagination.current_page - 1);
    });

    btnNext.addEventListener("click", () => {
        if (!pagination || pagination.current_page === pagination.last_page) return;
        fetchVariants(pagination.current_page + 1);
    });

    function updateInventorySummary(summary) {
        if (totalProductsEl)
            totalProductsEl.innerText = summary.total_products ?? 0;

        if (lowStockCountEl)
            lowStockCountEl.innerText = summary.low_stock ?? 0;

        if (outStockCountEl)
            outStockCountEl.innerText = summary.out_of_stock ?? 0;

        if (todayInCountEl)
            todayInCountEl.innerText = `+ ${summary.restock_today ?? 0}`;

        if (todayOutCountEl)
            todayOutCountEl.innerText = `- ${summary.reduce_today ?? 0}`;
    }

    // =====================================
    // MODAL LOGIC (AMAN – TIDAK DIUBAH)
    // =====================================
    if (tableBody) {
        tableBody.addEventListener("click", (e) => {
            const btn = e.target.closest(".open-modal-btn");
            if (!btn) return;

            const product = allProductsData.find((p) => p.id == btn.dataset.id);
            if (product) openModal(product);
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
        resetToggleButtons()
    }

    if (closeModalBtn) closeModalBtn.addEventListener("click", closeModal);
    if (cancelBtn) cancelBtn.addEventListener("click", closeModal);

    if (modalOverlay) {
        modalOverlay.addEventListener("click", (e) => {
            if (e.target === modalOverlay) closeModal();
        });
    }
    function updateAmountLabel(type) {
        const amountLabel = document.querySelector('label[for="adjustAmount"]');
        if (!amountLabel) return;

        if (type === "correction") {
            amountLabel.textContent = "Jumlah Sebenarnya";
            adjustAmountInput.placeholder = "Contoh: 25";
        } else {
            amountLabel.textContent = "Jumlah";
            adjustAmountInput.placeholder = "Contoh: 10";
        }
    }

    // Logic Tombol Toggle (Tambah/Kurang)
    toggleButtons.forEach((btn) => {
        btn.addEventListener("click", (e) => {
            toggleButtons.forEach((b) => b.classList.remove("active"));
            e.currentTarget.classList.add("active");

            const type = e.currentTarget.getAttribute("data-type");
            if (adjustmentTypeHidden) adjustmentTypeHidden.value = type;

            // 🔥 tambahan
            updateAmountLabel(type);
        });
    });

    function resetToggleButtons() {
        toggleButtons.forEach((b) => b.classList.remove("active"));

        const addBtn = document.querySelector('.btn-toggle[data-type="in"]');
        if (addBtn) addBtn.classList.add("active");

        if (adjustmentTypeHidden) adjustmentTypeHidden.value = "in";

        // 🔥 default label
        updateAmountLabel("in");
    }

    // Handle Simpan Adjustment (Simulasi Alert)
    if (saveBtn) {
        saveBtn.addEventListener("click", async () => {
            const variantId = modalProductIdHidden.value;
            const type = adjustmentTypeHidden.value;
            const amount = Number(adjustAmountInput.value);
            const note = adjustNote.value;

            if (!amount || amount <= 0) {
                console.log("Jumlah tidak valid");
                return;
            }

            let endpoint = `${API_URL}/${variantId}/stock`;
            let payload = {
                type: type,
                note: note,
            };

            if (type === "correction") {
                endpoint += "/adjust";
                payload.actual_stock = amount;
            } else {
                payload.quantity = amount;
            }

            try {
                const res = await fetch(endpoint, {
                    method: "PATCH",
                    headers: authHeader(),
                    body: JSON.stringify(payload),
                });

                const json = await res.json();

                // GeneralResponse handler
                if (json.statusCode !== 200) {
                    console.log(json.result?.errorMessage || "Gagal update stok");
                    return;
                }

                // success
                closeModal();

                // 🔥 WAJIB re-fetch
                await fetchVariants(pagination?.current_page || 1);
                await fetchInventorySummary();

            } catch (err) {
                console.log("Terjadi kesalahan jaringan");
                console.error(err);
            }
        });
    }
});
