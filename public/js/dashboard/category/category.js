document.addEventListener("DOMContentLoaded", () => {
    // --- CONFIG ---
    const API_URL = "/test-response/success/product/200-get-all-product.json";
    const ROWS_PER_PAGE = 5;
    const DEFAULT_IMAGE = "asset/img/products/no_image.jpg";

    // --- STATE ---
    let allProducts = [];
    let categoriesSet = new Set(["Semua Menu"]);
    let currentFilter = "Semua Menu";
    let editingCategory = null; // Menyimpan nama kategori yang sedang diedit
    let currentPage = 1;

    // --- DOM ---
    const categoryListContainer = document.getElementById(
        "categoryListContainer",
    );
    const productTableBody = document.getElementById("productTableBody");
    const tableInfoText = document.getElementById("tableInfoText");
    const addCategoryBtn = document.getElementById("addCategoryBtn");
    const paginationInfo = document.getElementById("paginationInfo");
    const btnPrev = document.getElementById("btnPrev");
    const btnNext = document.getElementById("btnNext");

    // --- FETCH DATA ---
    fetch(API_URL)
        .then((res) => {
            if (!res.ok) throw new Error("Gagal ambil data");
            return res.json();
        })
        .then((json) => {
            const rawProducts = json.result.data;
            const flattened = [];

            rawProducts.forEach((product) => {
                let imageUrl = product?.image?.url;
                if (!imageUrl) {
                    imageUrl = DEFAULT_IMAGE;
                } else if (!imageUrl.startsWith("/")) {
                    imageUrl = "/" + imageUrl;
                }

                // Ambil kategori dari data
                if (Array.isArray(product.categories)) {
                    product.categories.forEach((c) => categoriesSet.add(c));
                }

                // Flatten Varian
                if (
                    product.is_variant === true &&
                    Array.isArray(product.variants)
                ) {
                    product.variants.forEach((variant) => {
                        flattened.push({
                            product_id: product.id,
                            variant_id: variant.id,
                            name: `${product.name} ${variant.variant_name}`,
                            sku: variant.sku || "N/A",
                            categories: product.categories || [],
                            image: imageUrl,
                        });
                    });
                } else if (product.variants && product.variants.length > 0) {
                    const variant = product.variants[0];
                    flattened.push({
                        product_id: product.id,
                        variant_id: variant.id,
                        name: product.name,
                        sku: variant.sku || "N/A",
                        categories: product.categories || [],
                        image: imageUrl,
                    });
                }
            });

            allProducts = flattened;
            renderCategories();
            renderTable("Semua Menu");
        })
        .catch((err) => {
            console.error(err);
            categoryListContainer.innerHTML = `<li class="cat-item" style="color:red">Error loading data</li>`;
        });

    // --- RENDER CATEGORY LIST ---
    function renderCategories() {
        categoryListContainer.innerHTML = "";

        categoriesSet.forEach((cat) => {
            const li = document.createElement("li");

            // MODE EDIT
            if (editingCategory === cat) {
                li.className = "cat-item editing";
                // Input Edit + Tombol Centang & Silang
                li.innerHTML = `
                    <input type="text" class="edit-input" value="${cat}" id="editInput-${cat}">
                    <div class="cat-actions">
                        <button class="btn-icon-square btn-check" onclick="saveCategory('${cat}')">
                            <i class="fa-solid fa-check"></i>
                        </button>
                        <button class="btn-icon-square" onclick="cancelEdit('${cat}')">
                            <i class="fa-solid fa-xmark"></i>
                        </button>
                    </div>
                `;
            }
            // MODE TAMPILAN BIASA
            else {
                li.className = `cat-item ${currentFilter === cat ? "active" : ""}`;

                // Struktur: Nama Kategori (kiri) + Tombol Aksi (kanan)
                li.innerHTML = `
                    <span class="cat-name">${cat}</span>
                    <div class="sidebar-actions">
                        ${
                            cat !== "Semua Menu"
                                ? `
                        <button class="btn-mini" onclick="startEdit('${cat}', event)">
                            <i class="fa-solid fa-pen"></i>
                        </button>
                        <button class="btn-mini delete" onclick="deleteCategory('${cat}', event)">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                        `
                                : ""
                        } 
                    </div>
                `;

                // Klik baris untuk filter tabel
                li.addEventListener("click", () => {
                    currentFilter = cat;
                    currentPage = 1;
                    renderCategories();
                    renderTable(cat);
                });
            }

            categoryListContainer.appendChild(li);
        });

        // Auto focus jika sedang edit
        if (editingCategory) {
            const input = document.getElementById(
                `editInput-${editingCategory}`,
            );
            if (input) input.focus();
        }
    }

    // --- RENDER TABLE ---
    function renderTable(filterCat) {
        productTableBody.innerHTML = "";

        let filtered = allProducts;
        if (filterCat !== "Semua Menu") {
            filtered = allProducts.filter((p) =>
                p.categories.includes(filterCat),
            );
        }

        const totalItems = filtered.length;
        const totalPages = Math.ceil(totalItems / ROWS_PER_PAGE);
        if (currentPage > totalPages && totalPages > 0)
            currentPage = totalPages;

        const start = (currentPage - 1) * ROWS_PER_PAGE;
        const end = start + ROWS_PER_PAGE;
        const items = filtered.slice(start, end);

        tableInfoText.innerText = `Menampilkan "${filterCat}" (${totalItems} item)`;

        if (totalItems === 0) {
            productTableBody.innerHTML = `<tr><td colspan="3" style="text-align:center; padding:20px; color:#999;">Tidak ada data produk di kategori ini</td></tr>`;
            updatePaginationUI(0, 0, 0, 1);
            return;
        }

        items.forEach((item) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>
                    <div class="product-cell">
                        <img src="${item.image}" class="product-img" onerror="this.src='${DEFAULT_IMAGE}'">
                        <strong>${item.name}</strong>
                    </div>
                </td>
                <td>${item.sku}</td>
                <td style="text-align:right">
                    <button
                        class="btn-adjust btn-redirect-edit"
                        data-product-id="${item.product_id}"
                        data-variant-id="${item.variant_id}"
                    >
                        <i class="fa-solid fa-pen-to-square"></i> Edit
                    </button>
                </td>
            `;
            productTableBody.appendChild(tr);
        });

        updatePaginationUI(
            totalItems,
            start + 1,
            Math.min(end, totalItems),
            totalPages,
        );
    }

    function updatePaginationUI(total, start, end, totalPages) {
        paginationInfo.innerText =
            total === 0
                ? "Showing 0 of 0"
                : `Showing ${start}-${end} of ${total}`;
        btnPrev.disabled = currentPage === 1;
        btnNext.disabled = currentPage === totalPages;
    }

    // --- PAGINATION EVENTS ---
    btnPrev.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            renderTable(currentFilter);
        }
    });

    btnNext.addEventListener("click", () => {
        currentPage++;
        renderTable(currentFilter);
    });

    // --- REDIRECT LOGIC ---
    productTableBody.addEventListener("click", (e) => {
        const btn = e.target.closest(".btn-redirect-edit");
        if (btn) {
            const productId = btn.dataset.productId;
            const variantId = btn.dataset.variantId;
            window.location.href = `/dashboard/products/detail?id=${productId}&tab=variant&variant_id=${variantId}`;
        }
    });

    // ============================================
    // --- CATEGORY ACTIONS (GLOBAL SCOPE) ---
    // ============================================

    // 1. Tambah Kategori Baru
    addCategoryBtn.addEventListener("click", () => {
        let baseName = "New Category";
        let name = baseName;
        let counter = 1;

        // Cek loop: Jika "New Category" sudah ada, cari "New Category 2", dst.
        while (categoriesSet.has(name)) {
            counter++;
            name = `${baseName} ${counter}`;
        }

        categoriesSet.add(name);
        editingCategory = name; // Langsung masuk mode edit
        renderCategories();
    });

    // 2. Mulai Edit (Rename)
    window.startEdit = (name, event) => {
        event.stopPropagation(); // Mencegah filter terpilih saat klik tombol edit
        editingCategory = name;
        renderCategories();
    };

    // 3. Simpan Perubahan (Centang)
    window.saveCategory = (oldName) => {
        const input = document.getElementById(`editInput-${oldName}`);
        if (!input) return;

        const newName = input.value.trim();

        // Jika nama valid
        if (newName) {
            // Hapus nama lama, tambah nama baru
            categoriesSet.delete(oldName);
            categoriesSet.add(newName);

            // Jika kategori yang diedit sedang aktif difilter, update filter juga
            if (currentFilter === oldName) {
                currentFilter = newName;
            }
        } else {
            // Jika kosong, anggap cancel (atau bisa alert validation)
            if (oldName.includes("New Category")) {
                categoriesSet.delete(oldName);
            }
        }

        editingCategory = null;
        renderCategories();
        renderTable(currentFilter); // Refresh tabel barangkali nama kategori berubah
    };

    // 4. Batal Edit (Silang)
    window.cancelEdit = (catName) => {
        // FIX: Jika kategori adalah "New Category..." (baru dibuat tapi dicancel), HAPUS!
        if (catName.includes("New Category")) {
            categoriesSet.delete(catName);
        }

        editingCategory = null;
        renderCategories();
    };

    // 5. Hapus Kategori
    window.deleteCategory = (name, event) => {
        event.stopPropagation(); // Mencegah filter
        if (confirm(`Hapus kategori "${name}"?`)) {
            categoriesSet.delete(name);

            // Jika yang dihapus adalah kategori yang sedang dilihat, kembali ke Semua Menu
            if (currentFilter === name) {
                currentFilter = "Semua Menu";
            }

            renderCategories();
            renderTable(currentFilter);
        }
    };
});
