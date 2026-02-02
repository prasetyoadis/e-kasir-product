<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('index');
});


Route::get('/dashboard', function () {
    return view('dashboard.index');
});

Route::get('/dashboard/products', function () {
    return view('dashboard.products.index');
});

Route::get('/dashboard/products/detail', function () {
    return view('dashboard.products.show');
});
Route::get('/dashboard/inventories', function () {
    return view('dashboard.inventory.index');
});

Route::get('/dashboard/categories', function () {
    return view('dashboard.category.index');
});
