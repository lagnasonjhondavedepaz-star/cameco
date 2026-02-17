# Payroll Module - Payments Feature Implementation Plan

**Feature:** Payment Processing & Distribution Management  
**Status:** Planning → Implementation  
**Priority:** HIGH  
**Created:** February 6, 2026  
**Estimated Duration:** 3-4 weeks  
**Target Users:** Payroll Officer, Office Admin, Employees  
**Dependencies:** PayrollProcessing (approved calculations), EmployeePayroll (bank details), Leave Management (unpaid leave deductions), Timekeeping (attendance data)

---

## 📚 Reference Documentation

This implementation plan is based on the following specifications and documentation:

### Core Specifications
- **[PAYROLL_MODULE_ARCHITECTURE.md](../docs/PAYROLL_MODULE_ARCHITECTURE.md)** - Complete Philippine payroll architecture with payment methods
- **[payroll-processing.md](../docs/workflows/processes/payroll-processing.md)** - Complete payroll workflow including payment distribution
- **[cash-salary-distribution.md](../docs/workflows/processes/cash-salary-distribution.md)** - Current cash distribution process (primary method)
- **[digital-salary-distribution.md](../docs/workflows/processes/digital-salary-distribution.md)** - Future bank/e-wallet distribution
- **[05-payroll-officer-workflow.md](../docs/workflows/05-payroll-officer-workflow.md)** - Payroll officer responsibilities
- **[02-office-admin-workflow.md](../docs/workflows/02-office-admin-workflow.md)** - Payment method configuration

### Integration Roadmaps
- **[PAYROLL-LEAVE-INTEGRATION-ROADMAP.md](../docs/issues/PAYROLL-LEAVE-INTEGRATION-ROADMAP.md)** - Leave deductions integration
- **[PAYROLL-TIMEKEEPING-INTEGRATION-ROADMAP.md](../docs/issues/PAYROLL-TIMEKEEPING-INTEGRATION-ROADMAP.md)** - Attendance-based pay integration
- **[LEAVE-MANAGEMENT-INTEGRATION-ROADMAP.md](../.aiplans/LEAVE-MANAGEMENT-INTEGRATION-ROADMAP.md)** - Event-driven leave integration

### Existing Code References
- **Frontend:** `resources/js/pages/Payroll/Payments/*` (BankFiles, Cash, Payslips, Tracking)
- **Controllers:** `app/Http/Controllers/Payroll/Payments/*` (all have mock data)
- **Components:** `resources/js/components/payroll/*` (payment-related components)
- **Routes:** `routes/payroll.php` (Payments section)

### Related Implementation Plans
- **[PAYROLL-GOVERNMENT-IMPLEMENTATION-PLAN.md](./PAYROLL-GOVERNMENT-IMPLEMENTATION-PLAN.md)** - Government contributions (affects net pay)
- **[PAYROLL-EMPLOYEE-PAYROLL-IMPLEMENTATION-PLAN.md](./PAYROLL-EMPLOYEE-PAYROLL-IMPLEMENTATION-PLAN.md)** - Employee bank details

---

## 📋 Executive Summary

**Current State:**
- ✅ **Frontend Pages:** Complete with mock data (BankFiles, Cash, Payslips, Tracking)
- ✅ **Controllers:** Basic structure with mock data (BankFilesController, CashPaymentController, PayslipsController, PaymentTrackingController)
- ✅ **Routes:** All routes registered in payroll.php
- ✅ **Components:** Payment-related components exist (envelope-printer, payslip-generator, payment-tracking-table)
- ❌ **Database Schema:** No payment tracking tables exist
- ❌ **Models:** No Eloquent models for payments
- ❌ **PayMongo Integration:** No payment gateway integration
- ❌ **Bank File Generator:** No real bank file generation (Metrobank, BDO, BPI formats)
- ❌ **Cash Distribution:** No accountability tracking system
- ❌ **Integration:** No connection to Leave Management or Timekeeping

**Goal:** Build complete payment distribution system that:
1. Generates bank files for digital salary transfer (InstaPay, PESONet formats)
2. Manages cash distribution with accountability tracking (current primary method)
3. Generates accurate payslips with all deductions (government, loans, advances, leave)
4. Integrates PayMongo for future online banking and e-wallet disbursements
5. Tracks payment status across all methods (cash, bank, e-wallet)
6. Provides audit trail for Office Admin and Payroll Officer
7. Integrates with Leave Management (unpaid leave deductions) and Timekeeping (attendance-based pay)

**Payment Methods Priority:**
1. **Phase 1 (Current):** Cash distribution with envelope generation
2. **Phase 2 (Near-term):** Bank file generation (InstaPay/PESONet)
3. **Phase 3 (Future):** PayMongo integration for e-wallets (GCash, Maya, etc.)

**Timeline:** 3-4 weeks (February 6 - March 3, 2026)

---

## 🎯 Feature Overview

### What is Payment Processing & Distribution?

The Payments module handles the final step of payroll: delivering net pay to employees through various methods:

1. **Cash Distribution (Current Primary Method)** - Physical cash in envelopes
   - Withdraw total payroll from company vault/bank
   - Prepare denomination breakdown per employee
   - Print salary envelopes with breakdown
   - Track cash accountability (disbursement log, signatures)
   - Generate accountability report for Office Admin
   - Handle unclaimed salaries (re-deposit, rollover)

2. **Bank File Generation (Near-term)** - Digital bank transfers
   - Generate bank-specific formats (Metrobank CSV, BDO Excel, BPI Text)
   - Support InstaPay (real-time, ≤₱50k per transaction)
   - Support PESONet (batch, ₱1M per transaction, T+1 settlement)
   - Validate employee bank accounts
   - Track submission status and confirmation
   - Handle failed transfers and retries

3. **E-wallet/Online Banking (Future)** - PayMongo integration
   - GCash disbursements via PayMongo API
   - Maya (PayMaya) wallet transfers
   - Bank account transfers via PayMongo
   - Real-time status tracking
   - Webhook handling for payment confirmations
   - Retry logic for failed transactions

4. **Payslip Generation** - Detailed salary breakdown
   - Earnings breakdown (basic, overtime, allowances)
   - Deductions breakdown (SSS, PhilHealth, Pag-IBIG, tax, loans, advances)
   - Leave deductions (unpaid leave days)
   - Attendance adjustments (absences, tardiness)
   - Year-to-date summaries
   - Government numbers (SSS, PhilHealth, Pag-IBIG, TIN)
   - Digital signatures and QR codes for verification

5. **Payment Tracking** - Multi-method status dashboard
   - Real-time payment status (pending, processing, paid, failed)
   - Payment method breakdown (cash, bank, e-wallet)
   - Failed payment alerts and retry queue
   - Employee acknowledgment tracking (signatures, receipts)
   - Reconciliation tools (expected vs actual)
   - Audit trail for compliance

---

## 🗄️ Database Schema Design

### Tables Overview

| Table | Purpose | Dependencies |
|-------|---------|--------------|
| `payment_methods` | Company-configured payment methods | None |
| `employee_payment_preferences` | Employee bank/wallet details | `employees` |
| `payroll_payments` | Per-employee payment records | `payroll_periods`, `employee_payroll_calculations` |
| `bank_file_batches` | Bank file generation tracking | `payroll_periods` |
| `cash_distribution_batches` | Cash disbursement tracking | `payroll_periods` |
| `payslips` | Generated payslip records | `payroll_payments` |
| `payment_audit_logs` | Payment action audit trail | `users` |

---

## 🚀 Implementation Phases

## **Phase 1: Database Foundation (Week 1: Feb 6-12)**

### Task 1.1: Create Database Migrations

#### Subtask 1.1.1: Create payment_methods Migration
**File:** `database/migrations/YYYY_MM_DD_create_payment_methods_table.php`

**Purpose:** Store company-configured payment methods (cash, bank, e-wallet)

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payment_methods', function (Blueprint $table) {
            $table->id();
            
            // Method Type
            $table->enum('method_type', ['cash', 'bank', 'ewallet', 'check'])->unique();
            $table->string('display_name', 50);
            $table->text('description')->nullable();
            
            // Configuration
            $table->boolean('is_enabled')->default(false);
            $table->boolean('requires_employee_setup')->default(false);
            $table->boolean('supports_bulk_payment')->default(false);
            $table->decimal('transaction_fee', 8, 2)->default(0);
            $table->decimal('min_amount', 10, 2)->nullable();
            $table->decimal('max_amount', 10, 2)->nullable();
            
            // Processing Settings
            $table->enum('settlement_speed', ['instant', 'same_day', 'next_day', 'manual'])->default('manual');
            $table->integer('processing_days')->default(0); // Days to settlement
            $table->time('cutoff_time')->nullable(); // Daily cutoff for same-day
            
            // Bank-specific
            $table->string('bank_code')->nullable(); // e.g., 'MBTC' for Metrobank
            $table->string('bank_name')->nullable();
            $table->string('file_format')->nullable(); // 'csv', 'xlsx', 'txt', 'dat'
            $table->json('file_template')->nullable(); // Column mapping
            
            // E-wallet-specific
            $table->string('provider_name')->nullable(); // 'GCash', 'Maya', 'PayMongo'
            $table->string('api_endpoint')->nullable();
            $table->text('api_credentials')->nullable(); // Encrypted
            $table->string('webhook_url')->nullable();
            
            // Priority & Display
            $table->integer('sort_order')->default(999);
            $table->string('icon')->nullable();
            $table->string('color_hex', 7)->nullable();
            
            // Audit
            $table->foreignId('configured_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('last_used_at')->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            // Indexes
            $table->index(['method_type', 'is_enabled']);
            $table->index('sort_order');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payment_methods');
    }
};
```

**Dependencies:** `users`

**Action:** CREATE

---

#### Subtask 1.1.2: Create employee_payment_preferences Migration
**File:** `database/migrations/YYYY_MM_DD_create_employee_payment_preferences_table.php`

**Purpose:** Store employee bank account and e-wallet details for digital payments

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('employee_payment_preferences', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained()->cascadeOnDelete();
            $table->foreignId('payment_method_id')->constrained()->cascadeOnDelete();
            
            // Priority
            $table->boolean('is_primary')->default(false);
            $table->integer('priority')->default(1); // 1 = highest
            
            // Bank Account Details
            $table->string('bank_code', 10)->nullable(); // e.g., 'MBTC', 'BDO', 'BPI'
            $table->string('bank_name', 100)->nullable();
            $table->string('branch_code', 20)->nullable();
            $table->string('branch_name', 100)->nullable();
            $table->string('account_number')->nullable(); // Encrypted
            $table->string('account_name', 200)->nullable();
            $table->enum('account_type', ['savings', 'checking', 'payroll'])->nullable();
            
            // E-wallet Details
            $table->string('ewallet_provider')->nullable(); // 'gcash', 'maya', 'paymongo'
            $table->string('ewallet_account_number')->nullable(); // Mobile number
            $table->string('ewallet_account_name', 200)->nullable();
            
            // Verification
            $table->enum('verification_status', ['pending', 'verified', 'failed', 'rejected'])->default('pending');
            $table->timestamp('verified_at')->nullable();
            $table->foreignId('verified_by')->nullable()->constrained('users')->nullOnDelete();
            $table->text('verification_notes')->nullable();
            
            // Supporting Documents
            $table->string('document_type')->nullable(); // 'bank_statement', 'passbook', 'screenshot'
            $table->string('document_path')->nullable();
            $table->timestamp('document_uploaded_at')->nullable();
            
            // Usage Tracking
            $table->boolean('is_active')->default(true);
            $table->timestamp('last_used_at')->nullable();
            $table->integer('successful_payments')->default(0);
            $table->integer('failed_payments')->default(0);
            
            // Audit
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();
            
            // Indexes
            $table->index(['employee_id', 'is_primary']);
            $table->index(['employee_id', 'payment_method_id']);
            $table->index('verification_status');
            $table->index('bank_code');
            $table->unique(['employee_id', 'payment_method_id', 'account_number'], 'unique_employee_payment');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('employee_payment_preferences');
    }
};
```

**Dependencies:** `employees`, `payment_methods`, `users`

**Action:** CREATE

---

#### Subtask 1.1.3: Create payroll_payments Migration
**File:** `database/migrations/YYYY_MM_DD_create_payroll_payments_table.php`

**Purpose:** Track individual employee payments per payroll period

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payroll_payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained()->cascadeOnDelete();
            $table->foreignId('payroll_period_id')->constrained()->cascadeOnDelete();
            $table->foreignId('employee_payroll_calculation_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('payment_method_id')->constrained()->cascadeOnDelete();
            
            // Period Information
            $table->date('period_start');
            $table->date('period_end');
            $table->date('payment_date'); // Expected payment date
            
            // Payment Amounts
            $table->decimal('gross_pay', 10, 2);
            $table->decimal('total_deductions', 10, 2)->default(0);
            $table->decimal('net_pay', 10, 2);
            
            // Deduction Breakdown
            $table->decimal('sss_deduction', 8, 2)->default(0);
            $table->decimal('philhealth_deduction', 8, 2)->default(0);
            $table->decimal('pagibig_deduction', 8, 2)->default(0);
            $table->decimal('tax_deduction', 8, 2)->default(0);
            $table->decimal('loan_deduction', 8, 2)->default(0);
            $table->decimal('advance_deduction', 8, 2)->default(0);
            $table->decimal('leave_deduction', 8, 2)->default(0); // Unpaid leave
            $table->decimal('attendance_deduction', 8, 2)->default(0); // Absences/tardiness
            $table->decimal('other_deductions', 8, 2)->default(0);
            
            // Payment Details
            $table->string('payment_reference')->nullable(); // Bank ref, transaction ID, envelope #
            $table->string('batch_number')->nullable(); // Links to bank_file_batches or cash_distribution_batches
            
            // Bank Transfer Details
            $table->string('bank_account_number')->nullable();
            $table->string('bank_name')->nullable();
            $table->string('bank_transaction_id')->nullable();
            
            // E-wallet Details
            $table->string('ewallet_account')->nullable();
            $table->string('ewallet_transaction_id')->nullable();
            
            // Cash Distribution Details
            $table->string('envelope_number')->nullable();
            $table->timestamp('claimed_at')->nullable();
            $table->string('claimed_by_signature')->nullable(); // Path to signature image
            $table->foreignId('released_by')->nullable()->constrained('users')->nullOnDelete();
            
            // Payment Status
            $table->enum('status', [
                'pending',          // Awaiting processing
                'processing',       // Payment initiated
                'paid',            // Successfully paid
                'partially_paid',  // Partial payment made
                'failed',          // Payment failed
                'cancelled',       // Payment cancelled
                'unclaimed'        // Cash not claimed (after 30 days)
            ])->default('pending')->index();
            
            // Timestamps
            $table->timestamp('processed_at')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->timestamp('failed_at')->nullable();
            
            // Retry Logic
            $table->integer('retry_count')->default(0);
            $table->timestamp('last_retry_at')->nullable();
            $table->text('failure_reason')->nullable();
            
            // Webhook/Confirmation
            $table->json('provider_response')->nullable(); // PayMongo/bank response
            $table->string('confirmation_code')->nullable();
            
            // Notes
            $table->text('notes')->nullable();
            
            // Audit
            $table->foreignId('prepared_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('approved_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();
            
            // Indexes
            $table->index(['employee_id', 'payroll_period_id']);
            $table->index(['payment_date', 'status']);
            $table->index('payment_reference');
            $table->index('batch_number');
            $table->unique(['employee_id', 'payroll_period_id'], 'unique_payment');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payroll_payments');
    }
};
```

**Dependencies:** `employees`, `payroll_periods`, `employee_payroll_calculations`, `payment_methods`, `users`

**Action:** CREATE

---

#### Subtask 1.1.4: Create bank_file_batches Migration
**File:** `database/migrations/YYYY_MM_DD_create_bank_file_batches_table.php`

**Purpose:** Track bank file generation and submission

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bank_file_batches', function (Blueprint $table) {
            $table->id();
            $table->foreignId('payroll_period_id')->constrained()->cascadeOnDelete();
            $table->foreignId('payment_method_id')->constrained()->cascadeOnDelete();
            
            // Batch Information
            $table->string('batch_number')->unique();
            $table->string('batch_name');
            $table->date('payment_date');
            
            // Bank Details
            $table->string('bank_code', 10); // 'MBTC', 'BDO', 'BPI'
            $table->string('bank_name', 100);
            $table->enum('transfer_type', ['instapay', 'pesonet', 'internal'])->default('pesonet');
            
            // File Details
            $table->string('file_name');
            $table->string('file_path');
            $table->string('file_format', 10); // 'csv', 'xlsx', 'txt'
            $table->bigInteger('file_size')->nullable(); // bytes
            $table->string('file_hash')->nullable(); // SHA256
            
            // Amounts
            $table->integer('total_employees');
            $table->decimal('total_amount', 12, 2);
            $table->integer('successful_count')->default(0);
            $table->integer('failed_count')->default(0);
            $table->decimal('total_fees', 8, 2)->default(0);
            
            // Settlement
            $table->date('settlement_date')->nullable();
            $table->string('settlement_reference')->nullable();
            
            // Status
            $table->enum('status', ['draft', 'ready', 'submitted', 'processing', 'completed', 'partially_completed', 'failed'])->default('draft');
            $table->timestamp('submitted_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            
            // Validation
            $table->boolean('is_validated')->default(false);
            $table->timestamp('validated_at')->nullable();
            $table->json('validation_errors')->nullable();
            
            // Bank Response
            $table->text('bank_response')->nullable();
            $table->string('bank_confirmation_number')->nullable();
            
            // Notes
            $table->text('notes')->nullable();
            
            // Audit
            $table->foreignId('generated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('submitted_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();
            
            // Indexes
            $table->index(['payroll_period_id', 'bank_code']);
            $table->index(['payment_date', 'status']);
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bank_file_batches');
    }
};
```

**Dependencies:** `payroll_periods`, `payment_methods`, `users`

**Action:** CREATE

---

#### Subtask 1.1.5: Create cash_distribution_batches Migration
**File:** `database/migrations/YYYY_MM_DD_create_cash_distribution_batches_table.php`

**Purpose:** Track cash disbursement accountability

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cash_distribution_batches', function (Blueprint $table) {
            $table->id();
            $table->foreignId('payroll_period_id')->constrained()->cascadeOnDelete();
            
            // Batch Information
            $table->string('batch_number')->unique();
            $table->date('distribution_date');
            $table->string('distribution_location')->nullable();
            
            // Cash Preparation
            $table->decimal('total_cash_amount', 12, 2);
            $table->integer('total_employees');
            $table->json('denomination_breakdown')->nullable(); // {1000: 10, 500: 5, 100: 20, etc}
            
            // Withdrawal Details
            $table->string('withdrawal_source')->nullable(); // 'vault', 'bank_branch'
            $table->string('withdrawal_reference')->nullable();
            $table->date('withdrawal_date')->nullable();
            $table->foreignId('withdrawn_by')->nullable()->constrained('users')->nullOnDelete();
            
            // Verification
            $table->foreignId('counted_by')->nullable()->constrained('users')->nullOnDelete(); // Payroll Officer
            $table->foreignId('witnessed_by')->nullable()->constrained('users')->nullOnDelete(); // HR Manager/Office Admin
            $table->timestamp('verification_at')->nullable();
            $table->text('verification_notes')->nullable();
            
            // Distribution Tracking
            $table->integer('envelopes_prepared')->default(0);
            $table->integer('envelopes_distributed')->default(0);
            $table->integer('envelopes_unclaimed')->default(0);
            $table->decimal('amount_distributed', 12, 2)->default(0);
            $table->decimal('amount_unclaimed', 12, 2)->default(0);
            
            // Disbursement Log
            $table->string('log_sheet_path')->nullable(); // Scanned signature log
            $table->timestamp('distribution_started_at')->nullable();
            $table->timestamp('distribution_completed_at')->nullable();
            
            // Unclaimed Handling
            $table->date('unclaimed_deadline')->nullable(); // 30 days after distribution
            $table->string('unclaimed_disposition')->nullable(); // 're-deposited', 'held', 'next_period'
            $table->date('redeposit_date')->nullable();
            $table->string('redeposit_reference')->nullable();
            
            // Status
            $table->enum('status', ['preparing', 'ready', 'distributing', 'completed', 'partially_completed', 'reconciled'])->default('preparing');
            
            // Accountability Report
            $table->string('accountability_report_path')->nullable();
            $table->timestamp('report_generated_at')->nullable();
            $table->foreignId('report_approved_by')->nullable()->constrained('users')->nullOnDelete();
            
            // Notes
            $table->text('notes')->nullable();
            
            // Audit
            $table->foreignId('prepared_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();
            
            // Indexes
            $table->index(['payroll_period_id', 'distribution_date']);
            $table->index(['status', 'distribution_date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cash_distribution_batches');
    }
};
```

**Dependencies:** `payroll_periods`, `users`

**Action:** CREATE

---

#### Subtask 1.1.6: Create payslips Migration
**File:** `database/migrations/YYYY_MM_DD_create_payslips_table.php`

**Purpose:** Store generated payslip records

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payslips', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained()->cascadeOnDelete();
            $table->foreignId('payroll_period_id')->constrained()->cascadeOnDelete();
            $table->foreignId('payroll_payment_id')->constrained()->cascadeOnDelete();
            
            // Payslip Details
            $table->string('payslip_number')->unique();
            $table->date('period_start');
            $table->date('period_end');
            $table->date('payment_date');
            
            // Employee Information (snapshot)
            $table->string('employee_number', 20);
            $table->string('employee_name');
            $table->string('department')->nullable();
            $table->string('position')->nullable();
            
            // Government Numbers (snapshot)
            $table->string('sss_number')->nullable();
            $table->string('philhealth_number')->nullable();
            $table->string('pagibig_number')->nullable();
            $table->string('tin')->nullable();
            
            // Earnings Breakdown
            $table->json('earnings_data'); // {basic_salary, overtime, allowances, etc}
            $table->decimal('total_earnings', 10, 2);
            
            // Deductions Breakdown
            $table->json('deductions_data'); // {sss, philhealth, pagibig, tax, loans, etc}
            $table->decimal('total_deductions', 10, 2);
            
            // Net Pay
            $table->decimal('net_pay', 10, 2);
            
            // Leave Information
            $table->json('leave_summary')->nullable(); // {used_days, unpaid_days, deduction_amount}
            
            // Attendance Information
            $table->json('attendance_summary')->nullable(); // {present_days, absences, tardiness}
            
            // Year-to-Date Summaries
            $table->decimal('ytd_gross', 12, 2)->nullable();
            $table->decimal('ytd_tax', 10, 2)->nullable();
            $table->decimal('ytd_sss', 10, 2)->nullable();
            $table->decimal('ytd_philhealth', 10, 2)->nullable();
            $table->decimal('ytd_pagibig', 10, 2)->nullable();
            $table->decimal('ytd_net', 12, 2)->nullable();
            
            // File Details
            $table->string('file_path');
            $table->string('file_format', 10)->default('pdf');
            $table->bigInteger('file_size')->nullable();
            $table->string('file_hash')->nullable();
            
            // Distribution
            $table->enum('distribution_method', ['email', 'portal', 'print', 'sms'])->nullable();
            $table->timestamp('distributed_at')->nullable();
            $table->boolean('is_viewed')->default(false);
            $table->timestamp('viewed_at')->nullable();
            
            // Digital Signature
            $table->string('signature_hash')->nullable(); // For authenticity verification
            $table->string('qr_code_data')->nullable(); // QR code for quick verification
            
            // Status
            $table->enum('status', ['draft', 'generated', 'distributed', 'acknowledged'])->default('draft');
            
            // Notes
            $table->text('notes')->nullable();
            
            // Audit
            $table->foreignId('generated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();
            
            // Indexes
            $table->index(['employee_id', 'payroll_period_id']);
            $table->index('payslip_number');
            $table->index(['payment_date', 'status']);
            $table->index('distributed_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payslips');
    }
};
```

**Dependencies:** `employees`, `payroll_periods`, `payroll_payments`, `users`

**Action:** CREATE

---

#### Subtask 1.1.7: Create payment_audit_logs Migration
**File:** `database/migrations/YYYY_MM_DD_create_payment_audit_logs_table.php`

**Purpose:** Comprehensive audit trail for all payment actions

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payment_audit_logs', function (Blueprint $table) {
            $table->id();
            
            // Related Entity
            $table->string('auditable_type'); // PayrollPayment, BankFileBatch, etc
            $table->unsignedBigInteger('auditable_id');
            $table->index(['auditable_type', 'auditable_id']);
            
            // Action Details
            $table->string('action', 50); // 'created', 'processed', 'paid', 'failed', 'retried', 'cancelled'
            $table->string('actor_type')->nullable(); // 'user', 'system', 'webhook'
            $table->unsignedBigInteger('actor_id')->nullable();
            $table->string('actor_name')->nullable();
            
            // Changes
            $table->json('old_values')->nullable();
            $table->json('new_values')->nullable();
            $table->json('metadata')->nullable(); // Additional context
            
            // Request Information
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->string('request_id')->nullable();
            
            // Notes
            $table->text('notes')->nullable();
            
            $table->timestamps();
            
            // Indexes
            $table->index('action');
            $table->index('created_at');
            $table->index(['actor_type', 'actor_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payment_audit_logs');
    }
};
```

**Dependencies:** None (polymorphic)

**Action:** CREATE

---

#### Subtask 1.1.8: Run Migrations
**Action:** RUN COMMAND

```bash
php artisan migrate
```

**Validation:**
```bash
php artisan db:show --counts
```

Check that all 7 tables are created:
- payment_methods
- employee_payment_preferences
- payroll_payments
- bank_file_batches
- cash_distribution_batches
- payslips
- payment_audit_logs

---

### Task 1.2: Create Database Seeders

#### Subtask 1.2.1: Create PaymentMethodsSeeder
**File:** `database/seeders/PaymentMethodsSeeder.php`

**Purpose:** Populate default payment methods (cash, bank, e-wallet)

```php
<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class PaymentMethodsSeeder extends Seeder
{
    public function run(): void
    {
        $now = Carbon::now();
        
        $methods = [
            // Cash (Enabled by default - current primary method)
            [
                'method_type' => 'cash',
                'display_name' => 'Cash Payment',
                'description' => 'Physical cash distribution via salary envelopes',
                'is_enabled' => true,
                'requires_employee_setup' => false,
                'supports_bulk_payment' => false,
                'transaction_fee' => 0,
                'settlement_speed' => 'instant',
                'processing_days' => 0,
                'sort_order' => 1,
                'icon' => 'banknotes',
                'color_hex' => '#10b981',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            
            // Metrobank - InstaPay
            [
                'method_type' => 'bank',
                'display_name' => 'Metrobank (InstaPay)',
                'description' => 'Real-time bank transfer via InstaPay network',
                'is_enabled' => false, // Disabled by default, enabled by Office Admin
                'requires_employee_setup' => true,
                'supports_bulk_payment' => true,
                'transaction_fee' => 10,
                'min_amount' => 1,
                'max_amount' => 50000,
                'settlement_speed' => 'instant',
                'processing_days' => 0,
                'cutoff_time' => '17:00:00',
                'bank_code' => 'MBTC',
                'bank_name' => 'Metropolitan Bank & Trust Company',
                'file_format' => 'csv',
                'file_template' => json_encode([
                    'columns' => [
                        'Account Number',
                        'Account Name',
                        'Amount',
                        'Reference',
                    ],
                    'delimiter' => ',',
                    'has_header' => true,
                ]),
                'sort_order' => 2,
                'icon' => 'building-library',
                'color_hex' => '#ef4444',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            
            // BDO - PESONet
            [
                'method_type' => 'bank',
                'display_name' => 'BDO Unibank (PESONet)',
                'description' => 'Batch bank transfer via PESONet network (T+1 settlement)',
                'is_enabled' => false,
                'requires_employee_setup' => true,
                'supports_bulk_payment' => true,
                'transaction_fee' => 25,
                'min_amount' => 1,
                'max_amount' => 1000000,
                'settlement_speed' => 'next_day',
                'processing_days' => 1,
                'cutoff_time' => '14:00:00',
                'bank_code' => 'BDO',
                'bank_name' => 'Banco de Oro',
                'file_format' => 'xlsx',
                'file_template' => json_encode([
                    'columns' => [
                        'Account Number',
                        'Account Name',
                        'Amount',
                        'Particulars',
                    ],
                    'sheet_name' => 'Payroll',
                    'has_header' => true,
                ]),
                'sort_order' => 3,
                'icon' => 'building-library',
                'color_hex' => '#3b82f6',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            
            // GCash via PayMongo
            [
                'method_type' => 'ewallet',
                'display_name' => 'GCash',
                'description' => 'E-wallet transfer via PayMongo API',
                'is_enabled' => false,
                'requires_employee_setup' => true,
                'supports_bulk_payment' => true,
                'transaction_fee' => 15,
                'min_amount' => 1,
                'max_amount' => 100000,
                'settlement_speed' => 'instant',
                'processing_days' => 0,
                'provider_name' => 'PayMongo',
                'api_endpoint' => 'https://api.paymongo.com/v1',
                'sort_order' => 4,
                'icon' => 'device-mobile',
                'color_hex' => '#0066ff',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            
            // Maya (PayMaya) via PayMongo
            [
                'method_type' => 'ewallet',
                'display_name' => 'Maya (PayMaya)',
                'description' => 'E-wallet transfer via PayMongo API',
                'is_enabled' => false,
                'requires_employee_setup' => true,
                'supports_bulk_payment' => true,
                'transaction_fee' => 15,
                'min_amount' => 1,
                'max_amount' => 100000,
                'settlement_speed' => 'instant',
                'processing_days' => 0,
                'provider_name' => 'PayMongo',
                'api_endpoint' => 'https://api.paymongo.com/v1',
                'sort_order' => 5,
                'icon' => 'device-mobile',
                'color_hex' => '#00d632',
                'created_at' => $now,
                'updated_at' => $now,
            ],
        ];
        
        foreach ($methods as $method) {
            DB::table('payment_methods')->insert($method);
        }
        
        $this->command->info('Payment methods seeded successfully!');
        $this->command->info('- Cash: Enabled (current method)');
        $this->command->info('- Banks: 2 (Metrobank, BDO) - Disabled by default');
        $this->command->info('- E-wallets: 2 (GCash, Maya) - Disabled by default');
    }
}
```

**Dependencies:** `payment_methods` table

**Action:** CREATE

---

#### Subtask 1.2.2: Run Seeders
**Action:** RUN COMMAND

```bash
php artisan db:seed --class=PaymentMethodsSeeder
```

**Validation:**
```bash
php artisan tinker
>>> \DB::table('payment_methods')->count()
# Should return 5 (1 cash + 2 banks + 2 e-wallets)
>>> \DB::table('payment_methods')->where('is_enabled', true)->count()
# Should return 1 (only cash enabled)
```

---

## **Phase 2: Models & Relationships (Week 1-2: Feb 6-16)**

### Task 2.1: Create Eloquent Models

#### Subtask 2.1.1: Create PaymentMethod Model
**File:** `app/Models/PaymentMethod.php`

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PaymentMethod extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'method_type',
        'display_name',
        'description',
        'is_enabled',
        'requires_employee_setup',
        'supports_bulk_payment',
        'transaction_fee',
        'min_amount',
        'max_amount',
        'settlement_speed',
        'processing_days',
        'cutoff_time',
        'bank_code',
        'bank_name',
        'file_format',
        'file_template',
        'provider_name',
        'api_endpoint',
        'api_credentials',
        'webhook_url',
        'sort_order',
        'icon',
        'color_hex',
        'configured_by',
        'last_used_at',
    ];

    protected $casts = [
        'is_enabled' => 'boolean',
        'requires_employee_setup' => 'boolean',
        'supports_bulk_payment' => 'boolean',
        'transaction_fee' => 'decimal:2',
        'min_amount' => 'decimal:2',
        'max_amount' => 'decimal:2',
        'processing_days' => 'integer',
        'cutoff_time' => 'datetime:H:i:s',
        'file_template' => 'array',
        'sort_order' => 'integer',
        'last_used_at' => 'datetime',
    ];

    protected $hidden = [
        'api_credentials', // Sensitive data
    ];

    // ============================================================
    // Relationships
    // ============================================================

    public function configuredBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'configured_by');
    }

    public function employeePreferences(): HasMany
    {
        return $this->hasMany(EmployeePaymentPreference::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(PayrollPayment::class);
    }

    public function bankFileBatches(): HasMany
    {
        return $this->hasMany(BankFileBatch::class);
    }

    // ============================================================
    // Scopes
    // ============================================================

    public function scopeEnabled($query)
    {
        return $query->where('is_enabled', true);
    }

    public function scopeCash($query)
    {
        return $query->where('method_type', 'cash');
    }

    public function scopeBank($query)
    {
        return $query->where('method_type', 'bank');
    }

    public function scopeEwallet($query)
    {
        return $query->where('method_type', 'ewallet');
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order');
    }

    // ============================================================
    // Helper Methods
    // ============================================================

    public function isCash(): bool
    {
        return $this->method_type === 'cash';
    }

    public function isBank(): bool
    {
        return $this->method_type === 'bank';
    }

    public function isEwallet(): bool
    {
        return $this->method_type === 'ewallet';
    }

    public function supportsAmount(float $amount): bool
    {
        if ($this->min_amount && $amount < $this->min_amount) {
            return false;
        }

        if ($this->max_amount && $amount > $this->max_amount) {
            return false;
        }

        return true;
    }

    public function calculateFee(float $amount): float
    {
        return $this->transaction_fee ?? 0;
    }

    public function isAvailableForPayment(\DateTime $paymentDate): bool
    {
        if (!$this->is_enabled) {
            return false;
        }

        // Check cutoff time for same-day settlement
        if ($this->settlement_speed === 'same_day' && $this->cutoff_time) {
            $now = now();
            $cutoff = Carbon::parse($this->cutoff_time);
            
            if ($now->greaterThan($cutoff)) {
                return false;
            }
        }

        return true;
    }
}
```

**Action:** CREATE

---

#### Subtask 2.1.2: Create EmployeePaymentPreference Model
**File:** `app/Models/EmployeePaymentPreference.php`

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Casts\Attribute;

class EmployeePaymentPreference extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'employee_id',
        'payment_method_id',
        'is_primary',
        'priority',
        'bank_code',
        'bank_name',
        'branch_code',
        'branch_name',
        'account_number',
        'account_name',
        'account_type',
        'ewallet_provider',
        'ewallet_account_number',
        'ewallet_account_name',
        'verification_status',
        'verified_at',
        'verified_by',
        'verification_notes',
        'document_type',
        'document_path',
        'document_uploaded_at',
        'is_active',
        'last_used_at',
        'successful_payments',
        'failed_payments',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'is_primary' => 'boolean',
        'priority' => 'integer',
        'verified_at' => 'datetime',
        'document_uploaded_at' => 'datetime',
        'is_active' => 'boolean',
        'last_used_at' => 'datetime',
        'successful_payments' => 'integer',
        'failed_payments' => 'integer',
    ];

    protected $hidden = [
        'account_number', // Sensitive data
        'ewallet_account_number', // Sensitive data
    ];

    // ============================================================
    // Relationships
    // ============================================================

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    public function paymentMethod(): BelongsTo
    {
        return $this->belongsTo(PaymentMethod::class);
    }

    public function verifiedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'verified_by');
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updatedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    // ============================================================
    // Scopes
    // ============================================================

    public function scopePrimary($query)
    {
        return $query->where('is_primary', true);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeVerified($query)
    {
        return $query->where('verification_status', 'verified');
    }

    public function scopeByPriority($query)
    {
        return $query->orderBy('priority');
    }

    // ============================================================
    // Accessors & Mutators
    // ============================================================

    protected function accountNumber(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => $value ? decrypt($value) : null,
            set: fn ($value) => $value ? encrypt($value) : null,
        );
    }

    protected function ewalletAccountNumber(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => $value ? decrypt($value) : null,
            set: fn ($value) => $value ? encrypt($value) : null,
        );
    }

    // ============================================================
    // Helper Methods
    // ============================================================

    public function isVerified(): bool
    {
        return $this->verification_status === 'verified';
    }

    public function maskAccountNumber(): string
    {
        if (!$this->account_number) {
            return 'N/A';
        }

        $account = $this->account_number;
        $length = strlen($account);

        if ($length <= 4) {
            return str_repeat('*', $length);
        }

        return str_repeat('*', $length - 4) . substr($account, -4);
    }

    public function getDisplayName(): string
    {
        $method = $this->paymentMethod->display_name;
        $masked = $this->maskAccountNumber();

        return "{$method} - {$masked}";
    }

    public function recordSuccess(): void
    {
        $this->increment('successful_payments');
        $this->update(['last_used_at' => now()]);
    }

    public function recordFailure(): void
    {
        $this->increment('failed_payments');
    }
}
```

**Action:** CREATE

---

[Continuing with remaining models and phases...]

---

## 📊 Clarifications, Recommendations & Questions

### 🔍 Clarifications Needed

#### Payment Methods & Configuration

1. **Q:** Which payment methods should be enabled by default?
   - **Current Plan:** Only cash enabled, banks/e-wallets disabled until Office Admin enables them
   - **Reason:** Matches current deployment (cash-only distribution)
   - **Your preference?**

2. **Q:** Should we implement check payment support?
   - **Current Plan:** Not included in Phase 1-3
   - **Alternative:** Can add as Phase 4 if needed
   - **Your preference?**

3. **Q:** What banks should we support beyond Metrobank and BDO?
   - **Current Plan:** Metrobank (InstaPay), BDO (PESONet)
   - **Common additions:** BPI, UnionBank, LandBank, Security Bank
   - **Your preference?**

#### PayMongo Integration

4. **Q:** Do you have an existing PayMongo account?
   - **If Yes:** Need API keys (public_key, secret_key) for configuration
   - **If No:** Should we create test account first for development?
   - **Your preference?**

5. **Q:** Which PayMongo features should we implement?
   - **Current Plan:** Disbursements API for GCash/Maya payouts
   - **Alternative:** Also include bank transfers via PayMongo?
   - **Your preference?**

6. **Q:** Should PayMongo webhook verification be strict or lenient?
   - **Strict:** Reject unsigned webhooks (more secure)
   - **Lenient:** Accept all webhooks, log verification failures
   - **Your preference?**

#### Cash Distribution

7. **Q:** How should unclaimed salaries be handled after 30 days?
   - **Current Plan:** Manual disposition (re-deposit, hold, add to next period)
   - **Alternative:** Automatic re-deposit to company account
   - **Your preference?**

8. **Q:** Should cash distribution require dual verification?
   - **Current Plan:** Yes, Payroll Officer counts + Office Admin witnesses
   - **Alternative:** Single person verification
   - **Your preference?**

9. **Q:** Should envelope printing include employee photos?
   - **Current Plan:** Employee number, name, amount breakdown only
   - **Alternative:** Add photo for easier identification
   - **Your preference?**

#### Bank File Generation

10. **Q:** Which bank file format versions should we support?
    - **Current Plan:** Latest formats (2024 versions)
    - **Alternative:** Support legacy formats for older bank systems
    - **Your preference?**

11. **Q:** Should bank files include validation before generation?
    - **Current Plan:** Yes, validate account numbers, names, amounts
    - **Alternative:** Generate without validation (faster)
    - **Your preference?**

12. **Q:** How should failed bank transfers be handled?
    - **Current Plan:** Auto-retry 3 times, then manual intervention
    - **Alternative:** No auto-retry, always manual
    - **Your preference?**

#### Payslip Generation

13. **Q:** Should payslips include year-to-date summaries?
    - **Current Plan:** Yes, YTD for gross, tax, government contributions
    - **Alternative:** Current period only
    - **Your preference?**

14. **Q:** What format should payslips be generated in?
    - **Current Plan:** PDF only
    - **Alternative:** PDF + Excel option
    - **Your preference?**

15. **Q:** Should payslips have QR codes for verification?
    - **Current Plan:** Yes, QR code with payslip hash for authenticity
    - **Alternative:** No QR code
    - **Your preference?**

16. **Q:** How should payslips be distributed?
    - **Current Plan:** Email (if employee has email), otherwise print
    - **Alternative:** Always print, never email
    - **Your preference?**

#### Leave Integration

17. **Q:** How should unpaid leave deductions be calculated?
    - **Current Plan:** (Basic salary / working days) × unpaid leave days
    - **Alternative:** Pro-rated based on gross salary
    - **Verify with:** PAYROLL-LEAVE-INTEGRATION-ROADMAP.md
    - **Your preference?**

18. **Q:** Should leave deductions include government contributions?
    - **Current Plan:** Yes, reduce SSS/PhilHealth/Pag-IBIG proportionally
    - **Alternative:** Keep government contributions at full rate
    - **Your preference?**

#### Timekeeping Integration

19. **Q:** How should tardiness deductions be calculated?
    - **Current Plan:** Hourly rate × hours late (rounded to 15min intervals)
    - **Alternative:** Fixed penalty per tardiness instance
    - **Verify with:** PAYROLL-TIMEKEEPING-INTEGRATION-ROADMAP.md
    - **Your preference?**

20. **Q:** Should absences deduct full day or partial day?
    - **Current Plan:** Full day deduction for unexcused absences
    - **Alternative:** Hourly deduction based on shift length
    - **Your preference?**

#### Payment Tracking & Audit

21. **Q:** How long should payment audit logs be retained?
    - **Current Plan:** Indefinite retention (no auto-deletion)
    - **Alternative:** 7 years (BIR requirement), then archive
    - **Your preference?**

22. **Q:** Should payment status changes trigger notifications?
    - **Current Plan:** Yes, notify Payroll Officer and Office Admin
    - **Alternative:** Only log changes, no notifications
    - **Your preference?**

23. **Q:** Should employees be able to view payment history?
    - **Current Plan:** Not in Phase 1-3 (no employee portal yet)
    - **Alternative:** Build employee payment history view
    - **Your preference?**

#### Security & Compliance

24. **Q:** How should bank account numbers be encrypted?
    - **Current Plan:** Laravel's encrypt() function (AES-256-CBC)
    - **Alternative:** Custom encryption with separate key vault
    - **Your preference?**

25. **Q:** Should payment method configuration require approval?
    - **Current Plan:** Yes, Office Admin configures, Superadmin approves
    - **Alternative:** Office Admin can enable without approval
    - **Your preference?**

26. **Q:** Should bulk payments require batch approval?
    - **Current Plan:** Yes, HR Manager reviews, Office Admin approves
    - **Alternative:** Payroll Officer can process without approval
    - **Your preference?**

#### Performance & Scalability

27. **Q:** Should bank file generation be queued?
    - **Current Plan:** Yes, use Laravel Queue for files >100 employees
    - **Alternative:** Synchronous generation (may timeout)
    - **Your preference?**

28. **Q:** Should payslip generation be batched?
    - **Current Plan:** Yes, generate in chunks of 50 to avoid memory issues
    - **Alternative:** Generate all at once
    - **Your preference?**

29. **Q:** Should payment tracking use caching?
    - **Current Plan:** Yes, cache payment status for 5 minutes
    - **Alternative:** Always query database (slower but always fresh)
    - **Your preference?**

30. **Q:** Should we implement payment method failover?
    - **Current Plan:** If bank transfer fails, offer cash fallback
    - **Alternative:** No failover, manual intervention required
    - **Your preference?**

---

### 💡 Recommendations

#### Implementation Strategy

1. **Phased Rollout Recommended**
   - **Phase 1 (Week 1-2):** Database schema + Cash distribution only
   - **Phase 2 (Week 2-3):** Bank file generation (Metrobank, BDO)
   - **Phase 3 (Week 3-4):** PayMongo integration (GCash, Maya)
   - **Reason:** Allows testing each method independently before combining

2. **Start with Cash Distribution**
   - **Why:** Current primary method, must work flawlessly
   - **Priority:** Accountability tracking, envelope generation, unclaimed handling
   - **Timeline:** Complete Week 1-2

3. **Test Bank Files with Small Batch First**
   - **Why:** Bank rejections can cause payroll delays
   - **Approach:** Generate test file for 5-10 employees, submit to bank
   - **Validate:** Confirm format acceptance before full payroll

4. **Use PayMongo Test Mode Initially**
   - **Why:** Avoid real money transactions during development
   - **Approach:** Use test API keys, simulate successful/failed payments
   - **Switch:** Move to production keys only after thorough testing

#### Technical Architecture

5. **Event-Driven Payment Status Updates**
   - **Implement:** `PaymentProcessed`, `PaymentFailed`, `PaymentRetried` events
   - **Listeners:** Update audit logs, send notifications, trigger retries
   - **Benefit:** Decoupled architecture, easier to add new features

6. **Queue All Bank/E-wallet Transactions**
   - **Why:** External API calls can timeout or fail
   - **Implementation:** Use Laravel Queue with retry logic
   - **Benefit:** Non-blocking UI, automatic retry on failure

7. **Implement Payment Reconciliation Tool**
   - **Why:** Manual verification needed for bank confirmations
   - **Features:** Compare expected vs actual payments, flag discrepancies
   - **Timeline:** Add in Phase 2 with bank files

8. **Use Laravel Batch for Bulk Payments**
   - **Why:** Track progress of 100+ employee payments
   - **Implementation:** `Bus::batch()` with progress callbacks
   - **Benefit:** Payroll Officer can see real-time status

#### Security Best Practices

9. **Encrypt All Sensitive Payment Data**
   - **Scope:** Bank account numbers, e-wallet accounts, API keys
   - **Method:** Laravel's `encrypt()` with separate config key
   - **Audit:** Log all access to encrypted fields

10. **Implement Payment Approval Workflow**
    - **Flow:** Payroll Officer prepares → HR Manager reviews → Office Admin approves
    - **Why:** Matches current approval matrix in documentation
    - **Exception:** Cash <₱500k can skip Office Admin (configure threshold)

11. **Add Payment Amount Limits**
    - **Why:** Prevent accidental overpayments
    - **Limits:** 
      - Per employee: ₱100k (configurable)
      - Per batch: ₱5M (configurable)
      - Daily total: ₱10M (configurable)
    - **Enforcement:** Database constraint + application validation

12. **Enable Two-Factor Authentication for Payment Approval**
    - **Who:** Office Admin, Superadmin
    - **When:** Approving payments >₱1M or enabling new payment methods
    - **Why:** Extra security for financial operations

#### Integration Points

13. **Listen to Leave Management Events**
    - **Events:** `LeaveApproved`, `LeaveRejected`, `LeaveCancelled`
    - **Action:** Recalculate net pay if leave affects current payroll period
    - **Reference:** PAYROLL-LEAVE-INTEGRATION-ROADMAP.md

14. **Poll Timekeeping Daily Summaries**
    - **Source:** `daily_attendance_summaries` table
    - **Frequency:** Daily at 11:59 PM
    - **Action:** Update attendance deductions for current period
    - **Reference:** PAYROLL-TIMEKEEPING-INTEGRATION-ROADMAP.md

15. **Sync with Government Contributions**
    - **Dependency:** PAYROLL-GOVERNMENT-IMPLEMENTATION-PLAN.md
    - **Data:** Pull SSS/PhilHealth/Pag-IBIG/Tax deductions
    - **Timing:** After government calculations complete

#### User Experience

16. **Add Payment Status Dashboard**
    - **Widgets:** 
      - Total amount to be paid
      - Payment method breakdown (cash, bank, e-wallet)
      - Failed payments count
      - Unclaimed salaries
    - **Audience:** Payroll Officer, Office Admin

17. **Implement Bulk Payment Actions**
    - **Actions:** Retry failed payments, cancel pending, mark as paid manually
    - **UI:** Multi-select checkboxes + action dropdown
    - **Benefit:** Faster workflow for large payrolls

18. **Add Employee Search in Payment Tracking**
    - **Search by:** Employee number, name, department, payment status
    - **Filters:** Payment method, date range, amount range
    - **Export:** CSV/Excel of filtered results

#### Testing Strategy

19. **Create Payment Test Scenarios**
    - **Scenarios:**
      1. Successful cash distribution
      2. Successful bank transfer
      3. Failed bank transfer + retry
      4. PayMongo webhook handling
      5. Unclaimed salary rollover
    - **Validate:** Each scenario with 10+ employees

20. **Test with Mock Data First**
    - **Use:** Existing mock controllers as starting point
    - **Replace:** Gradually with real service layer
    - **Benefit:** Frontend remains functional during backend development

---

### 🎨 Suggested Enhancements (Post-MVP)

1. **Payslip Email Templates**
   - **Feature:** HTML email with payslip summary + PDF attachment
   - **Benefit:** Professional communication with employees
   - **Timeline:** Phase 4

2. **SMS Payment Notifications**
   - **Feature:** "Your salary has been deposited to [bank]" via SMS API
   - **Benefit:** Immediate employee notification
   - **Timeline:** Phase 4

3. **Payment Analytics Dashboard**
   - **Metrics:** Average processing time, failure rate by method, cost per transaction
   - **Benefit:** Data-driven decision making for payment methods
   - **Timeline:** Phase 5

4. **Multi-Currency Support**
   - **Use case:** Future international employees or contractors
   - **Complexity:** High (exchange rates, forex fees)
   - **Timeline:** Phase 6+

5. **Payment Scheduling**
   - **Feature:** Schedule payments in advance, auto-process on pay date
   - **Benefit:** Set-and-forget payroll distribution
   - **Timeline:** Phase 5

---

### 🔗 Related Implementation Plans

This Payments plan must coordinate with:

1. **[PAYROLL-GOVERNMENT-IMPLEMENTATION-PLAN.md](./PAYROLL-GOVERNMENT-IMPLEMENTATION-PLAN.md)**
   - **Dependency:** Government deductions must be calculated before net pay
   - **Data flow:** Government contributions → Total deductions → Net pay → Payment

2. **[PAYROLL-EMPLOYEE-PAYROLL-IMPLEMENTATION-PLAN.md](./PAYROLL-EMPLOYEE-PAYROLL-IMPLEMENTATION-PLAN.md)**
   - **Dependency:** Employee bank details stored in `employee_payroll_info`
   - **Data flow:** Bank account details → Payment preferences → Payment execution

3. **[PAYROLL-LEAVE-INTEGRATION-ROADMAP.md](../docs/issues/PAYROLL-LEAVE-INTEGRATION-ROADMAP.md)**
   - **Event:** Listen to `LeaveApproved` event for unpaid leave deductions
   - **Calculation:** Deduct (daily rate × unpaid days) from net pay

4. **[PAYROLL-TIMEKEEPING-INTEGRATION-ROADMAP.md](../docs/issues/PAYROLL-TIMEKEEPING-INTEGRATION-ROADMAP.md)**
   - **Event:** Listen to `AttendanceSummaryUpdated` event
   - **Calculation:** Deduct absences and tardiness from net pay

---

### ⚠️ Critical Success Factors

For this implementation to succeed, we must:

1. ✅ **Complete Government module first** (for accurate deductions)
2. ✅ **Verify bank file formats** with actual banks before full rollout
3. ✅ **Test PayMongo webhooks** thoroughly (payment confirmations critical)
4. ✅ **Implement robust error handling** (payment failures can't be ignored)
5. ✅ **Add comprehensive audit logging** (financial transactions require full traceability)
6. ✅ **Train Payroll Officer** on all payment methods before go-live
7. ✅ **Prepare rollback plan** if digital payments fail (fall back to cash)

---

## 📝 Next Steps

1. **Review this plan** and answer the 30 clarification questions above
2. **Confirm payment method priority** (cash → bank → e-wallet)
3. **Provide PayMongo credentials** (test keys for development)
4. **Approve Phase 1 database schema** before implementation begins
5. **Schedule testing session** with Payroll Officer for cash distribution workflow

---

**Plan Status:** ⏳ Awaiting your feedback on clarifications before implementation begins

**Estimated Start Date:** Upon approval of clarifications  
**Estimated Completion Date:** 3-4 weeks after start

