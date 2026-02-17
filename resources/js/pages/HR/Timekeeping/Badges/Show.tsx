import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import { BadgeDetailView } from '@/components/hr/badge-detail-view';
import { BadgeUsageTimeline } from '@/components/hr/badge-usage-timeline';
import { BadgeAnalytics } from '@/components/hr/badge-analytics';
import { format, subDays } from 'date-fns';

interface Badge {
    id: string;
    card_uid: string;
    employee_id: string;
    employee_name: string;
    employee_photo?: string;
    department: string;
    position: string;
    card_type: 'mifare' | 'desfire' | 'em4100';
    issued_at: string;
    issued_by: string;
    expires_at: string | null;
    is_active: boolean;
    last_used_at: string | null;
    usage_count: number;
    status: 'active' | 'inactive' | 'lost' | 'stolen' | 'expired' | 'replaced';
    first_scan_at?: string;
    most_used_device?: string;
    employee_status?: 'active' | 'on_leave' | 'inactive';
}

export default function ShowBadge() {
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    // Mock badge data for Phase 1
    const [mockBadge] = useState<Badge>({
        id: '1',
        card_uid: '04:3A:B2:C5:D8',
        employee_id: 'EMP-2024-001',
        employee_name: 'Juan Dela Cruz',
        employee_photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Juan',
        department: 'Operations',
        position: 'Warehouse Supervisor',
        card_type: 'mifare',
        issued_at: '2024-01-15T10:00:00',
        issued_by: 'HR Manager',
        expires_at: '2026-01-15',
        is_active: true,
        last_used_at: '2024-02-12T16:45:00',
        usage_count: 1247,
        status: 'active',
        first_scan_at: '2024-01-15T08:10:00',
        most_used_device: 'Main Gate (Gate-01)',
        employee_status: 'active',
    });

    // Mock usage timeline data (last 20 scans)
    const [mockScans] = useState([
        {
            id: '1',
            timestamp: '2024-02-12T16:45:00',
            device_id: 'GATE-01',
            device_name: 'Main Gate (Gate-01)',
            event_type: 'time_out' as const,
            duration_minutes: undefined,
        },
        {
            id: '2',
            timestamp: '2024-02-12T08:05:00',
            device_id: 'GATE-01',
            device_name: 'Main Gate (Gate-01)',
            event_type: 'time_in' as const,
            duration_minutes: 515,
        },
        {
            id: '3',
            timestamp: '2024-02-11T17:30:00',
            device_id: 'GATE-01',
            device_name: 'Main Gate (Gate-01)',
            event_type: 'time_out' as const,
            duration_minutes: undefined,
        },
        {
            id: '4',
            timestamp: '2024-02-11T08:10:00',
            device_id: 'LOADING-DOCK',
            device_name: 'Loading Dock (LOAD-02)',
            event_type: 'time_in' as const,
            duration_minutes: 520,
        },
        {
            id: '5',
            timestamp: '2024-02-10T16:00:00',
            device_id: 'CAFETERIA',
            device_name: 'Cafeteria (CAF-03)',
            event_type: 'break_end' as const,
            duration_minutes: 45,
        },
        {
            id: '6',
            timestamp: '2024-02-10T15:15:00',
            device_id: 'CAFETERIA',
            device_name: 'Cafeteria (CAF-03)',
            event_type: 'break_start' as const,
            duration_minutes: undefined,
        },
        {
            id: '7',
            timestamp: '2024-02-10T08:20:00',
            device_id: 'GATE-01',
            device_name: 'Main Gate (Gate-01)',
            event_type: 'time_in' as const,
            duration_minutes: 520,
        },
        {
            id: '8',
            timestamp: '2024-02-09T17:00:00',
            device_id: 'LOADING-DOCK',
            device_name: 'Loading Dock (LOAD-02)',
            event_type: 'time_out' as const,
            duration_minutes: undefined,
        },
        {
            id: '9',
            timestamp: '2024-02-09T08:15:00',
            device_id: 'GATE-01',
            device_name: 'Main Gate (Gate-01)',
            event_type: 'time_in' as const,
            duration_minutes: 525,
        },
        {
            id: '10',
            timestamp: '2024-02-08T16:45:00',
            device_id: 'GATE-01',
            device_name: 'Main Gate (Gate-01)',
            event_type: 'time_out' as const,
            duration_minutes: undefined,
        },
        {
            id: '11',
            timestamp: '2024-02-08T08:00:00',
            device_id: 'GATE-01',
            device_name: 'Main Gate (Gate-01)',
            event_type: 'time_in' as const,
            duration_minutes: 525,
        },
        {
            id: '12',
            timestamp: '2024-02-07T16:30:00',
            device_id: 'LOADING-DOCK',
            device_name: 'Loading Dock (LOAD-02)',
            event_type: 'time_out' as const,
            duration_minutes: undefined,
        },
        {
            id: '13',
            timestamp: '2024-02-07T08:30:00',
            device_id: 'LOADING-DOCK',
            device_name: 'Loading Dock (LOAD-02)',
            event_type: 'time_in' as const,
            duration_minutes: 480,
        },
        {
            id: '14',
            timestamp: '2024-02-06T17:00:00',
            device_id: 'GATE-01',
            device_name: 'Main Gate (Gate-01)',
            event_type: 'time_out' as const,
            duration_minutes: undefined,
        },
        {
            id: '15',
            timestamp: '2024-02-06T08:10:00',
            device_id: 'GATE-01',
            device_name: 'Main Gate (Gate-01)',
            event_type: 'time_in' as const,
            duration_minutes: 530,
        },
        {
            id: '16',
            timestamp: '2024-02-05T16:45:00',
            device_id: 'CAFETERIA',
            device_name: 'Cafeteria (CAF-03)',
            event_type: 'time_out' as const,
            duration_minutes: undefined,
        },
        {
            id: '17',
            timestamp: '2024-02-05T12:30:00',
            device_id: 'CAFETERIA',
            device_name: 'Cafeteria (CAF-03)',
            event_type: 'break_end' as const,
            duration_minutes: 60,
        },
        {
            id: '18',
            timestamp: '2024-02-05T11:30:00',
            device_id: 'CAFETERIA',
            device_name: 'Cafeteria (CAF-03)',
            event_type: 'break_start' as const,
            duration_minutes: undefined,
        },
        {
            id: '19',
            timestamp: '2024-02-05T08:05:00',
            device_id: 'GATE-01',
            device_name: 'Main Gate (Gate-01)',
            event_type: 'time_in' as const,
            duration_minutes: 525,
        },
        {
            id: '20',
            timestamp: '2024-02-04T16:55:00',
            device_id: 'GATE-01',
            device_name: 'Main Gate (Gate-01)',
            event_type: 'time_out' as const,
            duration_minutes: undefined,
        },
    ]);

    // Mock analytics data - 7 day daily scans
    const [mockDailyScans] = useState([
        { date: format(subDays(new Date(), 6), 'MMM dd'), scans: 2 },
        { date: format(subDays(new Date(), 5), 'MMM dd'), scans: 2 },
        { date: format(subDays(new Date(), 4), 'MMM dd'), scans: 2 },
        { date: format(subDays(new Date(), 3), 'MMM dd'), scans: 2 },
        { date: format(subDays(new Date(), 2), 'MMM dd'), scans: 3 },
        { date: format(subDays(new Date(), 1), 'MMM dd'), scans: 2 },
        { date: format(new Date(), 'MMM dd'), scans: 1 },
    ]);

    // Mock hourly peak data
    const [mockHourlyPeaks] = useState([
        { hour: 0, scans: 0 },
        { hour: 1, scans: 0 },
        { hour: 2, scans: 0 },
        { hour: 3, scans: 0 },
        { hour: 4, scans: 0 },
        { hour: 5, scans: 0 },
        { hour: 6, scans: 0 },
        { hour: 7, scans: 2 },
        { hour: 8, scans: 18 },
        { hour: 9, scans: 25 },
        { hour: 10, scans: 20 },
        { hour: 11, scans: 15 },
        { hour: 12, scans: 8 },
        { hour: 13, scans: 12 },
        { hour: 14, scans: 10 },
        { hour: 15, scans: 5 },
        { hour: 16, scans: 28 },
        { hour: 17, scans: 45 },
        { hour: 18, scans: 30 },
        { hour: 19, scans: 5 },
        { hour: 20, scans: 2 },
        { hour: 21, scans: 0 },
        { hour: 22, scans: 0 },
        { hour: 23, scans: 0 },
    ]);

    // Mock device usage data
    const [mockDeviceUsage] = useState([
        { device: 'Main Gate (Gate-01)', scans: 687 },
        { device: 'Loading Dock (LOAD-02)', scans: 412 },
        { device: 'Cafeteria (CAF-03)', scans: 148 },
    ]);

    const breadcrumbs = [
        { title: 'HR', href: '/hr' },
        { title: 'Timekeeping', href: '/hr/timekeeping' },
        { title: 'RFID Badges', href: '/hr/timekeeping/badges' },
        { title: 'Badge Details', href: '#' },
    ];

    const handleLoadMore = () => {
        setIsLoadingMore(true);
        // Simulate loading more scans
        setTimeout(() => {
            setIsLoadingMore(false);
        }, 1000);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Badge Details" />
            
            <div className="container mx-auto py-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/hr/timekeeping/badges">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Badges
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold">Badge Details</h1>
                            <p className="text-muted-foreground mt-1">
                                {mockBadge.employee_name}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Phase 1 Mock Data Notice */}
                <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                        This badge detail view is using mock data for Phase 1. In Phase 2, real
                        data will be pulled from the RFID ledger and database.
                    </AlertDescription>
                </Alert>

                {/* Badge Detail View - Subtask 1.4.1 */}
                <BadgeDetailView
                    badge={mockBadge}
                    onPrint={() => console.log('Print badge sheet')}
                    onReplace={() => console.log('Replace badge')}
                    onExtend={() => console.log('Extend expiration')}
                    onDeactivate={() => console.log('Deactivate badge')}
                />

                {/* Usage Timeline - Subtask 1.4.2 */}
                <BadgeUsageTimeline
                    badge_id={mockBadge.id}
                    scans={mockScans}
                    onLoadMore={handleLoadMore}
                    hasMore={true}
                    isLoading={isLoadingMore}
                />

                {/* Usage Analytics - Subtask 1.4.3 */}
                <BadgeAnalytics
                    dailyScans={mockDailyScans}
                    hourlyPeaks={mockHourlyPeaks}
                    deviceUsage={mockDeviceUsage}
                />
            </div>
        </AppLayout>
    );
}
