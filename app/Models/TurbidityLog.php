<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TurbidityLog extends Model
{
    // Tên bảng trong database (không cần nếu tên bảng là 'turbidity_logs')
    protected $table = 'turbidity_logs';

    // Cho phép gán tự động (mass assignable)
    protected $fillable = [
        'ntu_value',
        'timestamp',
    ];

    // Nếu bạn không dùng cột `created_at` và `updated_at` mặc định của Laravel
    public $timestamps = true;
}
