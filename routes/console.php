<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;
use App\Jobs\Timekeeping\ProcessRfidLedgerJob;

/**
 * Phase 6, Task 6.1.2: Configure scheduled jobs
 * 
 * RFID Ledger Polling: Runs every 1 minute to process new attendance events
 */
Schedule::job(new ProcessRfidLedgerJob())
    ->everyMinute()
    ->name('process-rfid-ledger')
    ->withoutOverlapping() // Prevent concurrent runs
    ->onOneServer(); // Run on only one server in a multi-server setup

/**
 * Cleanup expired deduplication cache entries (every 5 minutes)
 */
Schedule::command('timekeeping:cleanup-deduplication-cache')
    ->everyFiveMinutes()
    ->name('cleanup-deduplication-cache')
    ->withoutOverlapping();

/**
 * Generate daily attendance summaries (runs at 11:59 PM)
 */
Schedule::command('timekeeping:generate-daily-summaries')
    ->dailyAt('23:59')
    ->name('generate-daily-summaries')
    ->timezone('Asia/Manila');

/**
 * Health check for offline devices (every 2 minutes)
 */
Schedule::command('timekeeping:check-device-health')
    ->everyTwoMinutes()
    ->name('check-device-health')
    ->withoutOverlapping();

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');
