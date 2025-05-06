<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TurbidityController;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});


Route::post('/turbidity', [TurbidityController::class, 'store']); // API nhận dữ liệu từ ThingsBoard
Route::get('/turbidity', [TurbidityController::class, 'index']); // Lấy tất cả log turbidity

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
