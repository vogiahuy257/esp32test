<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TurbidityController;

Route::post('/turbidity', [TurbidityController::class, 'store']);
Route::get('/turbidity', [TurbidityController::class, 'index']);
