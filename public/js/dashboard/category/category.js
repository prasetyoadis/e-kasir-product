document.addEventListener("DOMContentLoaded", () => {
    // --- CONFIGURATION ---
    const API_URL = "/test-response/success/product/200-get-all-product.json";
    const ROWS_PER_PAGE = 5;

    // --- STATE ---
    let allProducts = [];
    let categoriesSet = new Set(["Semua Menu"]);
    let currentFilter = "Semua Menu";
    let editingCategory = null;
    let currentPage = 1;

    // --- DOM ELEMENTS (PAGE) ---
    const categoryListContainer = document.getElementById(
        "categoryListContainer",
    );
    const productTableBody = document.getElementById("productTableBody");
    const tableInfoText = document.getElementById("tableInfoText");
    const addCategoryBtn = document.getElementById("addCategoryBtn");
    const paginationInfo = document.getElementById("paginationInfo");
    const btnPrev = document.getElementById("btnPrev");
    const btnNext = document.getElementById("btnNext");

    // --- DOM ELEMENTS (MODAL ADJUSTMENT) ---
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
    const adjustNoteInput = document.getElementById("adjustNote");
    const toggleButtons = document.querySelectorAll(".btn-toggle");
    const adjustmentTypeHidden = document.getElementById("adjustmentType");

    const DEFAULT_IMAGE = "asset/img/products/no_image.jpg";

    // --- 1. FETCH DATA ---
    fetch(API_URL)
        .then((response) => {
            if (!response.ok) throw new Error("Gagal mengambil data");
            return response.json();
        })
        .then((json) => {
            const rawProducts = json.result.data;
            // Inject Random Stock untuk demo
            allProducts = rawProducts.map((product) => {
                let imageUrl = product?.image?.url;

                // kalau null / undefined / empty
                if (!imageUrl) {
                    imageUrl = DEFAULT_IMAGE;
                } else {
                    if (!imageUrl.startsWith("/")) imageUrl = "/" + imageUrl;
                }

                return {
                    ...product,
                    image: imageUrl,
                    min_stock: product.min_stock,
                    stock: product.current_stock,
                };
            });

            allProducts.forEach((product) => {
                if (product.categories && Array.isArray(product.categories)) {
                    product.categories.forEach((cat) => categoriesSet.add(cat));
                }
            });

            renderCategories();
            renderTable("Semua Menu");
        })
        .catch((err) => {
            console.error(err);
            categoryListContainer.innerHTML = `<li class="cat-item" style="color:red">Error loading data.</li>`;
        });

    // --- 2. RENDER CATEGORIES ---
    function renderCategories() {
        categoryListContainer.innerHTML = "";
        categoriesSet.forEach((catName) => {
            const li = document.createElement("li");
            if (editingCategory === catName) {
                li.className = "cat-item editing";
                li.innerHTML = `
                    <input type="text" class="edit-input" value="${catName}" id="editInput-${catName}">
                    <div class="cat-actions">
                        <button class="btn-icon-square btn-check" onclick="saveCategory('${catName}')"><i class="fa-solid fa-check"></i></button>
                        <button class="btn-icon-square btn-cancel" onclick="cancelEdit()"><i class="fa-solid fa-xmark"></i></button>
                        <button class="btn-icon-square" style="border-color:#e6e4dc; color:#c2433d" onclick="deleteCategory('${catName}')"><i class="fa-regular fa-trash-can"></i></button>
                    </div>
                `;
            } else {
                li.className = `cat-item ${currentFilter === catName ? "active" : ""}`;
                let actionHtml =
                    catName !== "Semua Menu"
                        ? `
                    <div class="cat-actions">
                        <button class="icon-btn" onclick="startEdit('${catName}')"><i class="fa-regular fa-pen-to-square"></i></button>
                        <button class="icon-btn delete" onclick="deleteCategory('${catName}')"><i class="fa-regular fa-trash-can"></i></button>
                    </div>`
                        : "";
                li.innerHTML = `<span class="cat-name">${catName}</span>${actionHtml}`;
                li.addEventListener("click", (e) => {
                    if (
                        !e.target.closest("button") &&
                        !e.target.closest("input")
                    ) {
                        currentFilter = catName;
                        currentPage = 1;
                        renderCategories();
                        renderTable(catName);
                    }
                });
            }
            categoryListContainer.appendChild(li);
        });
    }

    // --- 3. RENDER TABLE ---
    function renderTable(filterCat) {
        productTableBody.innerHTML = "";
        let filteredProducts = allProducts;
        if (filterCat !== "Semua Menu") {
            filteredProducts = allProducts.filter((p) =>
                p.categories.includes(filterCat),
            );
        }

        const totalItems = filteredProducts.length;
        const totalPages = Math.ceil(totalItems / ROWS_PER_PAGE);
        if (currentPage > totalPages && totalPages > 0)
            currentPage = totalPages;
        if (totalPages === 0) currentPage = 1;

        const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
        const endIndex = startIndex + ROWS_PER_PAGE;
        const paginatedItems = filteredProducts.slice(startIndex, endIndex);

        tableInfoText.innerText = `Menampilkan kategori: "${filterCat}" (${totalItems} produk)`;

        if (totalItems === 0) {
            productTableBody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:20px;">Tidak ada produk di kategori ini.</td></tr>`;
            updatePaginationUI(0, 0, 0, 1);
            return;
        }

        paginatedItems.forEach((item) => {
            // Kita tidak perlu logic status badge lagi karena kolomnya dihapus
            // Tapi kita tetap simpan logic Image URL
            let imgUrl = item.image;
            // Note: Pastikan logic image url handler kamu disini (sesuai kode terakhir)

            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>
                    <div class="product-cell">
                        <img src="${imgUrl}" class="product-img" onerror="this.src='https://via.placeholder.com/40'">
                        <div class="product-info">
                            <div style="font-weight:600">${item.name}</div>
                            <span style="font-size:0.8rem; color:#8b7e66">${item.sku}</span>
                        </div>
                    </div>
                </td>
                
                <td style="text-align: right;">
                    <button class="btn-adjust open-modal-btn" data-id="${item.id}">
                        <i class="fa-solid fa-arrow-up"></i> Adjust
                    </button>
                </td>
            `;
            productTableBody.appendChild(tr);
        });

        updatePaginationUI(
            totalItems,
            startIndex + 1,
            Math.min(endIndex, totalItems),
            totalPages,
        );
    }

    function updatePaginationUI(total, start, end, totalPages) {
        if (total === 0) {
            paginationInfo.innerText = "Showing 0 of 0";
            btnPrev.disabled = true;
            btnNext.disabled = true;
            return;
        }
        paginationInfo.innerText = `Showing ${start}-${end} of ${total}`;
        btnPrev.disabled = currentPage === 1;
        btnNext.disabled = currentPage === totalPages;
    }

    // --- PAGINATION LISTENERS ---
    btnPrev.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            renderTable(currentFilter);
        }
    });
    btnNext.addEventListener("click", () => {
        let filteredCount =
            currentFilter === "Semua Menu"
                ? allProducts.length
                : allProducts.filter((p) =>
                      p.categories.includes(currentFilter),
                  ).length;
        const totalPages = Math.ceil(filteredCount / ROWS_PER_PAGE);
        if (currentPage < totalPages) {
            currentPage++;
            renderTable(currentFilter);
        }
    });

    // --- GLOBAL ACTION FUNCTIONS ---
    window.startEdit = (catName) => {
        editingCategory = catName;
        renderCategories();
        setTimeout(() => {
            const input = document.getElementById(`editInput-${catName}`);
            if (input) input.focus();
        }, 50);
    };
    window.cancelEdit = () => {
        editingCategory = null;
        renderCategories();
    };
    window.saveCategory = (oldName) => {
        const input = document.getElementById(`editInput-${oldName}`);
        const newName = input.value.trim();
        if (newName && newName !== oldName) {
            categoriesSet.delete(oldName);
            categoriesSet.add(newName);
        }
        editingCategory = null;
        renderCategories();
    };
    window.deleteCategory = (catName) => {
        if (confirm(`Hapus kategori "${catName}"?`)) {
            categoriesSet.delete(catName);
            if (currentFilter === catName) {
                currentFilter = "Semua Menu";
                renderTable("Semua Menu");
            }
            renderCategories();
        }
    };
    addCategoryBtn.addEventListener("click", () => {
        const newCatName = "New Category " + categoriesSet.size;
        categoriesSet.add(newCatName);
        editingCategory = newCatName;
        renderCategories();
        const list = document.querySelector(".category-sidebar");
        list.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    // ================= MODAL LOGIC (ADJUSTMENT) =================

    // Event Delegation untuk tombol Adjust di tabel
    productTableBody.addEventListener("click", (e) => {
        const btn = e.target.closest(".open-modal-btn");
        if (btn) {
            const id = btn.dataset.id;
            // Cari produk di array allProducts (karena sudah ada stok random disana)
            const product = allProducts.find((p) => p.id == id);
            if (product) openModal(product);
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
        const amount = adjustAmountInput.value;
        if (!amount || amount <= 0) {
            alert("Mohon masukkan jumlah yang valid.");
            return;
        }
        const type = adjustmentTypeHidden.value;
        alert(
            `Simulasi: Berhasil ${type === "add" ? "menambah" : "mengurangi"} stok sebanyak ${amount}.`,
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
