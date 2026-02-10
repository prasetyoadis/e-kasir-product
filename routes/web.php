<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('index');
});

Route::get('/dashboard', function () {
    return view('dashboard.index',[
        'title' => 'Dashboard'
    ]);

});

Route::get('/dashboard/products', function () {
    return view('dashboard.products.index',[
        'title' => 'Management Product'
    ]);
});

Route::get('/dashboard/products/{productId}', function ($productId) {
    return view('dashboard.products.detail',[
        'title' => 'Detail Product',
        'productId' => $productId
    ]);
});
Route::get('/dashboard/inventories', function () {
    return view('dashboard.inventory.index',[
        'title' => 'Stock Overview'
    ]);
});

Route::get('/dashboard/categories', function () {
    return view('dashboard.category.index',[
        'title' => 'Management Category'
    ]);
});
