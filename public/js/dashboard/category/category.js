document.addEventListener("DOMContentLoaded", () => {
    // --- CONFIG ---
    const API_URL = "/test-response/success/product/200-get-all-product.json";
    const ROWS_PER_PAGE = 5;
    const DEFAULT_IMAGE = "asset/img/products/no_image.jpg";

    // --- STATE ---
    let allProducts = []; // ISI VARIANT (flattened)
    let categoriesSet = new Set(["Semua Menu"]);
    let currentFilter = "Semua Menu";
    let editingCategory = null;
    let currentPage = 1;

    // --- DOM ---
    const categoryListContainer = document.getElementById("categoryListContainer");
    const productTableBody = document.getElementById("productTableBody");
    const tableInfoText = document.getElementById("tableInfoText");
    const addCategoryBtn = document.getElementById("addCategoryBtn");
    const paginationInfo = document.getElementById("paginationInfo");
    const btnPrev = document.getElementById("btnPrev");
    const btnNext = document.getElementById("btnNext");

    // --- FETCH & FLATTEN ---
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

                // kategori tetap dari product
                if (Array.isArray(product.categories)) {
                    product.categories.forEach((c) => categoriesSet.add(c));
                }

                if (!Array.isArray(product.variants) || product.variants.length === 0) {
                    return;
                }

                if (product.is_variant === true) {
                    product.variants.forEach((variant) => {
                        flattened.push({
                            product_id: product.id,
                            variant_id: variant.id,
                            name: `${product.name} ${variant.variant_name}`,
                            sku: variant.sku || "N/A",
                            categories: product.categories || [],
                            image: imageUrl,
                            is_active: product.is_active
                        });
                    });
                } else {
                    const variant = product.variants[0];
                    flattened.push({
                        product_id: product.id,
                        variant_id: variant.id,
                        name: product.name,
                        sku: variant.sku || "N/A",
                        categories: product.categories || [],
                        image: imageUrl,
                        is_active: product.is_active
                    });
                }
            });

            allProducts = flattened;
            renderCategories();
            renderTable("Semua Menu");
        })
        .catch((err) => {
            console.error(err);
            categoryListContainer.innerHTML =
                `<li class="cat-item" style="color:red">Error loading data</li>`;
        });

    // --- RENDER CATEGORY ---
    function renderCategories() {
        categoryListContainer.innerHTML = "";
        categoriesSet.forEach((cat) => {
            const li = document.createElement("li");

            if (editingCategory === cat) {
                li.className = "cat-item editing";
                li.innerHTML = `
                    <input type="text" class="edit-input" value="${cat}" id="editInput-${cat}">
                    <div class="cat-actions">
                        <button onclick="saveCategory('${cat}')">✔</button>
                        <button onclick="cancelEdit()">✖</button>
                    </div>
                `;
            } else {
                li.className = `cat-item ${currentFilter === cat ? "active" : ""}`;
                li.innerHTML = `<span>${cat}</span>`;
                li.addEventListener("click", () => {
                    currentFilter = cat;
                    currentPage = 1;
                    renderCategories();
                    renderTable(cat);
                });
            }

            categoryListContainer.appendChild(li);
        });
    }

    // --- RENDER TABLE (PER VARIANT) ---
    function renderTable(filterCat) {
        productTableBody.innerHTML = "";

        let filtered = allProducts;
        if (filterCat !== "Semua Menu") {
            filtered = allProducts.filter((p) =>
                p.categories.includes(filterCat)
            );
        }

        const totalItems = filtered.length;
        const totalPages = Math.ceil(totalItems / ROWS_PER_PAGE);
        if (currentPage > totalPages && totalPages > 0) currentPage = totalPages;

        const start = (currentPage - 1) * ROWS_PER_PAGE;
        const end = start + ROWS_PER_PAGE;
        const items = filtered.slice(start, end);

        tableInfoText.innerText =
            `Menampilkan "${filterCat}" (${totalItems} item)`;

        if (totalItems === 0) {
            productTableBody.innerHTML =
                `<tr><td colspan="3" style="text-align:center">Tidak ada data</td></tr>`;
            updatePaginationUI(0, 0, 0, 1);
            return;
        }

        items.forEach((item) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>
                    <div class="product-cell">
                        <img src="${item.image}" class="product-img">
                        <strong>${item.name}</strong>
                    </div>
                </td>
                <td>${item.sku}</td>
                <td style="text-align:right">
                    <button
                        class="btn-redirect-edit"
                        data-product-id="${item.product_id}"
                        data-variant-id="${item.variant_id}"
                    >
                        Edit
                    </button>
                </td>
            `;
            productTableBody.appendChild(tr);
        });

        updatePaginationUI(
            totalItems,
            start + 1,
            Math.min(end, totalItems),
            totalPages
        );
    }

    function updatePaginationUI(total, start, end, totalPages) {
        paginationInfo.innerText =
            total === 0 ? "Showing 0 of 0" : `Showing ${start}-${end} of ${total}`;
        btnPrev.disabled = currentPage === 1;
        btnNext.disabled = currentPage === totalPages;
    }

    // --- PAGINATION ---
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

    // --- EDIT REDIRECT (PER VARIANT) ---
    productTableBody.addEventListener("click", (e) => {
        const btn = e.target.closest(".btn-redirect-edit");
        if (!btn) return;

        const productId = btn.dataset.productId;
        const variantId = btn.dataset.variantId;

        window.location.href =
            `/dashboard/products/detail?id=${productId}&tab=varian&variant_id=${variantId}`;
    });

    // --- CATEGORY ACTIONS ---
    window.cancelEdit = () => {
        editingCategory = null;
        renderCategories();
    };

    window.saveCategory = (oldName) => {
        const input = document.getElementById(`editInput-${oldName}`);
        if (!input) return;
        const newName = input.value.trim();
        if (newName && newName !== oldName) {
            categoriesSet.delete(oldName);
            categoriesSet.add(newName);
        }
        editingCategory = null;
        renderCategories();
    };

    addCategoryBtn.addEventListener("click", () => {
        const name = `New Category ${categoriesSet.size}`;
        categoriesSet.add(name);
        editingCategory = name;
        renderCategories();
    });
});
