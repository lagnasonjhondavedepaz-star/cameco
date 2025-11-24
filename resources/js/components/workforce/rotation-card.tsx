import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { EmployeeRotation } from '@/types/workforce-pages';
import { MoreHorizontal, Edit, Copy, Trash2, Users } from 'lucide-react';

interface RotationCardProps {
    rotation: EmployeeRotation;
    onEdit: (rotation: EmployeeRotation) => void;
    onDelete: (id: number) => void;
    onDuplicate: (rotation: EmployeeRotation) => void;
    onAssignEmployees: (rotation: EmployeeRotation) => void;
}

export function RotationCard({
    rotation,
    onEdit,
    onDelete,
    onDuplicate,
    onAssignEmployees,
}: RotationCardProps) {
    const getPatternDisplay = () => {
        const { pattern_type, pattern_json } = rotation;
        const { work_days, rest_days } = pattern_json;
        
        if (pattern_type === 'custom') {
            return `${work_days}w / ${rest_days}r`;
        }
        return pattern_type.toUpperCase();
    };

    const getStatusColor = () => {
        return rotation.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
    };

    return (
        <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                        <CardTitle className="text-base line-clamp-1">{rotation.name}</CardTitle>
                        {rotation.department_name && (
                            <p className="text-xs text-gray-600 mt-1">{rotation.department_name}</p>
                        )}
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onEdit(rotation)} className="gap-2">
                                <Edit className="h-4 w-4" />
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onDuplicate(rotation)} className="gap-2">
                                <Copy className="h-4 w-4" />
                                Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onDelete(rotation.id)} className="gap-2 text-red-600">
                                <Trash2 className="h-4 w-4" />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Pattern Info */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Pattern:</span>
                        <Badge variant="outline">{getPatternDisplay()}</Badge>
                    </div>
                    <div className="text-xs text-gray-600">
                        <p>{rotation.pattern_json?.work_days || 0} work / {rotation.pattern_json?.rest_days || 0} rest days</p>
                        <p>Cycle: {rotation.pattern_json?.cycle_length || rotation.pattern_json?.pattern?.length || 0} days</p>
                    </div>
                </div>

                {/* Pattern Visualization */}
                <div className="flex gap-1">
                    {rotation.pattern_json?.pattern && Array.isArray(rotation.pattern_json.pattern) ? (
                        rotation.pattern_json.pattern.slice(0, 7).map((day, index) => (
                            <div
                                key={index}
                                className={`h-6 w-3 rounded text-xs font-bold flex items-center justify-center text-white ${
                                    day === 1 ? 'bg-blue-500' : 'bg-gray-300'
                                }`}
                                title={day === 1 ? 'Work' : 'Rest'}
                            >
                                {day === 1 ? 'W' : 'R'}
                            </div>
                        ))
                    ) : (
                        <div className="text-xs text-gray-500">No pattern data</div>
                    )}
                </div>

                {/* Status and Employees */}
                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                        <Badge className={getStatusColor()}>
                            {rotation.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600">
                        <Users className="h-4 w-4" />
                        <span>{rotation.assigned_employees_count || 0}</span>
                    </div>
                </div>

                {/* Created Info */}
                {rotation.created_at && (
                    <div className="text-xs text-gray-600 space-y-1 pt-2 border-t">
                        <p>Created: {new Date(rotation.created_at).toLocaleDateString()}</p>
                    </div>
                )}

                {/* Assign Button */}
                <Button
                    onClick={() => onAssignEmployees(rotation)}
                    size="sm"
                    className="w-full mt-2 gap-2"
                    variant="outline"
                    disabled={!rotation.is_active}
                >
                    <Users className="h-4 w-4" />
                    Assign Employees
                </Button>
            </CardContent>
        </Card>
    );
}
