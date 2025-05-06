<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\TurbidityLog; // Model lưu dữ liệu

class TurbidityController extends Controller
{
    public function index()
    {
        $logs = TurbidityLog::orderBy('timestamp', 'desc')->get();
        \Log::info('Get DATA', $logs->all());
        return response()->json($logs);
    }


    public function store(Request $request)
    {
        \Log::info('Received data from ThingsBoard', $request->all());
        // Kiểm tra và nhận dữ liệu từ ThingsBoard
        $validated = $request->validate([
            'ntu' => 'required|numeric',
        ]);

        // Lưu dữ liệu vào database
        TurbidityLog::create([
            'ntu_value' => $validated['ntu'],
            'timestamp' => now(),
        ]);

        return response()->json(['message' => 'Data stored successfully'], 200);
    }
}
