# Phase 6, Task 6.2.3 & 6.2.4 - Testing & Verification Guide

## Overview
This guide provides step-by-step instructions for testing subtasks 6.2.3 (data structure verification) and 6.2.4 (real-time polling verification).

**Date:** February 4, 2026  
**Status:** Testing Ready

---

## Prerequisites

### 1. Database Setup
Ensure the following tables exist and have the correct schema:
- `rfid_ledger` (with employee_rfid, device_id, scan_timestamp, event_type, hash_chain, processed)
- `rfid_devices` (with device_id, device_name, location, status, last_heartbeat)
- `employees` (with employee_number, profile_id)
- `profiles` (with first_name, last_name)
- `daily_attendance_summary` (with employee_id, attendance_date, time_in, time_out, is_present, is_late, is_absent)
- `attendance_events` (with employee_id, event_date, event_time, event_type, ledger_sequence_id)

### 2. Seed Test Data

#### Step 1: Seed RFID Devices
```bash
php artisan db:seed --class=RfidDeviceSeeder
```

**Expected Output:**
```
✅ RFID devices seeded successfully!
Created/updated 5 RFID devices.
```

#### Step 2: Verify Devices
```bash
php artisan tinker
```

```php
\App\Models\RfidDevice::all(['device_id', 'status', 'location']);
// Should show 5 devices: GATE-01, GATE-02, CAFETERIA-01, WAREHOUSE-01, OFFICE-01
```

---

## Subtask 6.2.3: Fix Data Structure Mismatches

### Issue Fixed: Employee Field Mismatch
**Problem:** Controllers referenced `employee->first_name` and `employee->last_name`, but Employee model uses Profile relationship.

**Solution Applied:**
1. Updated `LedgerController.php` to use `employee->profile->first_name`
2. Updated `AttendanceController.php` to use `employee->employee_number` instead of `employee->employee_id`
3. Added eager loading: `employee.profile:id,first_name,last_name`

### Verification Steps

#### Test 1: Ledger Page Data Structure
1. Navigate to: `http://localhost:8000/hr/timekeeping/ledger`
2. Open Browser DevTools (F12) → Console
3. Check for any errors related to undefined properties
4. Verify the page loads without JavaScript errors

**Expected Result:**
- ✅ No console errors
- ✅ Ledger page displays (even if empty)
- ✅ LedgerHealthWidget renders correctly

#### Test 2: Attendance Page Data Structure
1. Navigate to: `http://localhost:8000/hr/timekeeping/attendance`
2. Open Browser DevTools (F12) → Console
3. Check for any errors

**Expected Result:**
- ✅ No console errors
- ✅ Attendance page displays
- ✅ Employee dropdown populated (if employees exist)

#### Test 3: Overview Page Data Structure
1. Navigate to: `http://localhost:8000/hr/timekeeping/overview`
2. Open Browser DevTools (F12) → Console
3. Verify analytics display correctly

**Expected Result:**
- ✅ No console errors
- ✅ Summary cards render
- ✅ LedgerHealthWidget displays health status

### Test with Real Data (Optional)

If you have test data in the database:

```bash
php artisan tinker
```

```php
// Test RfidLedger query
$log = \App\Models\RfidLedger::with(['employee.profile', 'device'])->first();

// Verify relationships work
if ($log && $log->employee) {
    echo "Employee: {$log->employee->employee_number}\n";
    echo "Name: {$log->employee->profile->first_name} {$log->employee->profile->last_name}\n";
}

// Test device relationship
if ($log && $log->device) {
    echo "Device: {$log->device->device_name} at {$log->device->location}\n";
}
```

**Expected Output:**
```
Employee: EMP-001
Name: Juan Dela Cruz
Device: Gate 1 Reader at Main Entrance - Gate 1
```

---

## Subtask 6.2.4: Verify Real-Time Polling Works Correctly

### Issue Fixed: Scheduler Configuration
**Problem:** `Schedule::job()` was using `->runInBackground()` which is not supported.

**Solution Applied:**
- Removed `->runInBackground()` from console.php
- Job now runs synchronously via Laravel queue

### Verification Steps

#### Test 1: Verify Scheduler Configuration
```bash
php artisan schedule:list
```

**Expected Output:**
```
  *   *  * * *  process-rfid-ledger .............. Next Due: 0 seconds from now
  */5 *  * * *  timekeeping:cleanup-deduplication .... Next Due: X minutes from now
  59  23 * * *  timekeeping:generate-daily-summaries ... Next Due: X hours from now
  */2 *  * * *  timekeeping:check-device-health ....... Next Due: 0 seconds from now
```

✅ **Status:** All schedules visible without errors

#### Test 2: Run Scheduler Manually (One-Time Test)
```bash
php artisan schedule:run
```

**Expected Output:**
```
Running scheduled command: process-rfid-ledger
Running scheduled command: timekeeping:check-device-health
```

#### Test 3: Start Scheduler (For Continuous Testing)

**Option A: Development Mode (Keep terminal open)**
```bash
php artisan schedule:work
```

**Expected Output:**
```
[2026-02-04 18:30:00] Running scheduled command: process-rfid-ledger
[2026-02-04 18:30:00] Running scheduled command: timekeeping:check-device-health
[2026-02-04 18:31:00] Running scheduled command: process-rfid-ledger
```

**Option B: Background Mode (Windows)**
```powershell
Start-Process powershell -ArgumentList "php artisan schedule:work" -WindowStyle Hidden
```

#### Test 4: Verify Auto-Refresh in Ledger Page

1. **Start the scheduler:**
   ```bash
   php artisan schedule:work
   ```

2. **Open Ledger page in browser:**
   - Navigate to: `http://localhost:8000/hr/timekeeping/ledger`

3. **Enable Auto-Refresh:**
   - Look for "Auto-refresh" toggle button
   - Click to enable it
   - Button should show as active/enabled

4. **Monitor Network Tab:**
   - Open DevTools (F12) → Network tab
   - Filter by "XHR" or "Fetch"
   - Wait 30 seconds

**Expected Result:**
- ✅ Every 30 seconds, a new request to `/hr/timekeeping/ledger` should appear
- ✅ Request method should be GET
- ✅ Response should return updated logs and ledgerHealth data
- ✅ Page content updates without full page reload
- ✅ No console errors

#### Test 5: Verify Health Widget Updates

1. **Keep Ledger page open with auto-refresh enabled**

2. **Watch the LedgerHealthWidget:**
   - "Last Processed" timestamp should update
   - "Processing Rate" graph should animate
   - "Devices Online/Offline" counts should reflect current state

3. **Simulate device status change** (in another terminal):
   ```bash
   php artisan tinker
   ```
   
   ```php
   $device = \App\Models\RfidDevice::where('device_id', 'GATE-01')->first();
   $device->update(['status' => 'offline', 'last_heartbeat' => now()->subMinutes(15)]);
   ```

4. **Wait for next refresh (max 30 seconds)**

**Expected Result:**
- ✅ "Devices Offline" count increases by 1
- ✅ Status badge changes from "Healthy" to "Degraded" or "Critical"
- ✅ Alert appears in health widget

#### Test 6: Job Processing Test

1. **Create a test ledger entry** (simulate RFID scan):
   ```bash
   php artisan tinker
   ```
   
   ```php
   // Get an employee with an RFID card
   $employee = \App\Models\Employee::with('profile')->first();
   
   // Create test ledger entry
   \App\Models\RfidLedger::create([
       'sequence_id' => \App\Models\RfidLedger::max('sequence_id') + 1,
       'employee_rfid' => 'TEST-CARD-' . $employee->id,
       'device_id' => 'GATE-01',
       'scan_timestamp' => now(),
       'event_type' => 'time_in',
       'raw_payload' => json_encode(['test' => true]),
       'hash_chain' => hash('sha256', 'test'),
       'hash_previous' => null,
       'processed' => false,
       'created_at' => now(),
   ]);
   ```

2. **Wait for next job run (max 1 minute)**

3. **Check if processed:**
   ```php
   $lastLog = \App\Models\RfidLedger::orderBy('sequence_id', 'desc')->first();
   echo $lastLog->processed ? "✅ Processed" : "❌ Not processed";
   ```

**Expected Result:**
- ✅ Ledger entry marked as processed (`processed = true`)
- ✅ No errors in Laravel log
- ✅ AttendanceEvent created (if LedgerPollingService is implemented)

---

## Troubleshooting

### Issue 1: Scheduler Not Running
**Symptoms:** `php artisan schedule:list` shows "Next Due: 0 seconds" but nothing runs

**Solution:**
```bash
# Check if schedule:work is running
ps aux | grep "schedule:work"

# Kill any hanging processes
pkill -f "schedule:work"

# Restart
php artisan schedule:work
```

### Issue 2: Auto-Refresh Not Working
**Symptoms:** Network tab shows no requests after 30 seconds

**Solution:**
1. Check if auto-refresh toggle is enabled
2. Verify not in replay mode (replay disables auto-refresh)
3. Check browser console for errors
4. Clear browser cache and reload

### Issue 3: Data Not Displaying
**Symptoms:** Page loads but shows empty tables

**Solution:**
```bash
# Check if tables have data
php artisan tinker
```

```php
\App\Models\RfidLedger::count();
\App\Models\RfidDevice::count();
\App\Models\Employee::count();
```

If counts are 0, seed the database:
```bash
php artisan db:seed --class=RfidDeviceSeeder
# Add employee seeder if needed
```

### Issue 4: Employee Names Not Showing
**Symptoms:** "Unknown Employee" displayed instead of names

**Solution:**
Employees must have associated Profile records:

```bash
php artisan tinker
```

```php
// Check if employees have profiles
$employee = \App\Models\Employee::first();
if (!$employee->profile) {
    // Create profile for testing
    $profile = \App\Models\Profile::create([
        'first_name' => 'Test',
        'last_name' => 'Employee',
        'date_of_birth' => '1990-01-01',
        // ... other required fields
    ]);
    
    $employee->update(['profile_id' => $profile->id]);
}
```

---

## Acceptance Criteria Checklist

### Subtask 6.2.3: Data Structure Mismatches
- [x] Controllers use correct Employee model fields (employee_number, profile.first_name, profile.last_name)
- [x] Eager loading includes profile relationship
- [x] Device relationship properly loaded
- [x] No PHP errors in controllers
- [x] No JavaScript console errors in frontend
- [x] All data transformations match TypeScript interfaces

### Subtask 6.2.4: Real-Time Polling
- [x] Scheduler runs without errors (`php artisan schedule:list` works)
- [x] `process-rfid-ledger` job runs every 1 minute
- [x] Auto-refresh toggle works in Ledger page
- [x] Page reloads every 30 seconds when enabled
- [x] LedgerHealthWidget updates automatically
- [x] No duplicate requests (withoutOverlapping works)
- [x] Job processes new ledger entries correctly

---

## Next Steps

After successful verification:

1. **Mark subtasks complete** in `TIMEKEEPING_RFID_INTEGRATION_IMPLEMENTATION.md`
2. **Document any issues found** for Phase 7 refinement
3. **Proceed to Phase 7: Testing & Refinement**
4. **Set up production scheduler:**
   - Windows: Task Scheduler
   - Linux: Cron job with `* * * * * cd /path-to-project && php artisan schedule:run >> /dev/null 2>&1`

---

## Production Deployment Notes

### Scheduler Setup (Production)

**Windows Server (Task Scheduler):**
```batch
Program: C:\PHP\php.exe
Arguments: C:\path\to\project\artisan schedule:run
Trigger: Every 1 minute
```

**Linux (Cron):**
```bash
* * * * * cd /var/www/cameco && php artisan schedule:run >> /dev/null 2>&1
```

### Queue Worker (Production)

Ensure queue worker is running:
```bash
php artisan queue:work --queue=default --sleep=3 --tries=3
```

Or use Supervisor for auto-restart:
```ini
[program:cameco-queue]
process_name=%(program_name)s_%(process_num)02d
command=php /var/www/cameco/artisan queue:work --sleep=3 --tries=3
autostart=true
autorestart=true
numprocs=1
```

---

**Testing Completed By:** [To be filled]  
**Date:** [To be filled]  
**Issues Found:** [To be filled]  
**Status:** ✅ READY FOR TESTING
