# SyncingSteel System - Workflow Documentation

## Overview
This directory contains comprehensive workflow documentation for all user roles in the SyncingSteel HRIS system.

## 📚 Documentation Structure

### **Main Document**
- **[System Overview](./00-system-overview.md)** - High-level system architecture and role responsibilities

### **Role-Based Workflows**
1. **[Superadmin Workflow](./01-superadmin-workflow.md)** - System monitoring, server management, and emergency access
2. **[Office Admin Workflow](./02-office-admin-workflow.md)** - Company setup and business rules configuration
3. **[HR Manager Workflow](./03-hr-manager-workflow.md)** - Approval workflows and oversight
4. **[HR Staff Workflow](./04-hr-staff-workflow.md)** - Day-to-day HR operations and data entry
5. **[Payroll Officer Workflow](./05-payroll-officer-workflow.md)** - Payroll processing and government compliance

### **Process Workflows**
- **[Leave Request Approval](./processes/leave-request-approval.md)** - Multi-level leave approval process
- **[Payroll Processing](./processes/payroll-processing.md)** - Complete payroll cycle
- **[Employee Onboarding](./processes/employee-onboarding.md)** - From hire to active employee
- **[Performance Appraisal](./processes/performance-appraisal.md)** - Review and approval process
- **[Workforce Management](./processes/workforce-management.md)** - Shift scheduling and rotations

### **Integration Guides**
- **[RFID Integration](./integrations/rfid-integration.md)** - Timekeeping event bus architecture
- **[ATS Integration](./integrations/ats-integration.md)** - Applicant tracking and hiring pipeline

## 🎯 Quick Navigation

### By User Role
- **I am a Superadmin** → [View my workflows](./01-superadmin-workflow.md)
- **I am an Office Admin** → [View my workflows](./02-office-admin-workflow.md)
- **I am an HR Manager** → [View my workflows](./03-hr-manager-workflow.md)
- **I am HR Staff** → [View my workflows](./04-hr-staff-workflow.md)
- **I am a Payroll Officer** → [View my workflows](./05-payroll-officer-workflow.md)

### By Task
- **Setting up the system** → [Office Admin Workflow](./02-office-admin-workflow.md)
- **Approving leave requests** → [HR Manager Workflow](./03-hr-manager-workflow.md) | [Leave Approval Process](./processes/leave-request-approval.md)
- **Processing payroll** → [Payroll Officer Workflow](./05-payroll-officer-workflow.md) | [Payroll Process](./processes/payroll-processing.md)
- **Hiring employees** → [HR Staff Workflow](./04-hr-staff-workflow.md#ats-module)
- **Managing schedules** → [HR Staff Workflow](./04-hr-staff-workflow.md#workforce-management)

## 📊 Viewing Diagrams

### Option 1: Mermaid Live Editor (Recommended)
1. Copy any Mermaid diagram from the documentation
2. Go to https://mermaid.live/
3. Paste and view the rendered diagram

### Option 2: VS Code (Local Development)
1. Install **Markdown Preview Mermaid Support** extension
2. Open any markdown file
3. Press `Ctrl+Shift+V` to preview with diagrams

### Option 3: Generate Static Images
```powershell
# Install Mermaid CLI
npm install -g @mermaid-js/mermaid-cli

# Generate images from markdown
mmdc -i 01-superadmin-workflow.md -o superadmin-workflow.png
```

## 🏗️ System Architecture

### Deployment
- **Type**: On-premise HRIS
- **Server**: Company server (internal use only)
- **Access**: Office staff with role-based permissions

### User Access
- **Office Staff**: Direct system access via web interface
- **Supervisors**: Submit paper records to HR Staff (no system access currently)
- **Employees**: Submit requests via paper/email to HR Staff (no system access currently)

### Integration Points
- **RFID Timekeeping**: Card tap → Edge device → Event bus → Timekeeping/Payroll/Notifications
- **ATS Sources**: Facebook, in-person applications, future: public job board
- **Payment Methods**: Current: Cash only | Future: Bank transfer, e-wallet

## 📋 Access Control Matrix

| Module | Superadmin | Office Admin | HR Manager | HR Staff | Payroll Officer |
|--------|------------|--------------|------------|----------|-----------------|
| System Management | Full | ❌ | ❌ | ❌ | ❌ |
| Company Setup | Emergency | Full | ❌ | ❌ | ❌ |
| Business Rules | Emergency | Full | ❌ | ❌ | ❌ |
| Employee Mgmt | Emergency | View | View | Full | View |
| ATS/Recruitment | Emergency | View | Approve | Full | ❌ |
| Onboarding | Emergency | View | Approve | Full | ❌ |
| Workforce Mgmt | Emergency | View | Review | Full | ❌ |
| Timekeeping | Emergency | View | View | Full | View |
| Appraisal | Emergency | View | Approve | Full | ❌ |
| Leave Mgmt | Emergency | Final Approval | Approve | Input | ❌ |
| Payroll | Emergency | View | View | ❌ | Full |
| Govt Compliance | Emergency | View | ❌ | ❌ | Full |
| Payments | Emergency | View | ❌ | ❌ | Full |

**Legend**: Full = Full Access | View = View Only | Approve = Approval Rights | Emergency = Emergency Access Only

## 🔗 Related Documentation
- [System Architecture Plan](../SYNCINGSTEEL_ARCHITECTURE_PLAN.md)
- [Database Schema](../DATABASE_SCHEMA.md)
- [RBAC Matrix](../RBAC_MATRIX.md)
- [HR Module Architecture](../HR_MODULE_ARCHITECTURE.md)
- [Payroll Module Architecture](../PAYROLL_MODULE_ARCHITECTURE.md)
- [Workforce Management Module](../WORKFORCE_MANAGEMENT_MODULE.md)

---

**Version**: 2.0  
**Last Updated**: November 29, 2025  
**Maintained By**: Development Team
