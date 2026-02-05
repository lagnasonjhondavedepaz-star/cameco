# Payroll Advances Feature - Complete Implementation Plan

**Feature:** Employee Cash Advances Management  
**Status:** Planning → Ready for Implementation  
**Priority:** HIGH  
**Created:** February 5, 2026  
**Estimated Duration:** 2-3 weeks  
**Target Completion:** February 26, 2026

---

## 📚 Reference Documentation

This implementation plan is based on the following specifications and documentation:

### Core Integration Documents
- **[PAYROLL-TIMEKEEPING-INTEGRATION-ROADMAP.md](./PAYROLL-TIMEKEEPING-INTEGRATION-ROADMAP.md)** - Primary payroll-timekeeping integration strategy
- **[PAYROLL-LEAVE-INTEGRATION-ROADMAP.md](./PAYROLL-LEAVE-INTEGRATION-ROADMAP.md)** - Leave-payroll integration (for future unpaid leave deductions)
- **[payroll-processing.md](../docs/workflows/processes/payroll-processing.md)** - Complete payroll processing workflow
- **[05-payroll-officer-workflow.md](../docs/workflows/05-payroll-officer-workflow.md)** - Payroll Officer responsibilities and advance management

### Existing Code References
- **Frontend:** `resources/js/pages/Payroll/Advances/Index.tsx` (needs backend integration)
- **Controller:** `app/Http/Controllers/Payroll/AdvancesController.php` (has mock data, needs real logic)
- **Components:** `resources/js/components/payroll/advance-*.tsx` (ready for use)
- **Types:** `resources/js/types/payroll-pages.ts` (CashAdvance, CashAdvanceFormData interfaces)

---

## 🎯 Feature Overview

### What are Cash Advances?

**Cash Advances** are short-term salary advances given to employees before their regular payday to address immediate financial needs (emergencies, medical expenses, etc.). The advance amount is deducted from the employee's future salary through single or multiple installments.

### Key Business Rules

1. **Eligibility:** Employees must be regular/permanent (configurable by company policy)
2. **Amount Limit:** Maximum advance = 50% of monthly basic salary (configurable)
3. **Active Limit:** Maximum 1-2 active advances per employee at a time
4. **Deduction:** Deducted automatically during payroll calculation
5. **Approval:** Requires HR Manager or Office Admin approval
6. **Types:** Cash Advance, Medical Advance, Travel Advance, Equipment Advance

### Integration Points

```
┌──────────────────────────────────────────────────────────────┐
│                    Cash Advances Flow                         │
└──────────────────────────────────────────────────────────────┘
                            │
                            ↓
┌──────────────────────────────────────────────────────────────┐
│  1. Employee Request → Payroll Officer/HR Manager Approval    │
│  2. Approved Advance → Schedule Deductions                    │
│  3. Payroll Calculation → Deduct from Salary                  │
│  4. Update Advance Balance → Track Installments               │
│  5. Complete Deduction → Close Advance                        │
└──────────────────────────────────────────────────────────────┘
                            │
                            ↓
┌──────────────────────────────────────────────────────────────┐
│              Integration with Payroll Calculation             │
│                                                               │
│  EmployeePayrollCalculation                                   │
│    ├─ Fetch active advances                                  │
│    ├─ Calculate deduction for current period                 │
│    ├─ Deduct from net pay (cash_advance field)               │
│    └─ Update advance balance                                 │
└──────────────────────────────────────────────────────────────┘
```

---

## 🤔 Clarifications & Recommendations

### 📋 Questions for Confirmation

**Q1: Advance Eligibility Rules**
- **Q1.1:** Should probationary employees be allowed to request advances?  
  **Recommendation:** ❌ **No** - Only regular/permanent employees eligible (industry standard)
  
- **Q1.2:** Maximum advance amount limit?  
  **Recommendation:** ✅ **50% of monthly basic salary** (Philippine standard for small companies)
  
- **Q1.3:** Maximum number of active advances per employee?  
  **Recommendation:** ✅ **1-2 active advances maximum** (prevent over-borrowing)

**Q2: Approval Workflow**
- **Q2.1:** Who can approve advance requests?  
  **Recommendation:** ✅ **HR Manager OR Office Admin** (based on amount thresholds)
  
- **Q2.2:** Should there be amount-based approval routing?  
  **Recommendation:** 
  - ≤ ₱20,000: HR Manager approval
  - > ₱20,000: Office Admin approval required
  
- **Q2.3:** Can employees request advances while on leave (unpaid)?  
  **Recommendation:** ❌ **No** - Employee must be actively working

**Q3: Deduction Schedule**
- **Q3.1:** Maximum number of installments?  
  **Recommendation:** ✅ **Maximum 6 installments** (6 months max repayment)
  
- **Q3.2:** What happens if employee resigns before full repayment?  
  **Recommendation:** ✅ **Deduct full balance from final pay** (stated in advance agreement)
  
- **Q3.3:** Can employees make early repayments?  
  **Recommendation:** ✅ **Yes** - Allow manual repayment from payroll officer

**Q4: Integration with Payroll**
- **Q4.1:** Should advance deductions happen before or after other deductions?  
  **Recommendation:** ✅ **After government deductions, before net pay** (standard order)
  
- **Q4.2:** What happens if net pay is insufficient for deduction?  
  **Recommendation:** ✅ **Deduct partial amount, carry forward balance** (prevents negative pay)
  
- **Q4.3:** Track advance impact in payslips?  
  **Recommendation:** ✅ **Yes** - Show as separate line item "Cash Advance Deduction"

**Q5: Leave Integration (Future)**
- **Q5.1:** Should unpaid leave impact advance eligibility?  
  **Recommendation:** ✅ **Yes** - Unpaid leave days reduce available advance amount
  
- **Q5.2:** Pause advance deductions during unpaid leave?  
  **Recommendation:** ✅ **Yes** - Resume deductions when employee returns to work

---

## 📊 Suggested Implementation Approach

### ✅ Recommended Features (Must Have)

1. **Employee Advance Request Portal**
   - Request form with validation
   - Purpose and urgency level
   - Upload supporting documents (receipts, medical certificates)

2. **HR Manager Approval Workflow**
   - View pending requests
   - Approve/reject with notes
   - Set deduction schedule
   - Partial approval (lower amount than requested)

3. **Automatic Payroll Integration**
   - Fetch active advances during payroll calculation
   - Calculate deduction amount per period
   - Update advance balance after deduction
   - Handle insufficient net pay scenarios

4. **Deduction Tracking**
   - Dashboard showing all active advances
   - Payment history per advance
   - Remaining balance tracker
   - Installment completion status

5. **Reporting & Analytics**
   - Total advances outstanding
   - Monthly deduction summary
   - Employee advance history
   - Default/incomplete advances report

### ⚠️ Nice to Have (Phase 2)

1. **Advance Eligibility Calculator**
   - Show employee max eligible advance amount
   - Based on salary, employment status, existing advances
   
2. **Email/SMS Notifications**
   - Notify employee on approval/rejection
   - Remind about upcoming deductions
   - Alert on deduction completion

3. **Mobile App Integration**
   - Submit advance requests from mobile
   - Track advance balance on mobile

4. **Advance Agreement PDF**
   - Auto-generate advance agreement document
   - Employee e-signature
   - Store in employee documents

---

## 🗄️ Database Schema Design

### Required Tables

#### 1. employee_cash_advances

```sql
CREATE TABLE employee_cash_advances (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    advance_number VARCHAR(20) UNIQUE NOT NULL,  -- ADV-2026-001
    employee_id BIGINT UNSIGNED NOT NULL,
    
    -- Request Details
    advance_type ENUM('cash_advance', 'medical_advance', 'travel_advance', 'equipment_advance', 'emergency_advance') NOT NULL,
    amount_requested DECIMAL(10,2) NOT NULL,
    purpose TEXT NOT NULL,
    requested_date DATE NOT NULL,
    priority_level ENUM('normal', 'urgent') DEFAULT 'normal',
    supporting_documents JSON,  -- Array of file paths
    
    -- Approval Details
    approval_status ENUM('pending', 'approved', 'rejected', 'cancelled') DEFAULT 'pending',
    amount_approved DECIMAL(10,2),
    approved_by BIGINT UNSIGNED,
    approved_at TIMESTAMP,
    approval_notes TEXT,
    rejection_reason TEXT,
    
    -- Deduction Schedule
    deduction_status ENUM('pending', 'active', 'completed', 'cancelled') DEFAULT 'pending',
    deduction_schedule ENUM('single_period', 'installments') DEFAULT 'installments',
    number_of_installments INT DEFAULT 1,
    installments_completed INT DEFAULT 0,
    deduction_amount_per_period DECIMAL(10,2),  -- Calculated: amount_approved / number_of_installments
    
    -- Balance Tracking
    total_deducted DECIMAL(10,2) DEFAULT 0,
    remaining_balance DECIMAL(10,2),  -- amount_approved - total_deducted
    
    -- Completion
    completed_at TIMESTAMP,
    completion_reason ENUM('fully_paid', 'employee_resignation', 'cancelled', 'written_off'),
    
    -- Audit
    created_by BIGINT UNSIGNED NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by BIGINT UNSIGNED,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
    FOREIGN KEY (approved_by) REFERENCES users(id),
    FOREIGN KEY (created_by) REFERENCES users(id),
    FOREIGN KEY (updated_by) REFERENCES users(id),
    
    INDEX idx_employee_status (employee_id, deduction_status),
    INDEX idx_approval_status (approval_status),
    INDEX idx_deduction_status (deduction_status),
    INDEX idx_requested_date (requested_date)
);
```

#### 2. advance_deductions

```sql
CREATE TABLE advance_deductions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    cash_advance_id BIGINT UNSIGNED NOT NULL,
    payroll_period_id BIGINT UNSIGNED NOT NULL,
    employee_payroll_calculation_id BIGINT UNSIGNED,
    
    -- Deduction Details
    installment_number INT NOT NULL,  -- 1, 2, 3, etc.
    deduction_amount DECIMAL(10,2) NOT NULL,
    remaining_balance_after DECIMAL(10,2) NOT NULL,
    
    -- Status
    is_deducted BOOLEAN DEFAULT false,
    deducted_at TIMESTAMP,
    
    -- Notes
    deduction_notes TEXT,  -- "Partial deduction due to insufficient net pay"
    
    -- Audit
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (cash_advance_id) REFERENCES employee_cash_advances(id) ON DELETE CASCADE,
    FOREIGN KEY (payroll_period_id) REFERENCES payroll_periods(id),
    FOREIGN KEY (employee_payroll_calculation_id) REFERENCES employee_payroll_calculations(id),
    
    INDEX idx_advance_period (cash_advance_id, payroll_period_id),
    INDEX idx_deduction_status (is_deducted),
    UNIQUE KEY unique_advance_period (cash_advance_id, payroll_period_id)
);
```

### Schema Alignment with Payroll Integration

**Integration with `employee_payroll_calculations` table (from PAYROLL-TIMEKEEPING-INTEGRATION-ROADMAP.md):**

```sql
-- From payroll_periods table (already defined in PAYROLL-TIMEKEEPING-INTEGRATION-ROADMAP)
-- From employee_payroll_calculations table (already defined)

-- Advances will be integrated via:
employee_payroll_calculations.cash_advance DECIMAL(8,2) DEFAULT 0  -- ✅ Already in schema
```

---

## 🚀 Implementation Phases

### **Phase 1: Database Foundation (Week 1: Feb 5-11)**

#### Task 1.1: Create Database Migrations

**Subtask 1.1.1: Create employee_cash_advances migration**
- **File:** `database/migrations/2026_02_05_create_employee_cash_advances_table.php`
- **Action:** CREATE
- **Schema:** Full table structure with indexes and foreign keys
- **Validation:** Run migration, verify table structure

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('employee_cash_advances', function (Blueprint $table) {
            $table->id();
            $table->string('advance_number', 20)->unique();
            $table->foreignId('employee_id')->constrained('employees')->onDelete('cascade');
            
            // Request Details
            $table->enum('advance_type', ['cash_advance', 'medical_advance', 'travel_advance', 'equipment_advance', 'emergency_advance']);
            $table->decimal('amount_requested', 10, 2);
            $table->text('purpose');
            $table->date('requested_date');
            $table->enum('priority_level', ['normal', 'urgent'])->default('normal');
            $table->json('supporting_documents')->nullable();
            
            // Approval Details
            $table->enum('approval_status', ['pending', 'approved', 'rejected', 'cancelled'])->default('pending');
            $table->decimal('amount_approved', 10, 2)->nullable();
            $table->foreignId('approved_by')->nullable()->constrained('users');
            $table->timestamp('approved_at')->nullable();
            $table->text('approval_notes')->nullable();
            $table->text('rejection_reason')->nullable();
            
            // Deduction Schedule
            $table->enum('deduction_status', ['pending', 'active', 'completed', 'cancelled'])->default('pending');
            $table->enum('deduction_schedule', ['single_period', 'installments'])->default('installments');
            $table->integer('number_of_installments')->default(1);
            $table->integer('installments_completed')->default(0);
            $table->decimal('deduction_amount_per_period', 10, 2)->nullable();
            
            // Balance Tracking
            $table->decimal('total_deducted', 10, 2)->default(0);
            $table->decimal('remaining_balance', 10, 2)->nullable();
            
            // Completion
            $table->timestamp('completed_at')->nullable();
            $table->enum('completion_reason', ['fully_paid', 'employee_resignation', 'cancelled', 'written_off'])->nullable();
            
            // Audit
            $table->foreignId('created_by')->constrained('users');
            $table->foreignId('updated_by')->nullable()->constrained('users');
            $table->timestamps();
            
            // Indexes
            $table->index(['employee_id', 'deduction_status']);
            $table->index('approval_status');
            $table->index('deduction_status');
            $table->index('requested_date');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('employee_cash_advances');
    }
};
```

**Subtask 1.1.2: Create advance_deductions migration**
- **File:** `database/migrations/2026_02_05_create_advance_deductions_table.php`
- **Action:** CREATE
- **Schema:** Tracks individual deductions per payroll period
- **Validation:** Run migration, verify foreign key constraints

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('advance_deductions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cash_advance_id')->constrained('employee_cash_advances')->onDelete('cascade');
            $table->foreignId('payroll_period_id')->constrained('payroll_periods');
            $table->foreignId('employee_payroll_calculation_id')->nullable()->constrained('employee_payroll_calculations');
            
            // Deduction Details
            $table->integer('installment_number');
            $table->decimal('deduction_amount', 10, 2);
            $table->decimal('remaining_balance_after', 10, 2);
            
            // Status
            $table->boolean('is_deducted')->default(false);
            $table->timestamp('deducted_at')->nullable();
            
            // Notes
            $table->text('deduction_notes')->nullable();
            
            $table->timestamps();
            
            // Indexes
            $table->index(['cash_advance_id', 'payroll_period_id']);
            $table->index('is_deducted');
            $table->unique(['cash_advance_id', 'payroll_period_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('advance_deductions');
    }
};
```

**Subtask 1.1.3: Run migrations**
```bash
php artisan migrate
```

#### Task 1.2: Create Eloquent Models

**Subtask 1.2.1: Create CashAdvance model**
- **File:** `app/Models/CashAdvance.php`
- **Action:** CREATE
- **Relationships:** belongsTo(Employee), belongsTo(User approvedBy), hasMany(AdvanceDeduction)
- **Scopes:** active(), pending(), completed(), byEmployee()
- **Accessors:** formatted_amount_requested, formatted_remaining_balance
- **Mutators:** Auto-calculate remaining_balance, deduction_amount_per_period

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CashAdvance extends Model
{
    use HasFactory;

    protected $table = 'employee_cash_advances';

    protected $fillable = [
        'advance_number',
        'employee_id',
        'advance_type',
        'amount_requested',
        'purpose',
        'requested_date',
        'priority_level',
        'supporting_documents',
        'approval_status',
        'amount_approved',
        'approved_by',
        'approved_at',
        'approval_notes',
        'rejection_reason',
        'deduction_status',
        'deduction_schedule',
        'number_of_installments',
        'installments_completed',
        'deduction_amount_per_period',
        'total_deducted',
        'remaining_balance',
        'completed_at',
        'completion_reason',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'amount_requested' => 'decimal:2',
        'amount_approved' => 'decimal:2',
        'deduction_amount_per_period' => 'decimal:2',
        'total_deducted' => 'decimal:2',
        'remaining_balance' => 'decimal:2',
        'requested_date' => 'date',
        'approved_at' => 'datetime',
        'completed_at' => 'datetime',
        'supporting_documents' => 'array',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Relationships
    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    public function approvedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updatedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    public function deductions(): HasMany
    {
        return $this->hasMany(AdvanceDeduction::class, 'cash_advance_id');
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('deduction_status', 'active');
    }

    public function scopePending($query)
    {
        return $query->where('approval_status', 'pending');
    }

    public function scopeApproved($query)
    {
        return $query->where('approval_status', 'approved');
    }

    public function scopeCompleted($query)
    {
        return $query->where('deduction_status', 'completed');
    }

    public function scopeByEmployee($query, int $employeeId)
    {
        return $query->where('employee_id', $employeeId);
    }

    // Accessors
    public function getFormattedAmountRequestedAttribute(): string
    {
        return '₱' . number_format($this->amount_requested, 2);
    }

    public function getFormattedAmountApprovedAttribute(): string
    {
        return '₱' . number_format($this->amount_approved ?? 0, 2);
    }

    public function getFormattedRemainingBalanceAttribute(): string
    {
        return '₱' . number_format($this->remaining_balance ?? 0, 2);
    }

    // Boot method for auto-calculations
    protected static function boot()
    {
        parent::boot();

        // Auto-calculate remaining_balance after save
        static::saved(function ($advance) {
            if ($advance->amount_approved && $advance->remaining_balance === null) {
                $advance->remaining_balance = $advance->amount_approved;
                $advance->saveQuietly();
            }

            // Auto-calculate deduction_amount_per_period
            if ($advance->amount_approved && $advance->number_of_installments && !$advance->deduction_amount_per_period) {
                $advance->deduction_amount_per_period = $advance->amount_approved / $advance->number_of_installments;
                $advance->saveQuietly();
            }
        });
    }
}
```

**Subtask 1.2.2: Create AdvanceDeduction model**
- **File:** `app/Models/AdvanceDeduction.php`
- **Action:** CREATE
- **Relationships:** belongsTo(CashAdvance), belongsTo(PayrollPeriod), belongsTo(EmployeePayrollCalculation)

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AdvanceDeduction extends Model
{
    use HasFactory;

    protected $table = 'advance_deductions';

    protected $fillable = [
        'cash_advance_id',
        'payroll_period_id',
        'employee_payroll_calculation_id',
        'installment_number',
        'deduction_amount',
        'remaining_balance_after',
        'is_deducted',
        'deducted_at',
        'deduction_notes',
    ];

    protected $casts = [
        'deduction_amount' => 'decimal:2',
        'remaining_balance_after' => 'decimal:2',
        'is_deducted' => 'boolean',
        'deducted_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Relationships
    public function cashAdvance(): BelongsTo
    {
        return $this->belongsTo(CashAdvance::class);
    }

    public function payrollPeriod(): BelongsTo
    {
        return $this->belongsTo(PayrollPeriod::class);
    }

    public function employeePayrollCalculation(): BelongsTo
    {
        return $this->belongsTo(EmployeePayrollCalculation::class);
    }

    // Scopes
    public function scopeDeducted($query)
    {
        return $query->where('is_deducted', true);
    }

    public function scopePending($query)
    {
        return $query->where('is_deducted', false);
    }
}
```

**Subtask 1.2.3: Update Employee model**
- **File:** `app/Models/Employee.php`
- **Action:** MODIFY
- **Change:** Add hasMany(CashAdvance) relationship

```php
// Add to Employee model
public function cashAdvances(): HasMany
{
    return $this->hasMany(CashAdvance::class);
}

public function activeCashAdvances(): HasMany
{
    return $this->cashAdvances()->where('deduction_status', 'active');
}
```

#### Task 1.3: Create Model Factories and Seeders

**Subtask 1.3.1: Create CashAdvanceFactory**
- **File:** `database/factories/CashAdvanceFactory.php`
- **Action:** CREATE
- **Purpose:** Generate test data for development and testing

```php
<?php

namespace Database\Factories;

use App\Models\CashAdvance;
use App\Models\Employee;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class CashAdvanceFactory extends Factory
{
    protected $model = CashAdvance::class;

    public function definition(): array
    {
        $advanceTypes = ['cash_advance', 'medical_advance', 'travel_advance', 'emergency_advance'];
        $amountRequested = fake()->randomFloat(2, 5000, 50000);
        
        return [
            'advance_number' => 'ADV-2026-' . str_pad(fake()->unique()->numberBetween(1, 9999), 4, '0', STR_PAD_LEFT),
            'employee_id' => Employee::factory(),
            'advance_type' => fake()->randomElement($advanceTypes),
            'amount_requested' => $amountRequested,
            'purpose' => fake()->sentence(10),
            'requested_date' => fake()->dateTimeBetween('-30 days', 'now'),
            'priority_level' => fake()->randomElement(['normal', 'urgent']),
            'approval_status' => 'pending',
            'deduction_status' => 'pending',
            'created_by' => User::factory(),
        ];
    }

    public function approved(): static
    {
        return $this->state(fn (array $attributes) => [
            'approval_status' => 'approved',
            'amount_approved' => $attributes['amount_requested'],
            'approved_by' => User::factory(),
            'approved_at' => fake()->dateTimeBetween('-20 days', 'now'),
            'deduction_status' => 'active',
            'deduction_schedule' => 'installments',
            'number_of_installments' => fake()->numberBetween(2, 6),
        ]);
    }

    public function completed(): static
    {
        return $this->state(fn (array $attributes) => [
            'approval_status' => 'approved',
            'amount_approved' => $attributes['amount_requested'],
            'approved_by' => User::factory(),
            'approved_at' => fake()->dateTimeBetween('-60 days', '-30 days'),
            'deduction_status' => 'completed',
            'total_deducted' => $attributes['amount_requested'],
            'remaining_balance' => 0,
            'completed_at' => fake()->dateTimeBetween('-10 days', 'now'),
            'completion_reason' => 'fully_paid',
        ]);
    }
}
```

**Subtask 1.3.2: Create CashAdvanceSeeder**
- **File:** `database/seeders/CashAdvanceSeeder.php`
- **Action:** CREATE
- **Purpose:** Seed sample advances for testing

```php
<?php

namespace Database\Seeders;

use App\Models\CashAdvance;
use App\Models\Employee;
use App\Models\User;
use Illuminate\Database\Seeder;

class CashAdvanceSeeder extends Seeder
{
    public function run(): void
    {
        // Get some employees and users
        $employees = Employee::take(20)->get();
        $hrManager = User::whereHas('roles', fn($q) => $q->where('name', 'hr_manager'))->first();

        foreach ($employees as $employee) {
            // Pending advance
            CashAdvance::factory()->create([
                'employee_id' => $employee->id,
                'created_by' => $hrManager->id ?? 1,
            ]);

            // Approved active advance (50% chance)
            if (fake()->boolean(50)) {
                CashAdvance::factory()->approved()->create([
                    'employee_id' => $employee->id,
                    'created_by' => $hrManager->id ?? 1,
                    'approved_by' => $hrManager->id ?? 1,
                ]);
            }

            // Completed advance (30% chance)
            if (fake()->boolean(30)) {
                CashAdvance::factory()->completed()->create([
                    'employee_id' => $employee->id,
                    'created_by' => $hrManager->id ?? 1,
                    'approved_by' => $hrManager->id ?? 1,
                ]);
            }
        }
    }
}
```

---

### **Phase 2: Core Services & Business Logic (Week 2: Feb 12-18)**

#### Task 2.1: Create AdvanceManagementService

**File:** `app/Services/Payroll/AdvanceManagementService.php`
- **Action:** CREATE
- **Responsibility:** Core business logic for advance management
- **Methods:**
  - `createAdvanceRequest()` - Create new advance request
  - `approveAdvance()` - Approve advance with schedule
  - `rejectAdvance()` - Reject advance with reason
  - `cancelAdvance()` - Cancel advance (before or after approval)
  - `checkEmployeeEligibility()` - Validate if employee can request advance
  - `calculateMaxAdvanceAmount()` - Calculate max eligible amount
  - `generateAdvanceNumber()` - Auto-generate unique advance number
  - `scheduleDeductions()` - Create advance_deductions records

```php
<?php

namespace App\Services\Payroll;

use App\Models\CashAdvance;
use App\Models\AdvanceDeduction;
use App\Models\Employee;
use App\Models\User;
use App\Models\PayrollPeriod;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class AdvanceManagementService
{
    /**
     * Create a new advance request
     */
    public function createAdvanceRequest(array $data, User $requestor): CashAdvance
    {
        // Validate eligibility
        $employee = Employee::findOrFail($data['employee_id']);
        $eligibility = $this->checkEmployeeEligibility($employee);
        
        if (!$eligibility['eligible']) {
            throw new \Exception($eligibility['reason']);
        }

        // Validate amount
        $maxAmount = $this->calculateMaxAdvanceAmount($employee);
        if ($data['amount_requested'] > $maxAmount) {
            throw new \Exception("Requested amount exceeds maximum eligible advance of ₱{$maxAmount}");
        }

        // Generate advance number
        $advanceNumber = $this->generateAdvanceNumber();

        // Create advance
        $advance = CashAdvance::create([
            'advance_number' => $advanceNumber,
            'employee_id' => $data['employee_id'],
            'advance_type' => $data['advance_type'],
            'amount_requested' => $data['amount_requested'],
            'purpose' => $data['purpose'],
            'requested_date' => $data['requested_date'] ?? now(),
            'priority_level' => $data['priority_level'] ?? 'normal',
            'supporting_documents' => $data['supporting_documents'] ?? [],
            'approval_status' => 'pending',
            'deduction_status' => 'pending',
            'created_by' => $requestor->id,
        ]);

        Log::info("Cash advance request created", [
            'advance_number' => $advanceNumber,
            'employee_id' => $employee->id,
            'amount' => $data['amount_requested'],
        ]);

        return $advance;
    }

    /**
     * Approve cash advance and schedule deductions
     */
    public function approveAdvance(CashAdvance $advance, array $approvalData, User $approver): CashAdvance
    {
        DB::beginTransaction();
        try {
            // Update advance with approval details
            $advance->update([
                'approval_status' => 'approved',
                'amount_approved' => $approvalData['amount_approved'],
                'approved_by' => $approver->id,
                'approved_at' => now(),
                'approval_notes' => $approvalData['approval_notes'] ?? null,
                'deduction_status' => 'active',
                'deduction_schedule' => $approvalData['deduction_schedule'],
                'number_of_installments' => $approvalData['number_of_installments'],
                'deduction_amount_per_period' => $approvalData['amount_approved'] / $approvalData['number_of_installments'],
                'remaining_balance' => $approvalData['amount_approved'],
                'updated_by' => $approver->id,
            ]);

            // Schedule deductions for future payroll periods
            $this->scheduleDeductions($advance);

            DB::commit();

            Log::info("Cash advance approved", [
                'advance_number' => $advance->advance_number,
                'approved_amount' => $approvalData['amount_approved'],
                'approver' => $approver->name,
            ]);

            return $advance->fresh();
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Failed to approve cash advance", [
                'advance_id' => $advance->id,
                'error' => $e->getMessage(),
            ]);
            throw $e;
        }
    }

    /**
     * Reject cash advance
     */
    public function rejectAdvance(CashAdvance $advance, string $reason, User $rejector): CashAdvance
    {
        $advance->update([
            'approval_status' => 'rejected',
            'rejection_reason' => $reason,
            'approved_by' => $rejector->id,
            'approved_at' => now(),
            'deduction_status' => 'cancelled',
            'updated_by' => $rejector->id,
        ]);

        Log::info("Cash advance rejected", [
            'advance_number' => $advance->advance_number,
            'reason' => $reason,
            'rejector' => $rejector->name,
        ]);

        return $advance;
    }

    /**
     * Check if employee is eligible for cash advance
     */
    public function checkEmployeeEligibility(Employee $employee): array
    {
        // Rule 1: Employee must be active
        if ($employee->employment_status !== 'active') {
            return [
                'eligible' => false,
                'reason' => 'Employee is not active',
            ];
        }

        // Rule 2: Employee must be regular/permanent (configurable)
        if ($employee->employee_type === 'probationary') {
            return [
                'eligible' => false,
                'reason' => 'Probationary employees are not eligible for advances',
            ];
        }

        // Rule 3: Check active advances limit (max 2 active)
        $activeAdvancesCount = $employee->activeCashAdvances()->count();
        if ($activeAdvancesCount >= 2) {
            return [
                'eligible' => false,
                'reason' => 'Employee already has maximum active advances (2)',
            ];
        }

        // Rule 4: Check pending advances (max 1 pending)
        $pendingAdvancesCount = $employee->cashAdvances()->where('approval_status', 'pending')->count();
        if ($pendingAdvancesCount >= 1) {
            return [
                'eligible' => false,
                'reason' => 'Employee already has a pending advance request',
            ];
        }

        return [
            'eligible' => true,
            'reason' => null,
        ];
    }

    /**
     * Calculate maximum advance amount employee can request
     */
    public function calculateMaxAdvanceAmount(Employee $employee): float
    {
        // Get employee's basic monthly salary
        $basicSalary = $employee->payrollInfo->basic_salary ?? 0;

        // Maximum advance = 50% of basic salary (configurable)
        $maxPercentage = 0.50; // 50%
        $maxAdvance = $basicSalary * $maxPercentage;

        // Subtract total active advance balances
        $activeAdvanceBalance = $employee->activeCashAdvances()->sum('remaining_balance');
        $availableAdvance = $maxAdvance - $activeAdvanceBalance;

        return max(0, $availableAdvance);
    }

    /**
     * Generate unique advance number
     */
    public function generateAdvanceNumber(): string
    {
        $year = date('Y');
        $month = date('m');
        $prefix = "ADV-{$year}{$month}-";

        // Get last advance number for this month
        $lastAdvance = CashAdvance::where('advance_number', 'like', "{$prefix}%")
            ->orderBy('advance_number', 'desc')
            ->first();

        if ($lastAdvance) {
            $lastNumber = (int) substr($lastAdvance->advance_number, -4);
            $nextNumber = str_pad($lastNumber + 1, 4, '0', STR_PAD_LEFT);
        } else {
            $nextNumber = '0001';
        }

        return $prefix . $nextNumber;
    }

    /**
     * Schedule deductions for approved advance
     */
    private function scheduleDeductions(CashAdvance $advance): void
    {
        // Get next N payroll periods
        $upcomingPeriods = PayrollPeriod::where('pay_date', '>=', now())
            ->orderBy('pay_date', 'asc')
            ->take($advance->number_of_installments)
            ->get();

        if ($upcomingPeriods->count() < $advance->number_of_installments) {
            throw new \Exception("Not enough upcoming payroll periods to schedule deductions");
        }

        $remainingBalance = $advance->amount_approved;

        foreach ($upcomingPeriods as $index => $period) {
            $installmentNumber = $index + 1;
            $deductionAmount = $advance->deduction_amount_per_period;

            // Last installment might have rounding adjustment
            if ($installmentNumber === $advance->number_of_installments) {
                $deductionAmount = $remainingBalance;
            }

            $remainingBalance -= $deductionAmount;

            AdvanceDeduction::create([
                'cash_advance_id' => $advance->id,
                'payroll_period_id' => $period->id,
                'installment_number' => $installmentNumber,
                'deduction_amount' => $deductionAmount,
                'remaining_balance_after' => max(0, $remainingBalance),
                'is_deducted' => false,
            ]);
        }

        Log::info("Deductions scheduled for advance", [
            'advance_number' => $advance->advance_number,
            'installments' => $advance->number_of_installments,
        ]);
    }

    /**
     * Cancel cash advance (before or after approval)
     */
    public function cancelAdvance(CashAdvance $advance, string $reason, User $canceller): CashAdvance
    {
        // Can only cancel if not completed
        if ($advance->deduction_status === 'completed') {
            throw new \Exception("Cannot cancel completed advance");
        }

        // If active, check if any deductions already made
        if ($advance->deduction_status === 'active' && $advance->total_deducted > 0) {
            throw new \Exception("Cannot cancel advance with deductions already made. Consider early repayment instead.");
        }

        $advance->update([
            'approval_status' => 'cancelled',
            'deduction_status' => 'cancelled',
            'completion_reason' => 'cancelled',
            'completed_at' => now(),
            'updated_by' => $canceller->id,
        ]);

        // Delete scheduled deductions
        $advance->deductions()->delete();

        Log::info("Cash advance cancelled", [
            'advance_number' => $advance->advance_number,
            'reason' => $reason,
            'canceller' => $canceller->name,
        ]);

        return $advance;
    }
}
```

#### Task 2.2: Create AdvanceDeductionService

**File:** `app/Services/Payroll/AdvanceDeductionService.php`
- **Action:** CREATE
- **Responsibility:** Handle advance deductions during payroll calculation
- **Methods:**
  - `getActiveDeductionsForPeriod()` - Get all pending deductions for payroll period
  - `calculateDeductionForEmployee()` - Calculate deduction amount for employee
  - `processDeduction()` - Apply deduction to payroll calculation
  - `handleInsufficientNetPay()` - Handle case when net pay < deduction amount
  - `completeAdvance()` - Mark advance as completed when fully paid

```php
<?php

namespace App\Services\Payroll;

use App\Models\CashAdvance;
use App\Models\AdvanceDeduction;
use App\Models\Employee;
use App\Models\PayrollPeriod;
use App\Models\EmployeePayrollCalculation;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class AdvanceDeductionService
{
    /**
     * Get active advance deductions for a payroll period
     */
    public function getActiveDeductionsForPeriod(PayrollPeriod $period): array
    {
        $deductions = AdvanceDeduction::query()
            ->with(['cashAdvance.employee'])
            ->where('payroll_period_id', $period->id)
            ->where('is_deducted', false)
            ->whereHas('cashAdvance', fn($q) => $q->where('deduction_status', 'active'))
            ->get()
            ->groupBy('cash_advance_id');

        return $deductions->toArray();
    }

    /**
     * Calculate advance deduction for employee in current period
     */
    public function calculateDeductionForEmployee(Employee $employee, PayrollPeriod $period): float
    {
        $totalDeduction = AdvanceDeduction::query()
            ->whereHas('cashAdvance', fn($q) => $q->where('employee_id', $employee->id)->where('deduction_status', 'active'))
            ->where('payroll_period_id', $period->id)
            ->where('is_deducted', false)
            ->sum('deduction_amount');

        return $totalDeduction;
    }

    /**
     * Process advance deduction during payroll calculation
     * 
     * This is called from PayrollCalculationService during employee payroll calculation
     */
    public function processDeduction(
        Employee $employee,
        PayrollPeriod $period,
        EmployeePayrollCalculation $calculation,
        float $availableNetPay
    ): array {
        // Get pending deductions for this employee in this period
        $pendingDeductions = AdvanceDeduction::query()
            ->whereHas('cashAdvance', fn($q) => $q->where('employee_id', $employee->id)->where('deduction_status', 'active'))
            ->where('payroll_period_id', $period->id)
            ->where('is_deducted', false)
            ->with('cashAdvance')
            ->get();

        if ($pendingDeductions->isEmpty()) {
            return [
                'total_deduction' => 0,
                'deductions_applied' => 0,
                'insufficient_pay' => false,
            ];
        }

        $totalDeduction = 0;
        $deductionsApplied = 0;
        $insufficientPay = false;

        DB::beginTransaction();
        try {
            foreach ($pendingDeductions as $deduction) {
                $advance = $deduction->cashAdvance;
                $deductionAmount = $deduction->deduction_amount;

                // Check if net pay is sufficient
                if ($availableNetPay < $deductionAmount) {
                    // Partial deduction or skip
                    $insufficientPay = true;
                    $deductionAmount = $availableNetPay > 0 ? $availableNetPay : 0;

                    Log::warning("Insufficient net pay for full advance deduction", [
                        'advance_number' => $advance->advance_number,
                        'scheduled_deduction' => $deduction->deduction_amount,
                        'actual_deduction' => $deductionAmount,
                        'employee_id' => $employee->id,
                        'period_id' => $period->id,
                    ]);
                }

                if ($deductionAmount > 0) {
                    // Update deduction record
                    $deduction->update([
                        'deduction_amount' => $deductionAmount,
                        'is_deducted' => !$insufficientPay, // Only mark as fully deducted if full amount taken
                        'deducted_at' => now(),
                        'employee_payroll_calculation_id' => $calculation->id,
                        'deduction_notes' => $insufficientPay ? 'Partial deduction due to insufficient net pay' : null,
                    ]);

                    // Update advance balance
                    $advance->increment('total_deducted', $deductionAmount);
                    $advance->decrement('remaining_balance', $deductionAmount);

                    if (!$insufficientPay) {
                        $advance->increment('installments_completed');
                    }

                    // Check if advance is fully paid
                    if ($advance->remaining_balance <= 0.01) { // Allow 1 cent tolerance for rounding
                        $this->completeAdvance($advance);
                    }

                    $totalDeduction += $deductionAmount;
                    $deductionsApplied++;
                    $availableNetPay -= $deductionAmount;
                }
            }

            DB::commit();

            return [
                'total_deduction' => $totalDeduction,
                'deductions_applied' => $deductionsApplied,
                'insufficient_pay' => $insufficientPay,
            ];
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Failed to process advance deduction", [
                'employee_id' => $employee->id,
                'period_id' => $period->id,
                'error' => $e->getMessage(),
            ]);
            throw $e;
        }
    }

    /**
     * Mark advance as completed when fully paid
     */
    private function completeAdvance(CashAdvance $advance): void
    {
        $advance->update([
            'deduction_status' => 'completed',
            'completed_at' => now(),
            'completion_reason' => 'fully_paid',
            'remaining_balance' => 0,
        ]);

        Log::info("Cash advance completed", [
            'advance_number' => $advance->advance_number,
            'employee_id' => $advance->employee_id,
            'total_paid' => $advance->amount_approved,
        ]);
    }

    /**
     * Get advance deduction summary for employee
     */
    public function getEmployeeAdvanceSummary(Employee $employee): array
    {
        $activeAdvances = $employee->activeCashAdvances()->get();

        $summary = [
            'total_active_advances' => $activeAdvances->count(),
            'total_outstanding_balance' => $activeAdvances->sum('remaining_balance'),
            'next_period_deduction' => 0,
            'advances' => [],
        ];

        foreach ($activeAdvances as $advance) {
            $nextDeduction = $advance->deductions()
                ->where('is_deducted', false)
                ->orderBy('installment_number', 'asc')
                ->first();

            $advanceData = [
                'advance_number' => $advance->advance_number,
                'amount_approved' => $advance->amount_approved,
                'remaining_balance' => $advance->remaining_balance,
                'installments_remaining' => $advance->number_of_installments - $advance->installments_completed,
                'next_deduction_amount' => $nextDeduction->deduction_amount ?? 0,
                'next_deduction_period' => $nextDeduction->payrollPeriod->name ?? 'N/A',
            ];

            $summary['advances'][] = $advanceData;
            $summary['next_period_deduction'] += $advanceData['next_deduction_amount'];
        }

        return $summary;
    }
}
```

---

### **Phase 3: Integration with Payroll Calculation (Week 2: Feb 12-18)**

#### Task 3.1: Integrate Advances into PayrollCalculationService

**File:** `app/Services/Payroll/PayrollCalculationService.php`
- **Action:** MODIFY (this service will be created in PAYROLL-TIMEKEEPING-INTEGRATION-ROADMAP Phase 3)
- **Integration Point:** Add advance deduction calculation step

```php
// In PayrollCalculationService::calculateEmployee() method
// This code will be added to the main payroll calculation flow

public function calculateEmployee(Employee $employee, PayrollPeriod $period): EmployeePayrollCalculation
{
    // ... existing basic pay, OT, deductions code ...

    // Step 8: Calculate advance deductions
    $advanceDeductionData = $this->advanceDeductionService->processDeduction(
        $employee,
        $period,
        $calculation,
        $netPayBeforeAdvances
    );

    $advanceDeduction = $advanceDeductionData['total_deduction'];

    // Step 9: Final net pay
    $netPay = $netPayBeforeAdvances - $advanceDeduction;

    // Step 10: Save calculation with advance deduction
    return EmployeePayrollCalculation::create([
        // ... existing fields ...
        'cash_advance' => $advanceDeduction,  // ✅ Field already exists in schema
        'net_pay' => $netPay,
        // ... rest of fields ...
    ]);
}
```

**Dependency:** This task requires `PayrollCalculationService` to be created first (from PAYROLL-TIMEKEEPING-INTEGRATION-ROADMAP Phase 3).

---

### **Phase 4: Controller & API Implementation (Week 3: Feb 19-25)**

#### Task 4.1: Update AdvancesController with Real Logic

**File:** `app/Http/Controllers/Payroll/AdvancesController.php`
- **Action:** MODIFY
- **Change:** Replace mock data with real database queries and service calls

```php
<?php

namespace App\Http\Controllers\Payroll;

use App\Http\Controllers\Controller;
use App\Models\CashAdvance;
use App\Models\Employee;
use App\Services\Payroll\AdvanceManagementService;
use App\Services\Payroll\AdvanceDeductionService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdvancesController extends Controller
{
    public function __construct(
        private AdvanceManagementService $advanceService,
        private AdvanceDeductionService $deductionService
    ) {}

    /**
     * Display a listing of cash advances
     */
    public function index(Request $request)
    {
        $query = CashAdvance::query()
            ->with(['employee', 'approvedBy'])
            ->latest('requested_date');

        // Apply filters
        if ($request->has('search')) {
            $search = $request->input('search');
            $query->whereHas('employee', function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%")
                  ->orWhere('employee_number', 'like', "%{$search}%");
            });
        }

        if ($request->has('approval_status')) {
            $query->where('approval_status', $request->input('approval_status'));
        }

        if ($request->has('deduction_status')) {
            $query->where('deduction_status', $request->input('deduction_status'));
        }

        if ($request->has('department_id')) {
            $query->whereHas('employee', function ($q) use ($request) {
                $q->where('department_id', $request->input('department_id'));
            });
        }

        $advances = $query->paginate(50);

        // Get employees list for request form
        $employees = Employee::where('employment_status', 'active')
            ->select('id', 'employee_number', 'first_name', 'last_name', 'department_id')
            ->with('department:id,name')
            ->get()
            ->map(fn($emp) => [
                'id' => $emp->id,
                'name' => $emp->full_name,
                'employee_number' => $emp->employee_number,
                'department' => $emp->department->name ?? 'N/A',
            ]);

        return Inertia::render('Payroll/Advances/Index', [
            'advances' => $advances,
            'filters' => $request->only(['search', 'approval_status', 'deduction_status', 'department_id']),
            'employees' => $employees,
        ]);
    }

    /**
     * Store a newly created cash advance request
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'advance_type' => 'required|in:cash_advance,medical_advance,travel_advance,equipment_advance,emergency_advance',
            'amount_requested' => 'required|numeric|min:1000|max:200000',
            'purpose' => 'required|string|min:10|max:500',
            'requested_date' => 'required|date',
            'priority_level' => 'required|in:normal,urgent',
            'supporting_documents' => 'nullable|array',
        ]);

        try {
            $advance = $this->advanceService->createAdvanceRequest($validated, auth()->user());

            return redirect()
                ->route('payroll.advances.index')
                ->with('success', "Advance request {$advance->advance_number} created successfully.");
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->withErrors(['error' => $e->getMessage()])
                ->withInput();
        }
    }

    /**
     * Approve a pending cash advance
     */
    public function approve(Request $request, int $id)
    {
        $advance = CashAdvance::findOrFail($id);

        if ($advance->approval_status !== 'pending') {
            return redirect()
                ->back()
                ->withErrors(['error' => 'Only pending advances can be approved.']);
        }

        $validated = $request->validate([
            'amount_approved' => 'required|numeric|min:1000|max:' . $advance->amount_requested,
            'deduction_schedule' => 'required|in:single_period,installments',
            'number_of_installments' => 'required|integer|min:1|max:6',
            'approval_notes' => 'nullable|string|max:500',
        ]);

        try {
            $this->advanceService->approveAdvance($advance, $validated, auth()->user());

            return redirect()
                ->route('payroll.advances.index')
                ->with('success', "Advance {$advance->advance_number} approved successfully.");
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * Reject a pending cash advance
     */
    public function reject(Request $request, int $id)
    {
        $advance = CashAdvance::findOrFail($id);

        if ($advance->approval_status !== 'pending') {
            return redirect()
                ->back()
                ->withErrors(['error' => 'Only pending advances can be rejected.']);
        }

        $validated = $request->validate([
            'rejection_reason' => 'required|string|min:10|max:500',
        ]);

        try {
            $this->advanceService->rejectAdvance($advance, $validated['rejection_reason'], auth()->user());

            return redirect()
                ->route('payroll.advances.index')
                ->with('success', "Advance {$advance->advance_number} rejected.");
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * Cancel a cash advance
     */
    public function cancel(Request $request, int $id)
    {
        $advance = CashAdvance::findOrFail($id);

        $validated = $request->validate([
            'cancellation_reason' => 'required|string|min:10|max:500',
        ]);

        try {
            $this->advanceService->cancelAdvance($advance, $validated['cancellation_reason'], auth()->user());

            return redirect()
                ->route('payroll.advances.index')
                ->with('success', "Advance {$advance->advance_number} cancelled.");
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * Get employee advance summary (AJAX endpoint)
     */
    public function getEmployeeSummary(int $employeeId)
    {
        $employee = Employee::findOrFail($employeeId);
        $eligibility = $this->advanceService->checkEmployeeEligibility($employee);
        $maxAmount = $this->advanceService->calculateMaxAdvanceAmount($employee);
        $summary = $this->deductionService->getEmployeeAdvanceSummary($employee);

        return response()->json([
            'eligibility' => $eligibility,
            'max_advance_amount' => $maxAmount,
            'summary' => $summary,
        ]);
    }
}
```

#### Task 4.2: Create Form Request Classes

**Subtask 4.2.1: Create StoreAdvanceRequest**
- **File:** `app/Http/Requests/Payroll/StoreAdvanceRequest.php`
- **Action:** CREATE

```php
<?php

namespace App\Http\Requests\Payroll;

use Illuminate\Foundation\Http\FormRequest;

class StoreAdvanceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create_cash_advances');
    }

    public function rules(): array
    {
        return [
            'employee_id' => 'required|exists:employees,id',
            'advance_type' => 'required|in:cash_advance,medical_advance,travel_advance,equipment_advance,emergency_advance',
            'amount_requested' => 'required|numeric|min:1000|max:200000',
            'purpose' => 'required|string|min:10|max:500',
            'requested_date' => 'required|date',
            'priority_level' => 'required|in:normal,urgent',
            'supporting_documents.*' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:2048',
        ];
    }

    public function messages(): array
    {
        return [
            'amount_requested.min' => 'Minimum advance amount is ₱1,000',
            'amount_requested.max' => 'Maximum advance amount is ₱200,000',
            'purpose.min' => 'Purpose must be at least 10 characters',
        ];
    }
}
```

**Subtask 4.2.2: Create ApproveAdvanceRequest**
- **File:** `app/Http/Requests/Payroll/ApproveAdvanceRequest.php`
- **Action:** CREATE

```php
<?php

namespace App\Http\Requests\Payroll;

use Illuminate\Foundation\Http\FormRequest;

class ApproveAdvanceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('approve_cash_advances');
    }

    public function rules(): array
    {
        $advance = $this->route('advance'); // Get advance from route

        return [
            'amount_approved' => [
                'required',
                'numeric',
                'min:1000',
                'max:' . $advance->amount_requested,
            ],
            'deduction_schedule' => 'required|in:single_period,installments',
            'number_of_installments' => 'required|integer|min:1|max:6',
            'approval_notes' => 'nullable|string|max:500',
        ];
    }

    public function messages(): array
    {
        return [
            'amount_approved.max' => 'Approved amount cannot exceed requested amount',
            'number_of_installments.max' => 'Maximum 6 installments allowed',
        ];
    }
}
```

---

### **Phase 5: Frontend Integration & Polish (Week 3: Feb 19-25)**

#### Task 5.1: Update Frontend Components (if needed)

**Files to Review:**
- `resources/js/pages/Payroll/Advances/Index.tsx` - **VERIFY** if handles real data correctly
- `resources/js/components/payroll/advance-request-form.tsx` - **VERIFY** form submission
- `resources/js/components/payroll/advance-approval-modal.tsx` - **VERIFY** approval/rejection flow
- `resources/js/components/payroll/advance-deduction-tracker.tsx` - **VERIFY** data display

**Action:** Review existing frontend components and update only if necessary to handle real backend data.

#### Task 5.2: Add Employee Advance Eligibility Check (Frontend)

**File:** `resources/js/pages/Payroll/Advances/Index.tsx`
- **Action:** MODIFY
- **Change:** Add AJAX call to check employee eligibility before showing request form

```tsx
// Add this function to fetch eligibility when employee selected
const checkEligibility = async (employeeId: number) => {
    try {
        const response = await fetch(`/payroll/advances/employee/${employeeId}/summary`);
        const data = await response.json();
        
        if (!data.eligibility.eligible) {
            alert(data.eligibility.reason);
            return false;
        }
        
        // Show max eligible amount
        setMaxAdvanceAmount(data.max_advance_amount);
        return true;
    } catch (error) {
        console.error('Failed to check eligibility:', error);
        return false;
    }
};
```

---

### **Phase 6: Testing & Validation (Week 3: Feb 19-25)**

#### Task 6.1: Unit Tests

**Subtask 6.1.1: Test AdvanceManagementService**
- **File:** `tests/Unit/Services/Payroll/AdvanceManagementServiceTest.php`
- **Action:** CREATE
- **Test Cases:**
  - Test advance request creation
  - Test eligibility checks (probationary, max active advances)
  - Test max advance amount calculation
  - Test advance approval with deduction scheduling
  - Test advance rejection
  - Test advance cancellation

**Subtask 6.1.2: Test AdvanceDeductionService**
- **File:** `tests/Unit/Services/Payroll/AdvanceDeductionServiceTest.php`
- **Action:** CREATE
- **Test Cases:**
  - Test deduction calculation for employee
  - Test deduction processing during payroll
  - Test insufficient net pay handling
  - Test advance completion

#### Task 6.2: Integration Tests

**Subtask 6.2.1: Test Advance Workflow End-to-End**
- **File:** `tests/Feature/Payroll/AdvanceWorkflowTest.php`
- **Action:** CREATE
- **Test Scenario:**
  1. Create employee with salary
  2. Request advance
  3. Approve advance
  4. Run payroll calculation
  5. Verify deduction applied
  6. Verify advance balance updated
  7. Complete all installments
  8. Verify advance marked as completed

**Subtask 6.2.2: Test Advance-Payroll Integration**
- **File:** `tests/Feature/Payroll/AdvancePayrollIntegrationTest.php`
- **Action:** CREATE
- **Test Scenario:**
  - Create active advances with different installment schedules
  - Run payroll calculation
  - Verify cash_advance field in employee_payroll_calculations
  - Verify net pay correctly reduced
  - Verify advance_deductions records created and marked as deducted

#### Task 6.3: Manual Testing Scenarios

**Scenario 1: Employee Requests Advance**
- Login as HR Staff or Employee (future)
- Navigate to Advances page
- Click "Request Advance"
- Fill form with valid data
- Submit → Verify advance created with "pending" status

**Scenario 2: HR Manager Approves Advance**
- Login as HR Manager
- Navigate to Advances page
- Filter by "Pending"
- Click "Approve" on advance
- Set approval amount, schedule, installments
- Submit → Verify advance status changes to "approved" and "active"
- Verify advance_deductions records created

**Scenario 3: Payroll Deduction**
- Create approved advance with single installment
- Run payroll calculation for period
- Verify employee_payroll_calculations.cash_advance = deduction amount
- Verify net_pay reduced by deduction
- Verify advance_deductions.is_deducted = true
- Verify advance remaining_balance updated

**Scenario 4: Insufficient Net Pay**
- Create approved advance with high deduction amount
- Employee has low net pay (after deductions)
- Run payroll calculation
- Verify partial deduction or skip
- Verify advance_deductions.deduction_notes explains partial deduction

**Scenario 5: Advance Completion**
- Create advance with 3 installments
- Run payroll for 3 consecutive periods
- After 3rd deduction, verify:
  - advance.deduction_status = "completed"
  - advance.remaining_balance = 0
  - advance.completed_at set

---

## 📋 Definition of Done

### Phase 1: Database Foundation
- ✅ employee_cash_advances table created with all fields and indexes
- ✅ advance_deductions table created with foreign keys
- ✅ CashAdvance model created with relationships and scopes
- ✅ AdvanceDeduction model created
- ✅ Employee model updated with cashAdvances relationship
- ✅ Factories and seeders functional

### Phase 2: Core Services
- ✅ AdvanceManagementService implements all methods
- ✅ AdvanceDeductionService implements deduction processing
- ✅ Eligibility checks work correctly
- ✅ Deduction scheduling creates correct records
- ✅ Error handling for all edge cases

### Phase 3: Payroll Integration
- ✅ PayrollCalculationService calls AdvanceDeductionService
- ✅ cash_advance field populated in employee_payroll_calculations
- ✅ Net pay correctly reduced by advance deductions
- ✅ Advance balance updated after each deduction

### Phase 4: Controller & API
- ✅ AdvancesController uses real database queries (no mock data)
- ✅ All CRUD operations work correctly
- ✅ Form validation working
- ✅ Authorization checks in place

### Phase 5: Frontend
- ✅ Frontend displays real data from backend
- ✅ Request form submits correctly
- ✅ Approval/rejection workflows functional
- ✅ Deduction tracker shows accurate data

### Phase 6: Testing
- ✅ All unit tests pass
- ✅ Integration tests pass
- ✅ Manual test scenarios completed
- ✅ Edge cases handled (insufficient pay, cancellations)

---

## 🔗 Integration Dependencies

### Dependencies on Other Modules (Must Wait For)

1. **Payroll Periods Table** (from PAYROLL-TIMEKEEPING-INTEGRATION-ROADMAP Phase 1)
   - Status: ⏳ **BLOCKING** - Need payroll_periods table for deduction scheduling
   - Action: Wait for payroll_periods migration to be created

2. **EmployeePayrollCalculation Table** (from PAYROLL-TIMEKEEPING-INTEGRATION-ROADMAP Phase 1)
   - Status: ⏳ **BLOCKING** - Need employee_payroll_calculations table for integration
   - Action: Wait for table creation with cash_advance field

3. **PayrollCalculationService** (from PAYROLL-TIMEKEEPING-INTEGRATION-ROADMAP Phase 3)
   - Status: ⏳ **BLOCKING** - Need to integrate advance deduction into payroll calculation flow
   - Action: Wait for service creation, then add advance deduction step

### Can Be Implemented Independently

✅ **Phase 1 (Database)** - Can start immediately after payroll base schema exists  
✅ **Phase 2 (Services)** - Can implement business logic independently  
⏳ **Phase 3 (Integration)** - Requires PayrollCalculationService to exist  
✅ **Phase 4 (Controller)** - Can implement independently  
✅ **Phase 5 (Frontend)** - Can verify with existing frontend  
✅ **Phase 6 (Testing)** - Can write tests alongside development  

---

## 📊 Timeline Summary

| Phase | Duration | Dates | Dependencies | Deliverable |
|-------|----------|-------|--------------|-------------|
| **Phase 1** | 2 days | Feb 5-6 | Payroll base schema | Database schema, models |
| **Phase 2** | 3 days | Feb 7-11 | None | Services implemented |
| **Phase 3** | 2 days | Feb 12-13 | PayrollCalculationService | Payroll integration |
| **Phase 4** | 3 days | Feb 14-18 | None | Controller with real data |
| **Phase 5** | 2 days | Feb 19-20 | None | Frontend verification |
| **Phase 6** | 3 days | Feb 21-25 | None | Testing complete |

**Total Duration:** 15 days (3 weeks)  
**Target Completion:** February 25, 2026

---

## ✅ Next Steps

1. **Review and approve this implementation plan** with team
2. **Confirm all clarifications** (Q1-Q5) with stakeholders
3. **Verify PAYROLL-TIMEKEEPING-INTEGRATION-ROADMAP Phase 1 complete** (payroll base schema)
4. **Start Phase 1** - Create database migrations and models
5. **Set up testing environment** - Seed with test employees and salary data

---

**Document Version:** 1.0  
**Last Updated:** February 5, 2026  
**Next Review:** After Phase 1 completion (February 6, 2026)
