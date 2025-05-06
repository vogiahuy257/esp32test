<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\TurbidityLog; // Model lưu dữ liệu

class TurbidityController extends Controller
{
    public function index()
    {
        $logs = TurbidityLog::all();
        return view('turbidity.index', compact('logs'));
    }

    public function store(Request $request)
    {
        \Log::info('Received data from ThingsBoard', $request->all());
        // Kiểm tra và nhận dữ liệu từ ThingsBoard
        $validated = $request->validate([
            'device_id' => 'required|string',
            'ntu_value' => 'required|numeric',
        ]);

        // Lưu dữ liệu vào database
        TurbidityLog::create([
            'ntu_value' => $validated['ntu_value'],
            'timestamp' => now(),
        ]);

        return response()->json(['message' => 'Data stored successfully'], 200);
    }
}
