'use client';

import { useState } from 'react';

import { toast } from '@/components/ui/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/registry/new-york-v4/ui/avatar';
import { Badge } from '@/registry/new-york-v4/ui/badge';
import { Button } from '@/registry/new-york-v4/ui/button';
import { Card, CardContent } from '@/registry/new-york-v4/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/registry/new-york-v4/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/registry/new-york-v4/ui/dropdown-menu';
import { Input } from '@/registry/new-york-v4/ui/input';
import { Label } from '@/registry/new-york-v4/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/registry/new-york-v4/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/registry/new-york-v4/ui/tabs';
import { Textarea } from '@/registry/new-york-v4/ui/textarea';
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';

import { Edit, MoreHorizontal, Plus, Search, Trash2, UserCheck, UserPlus, UserX, Users } from 'lucide-react';

interface User {
    id: string;
    name: string;
    email: string;
    avatar: string;
    initials: string;
    role: 'admin' | 'member' | 'viewer';
}

interface Task {
    id: string;
    title: string;
    description?: string;
    taskId: string;
    assigneeId?: string;
    labels: Array<{
        name: string;
        color: string;
        textColor: string;
    }>;
    priority: 'low' | 'medium' | 'high';
    createdAt: string;
    dueDate?: string;
    assignmentHistory: Array<{
        assigneeId: string | null;
        assignedBy: string;
        assignedAt: string;
        action: 'assigned' | 'unassigned' | 'reassigned';
    }>;
}

interface Column {
    id: string;
    title: string;
    tasks: Task[];
    color: string;
    headerColor: string;
}

interface Project {
    id: string;
    name: string;
    description: string;
    color: string;
    members: string[]; // User IDs
    columns: Column[];
    createdAt: string;
}

// Mock current user
const currentUser: User = {
    id: 'user-1',
    name: 'John Doe',
    email: 'john@example.com',
    avatar: '/placeholder.svg?height=40&width=40',
    initials: 'JD',
    role: 'admin'
};

// Mock users database
const allUsers: User[] = [
    {
        id: 'user-1',
        name: 'John Doe',
        email: 'john@example.com',
        avatar: '/placeholder.svg',
        initials: 'JD',
        role: 'admin'
    },
    {
        id: 'user-2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        avatar: '/placeholder.svg',
        initials: 'JS',
        role: 'member'
    },
    {
        id: 'user-3',
        name: 'Mike Johnson',
        email: 'mike@example.com',
        avatar: '/placeholder.svg',
        initials: 'MJ',
        role: 'member'
    },
    {
        id: 'user-4',
        name: 'Sarah Wilson',
        email: 'sarah@example.com',
        avatar: '/placeholder.svg',
        initials: 'SW',
        role: 'member'
    },
    {
        id: 'user-5',
        name: 'Alex Brown',
        email: 'alex@example.com',
        avatar: '/placeholder.svg',
        initials: 'AB',
        role: 'viewer'
    },
    {
        id: 'user-6',
        name: 'Chris Davis',
        email: 'chris@example.com',
        avatar: '/placeholder.svg',
        initials: 'CD',
        role: 'member'
    },
    {
        id: 'user-7',
        name: 'Emma Wilson',
        email: 'emma@example.com',
        avatar: '/placeholder.svg',
        initials: 'EW',
        role: 'member'
    },
    {
        id: 'user-8',
        name: 'David Lee',
        email: 'david@example.com',
        avatar: '/placeholder.svg',
        initials: 'DL',
        role: 'member'
    }
];

// Mock projects data
const initialProjects: Project[] = [
    {
        id: 'project-1',
        name: 'Research Platform',
        description: 'Main research management platform development',
        color: 'from-blue-500 to-purple-600',
        members: ['user-1', 'user-2', 'user-3', 'user-4'],
        createdAt: '2024-01-01',
        columns: [
            {
                id: 'todo',
                title: 'TO DO',
                color: 'bg-gradient-to-br from-slate-50 to-slate-100',
                headerColor: 'bg-slate-200',
                tasks: [
                    {
                        id: 'task-1',
                        title: 'Design user authentication system',
                        description: 'Create secure login and registration flow',
                        taskId: 'RP-001',
                        assigneeId: 'user-2',
                        priority: 'high',
                        createdAt: '2024-01-15',
                        labels: [{ name: 'BACKEND', color: 'bg-blue-500', textColor: 'text-white' }],
                        assignmentHistory: [
                            {
                                assigneeId: 'user-2',
                                assignedBy: 'user-1',
                                assignedAt: '2024-01-15T10:00:00Z',
                                action: 'assigned'
                            }
                        ]
                    },
                    {
                        id: 'task-2',
                        title: 'Research data visualization components',
                        taskId: 'RP-002',
                        assigneeId: 'user-3',
                        priority: 'medium',
                        createdAt: '2024-01-16',
                        labels: [{ name: 'FRONTEND', color: 'bg-emerald-500', textColor: 'text-white' }],
                        assignmentHistory: [
                            {
                                assigneeId: 'user-3',
                                assignedBy: 'user-1',
                                assignedAt: '2024-01-16T09:00:00Z',
                                action: 'assigned'
                            }
                        ]
                    }
                ]
            },
            {
                id: 'progress',
                title: 'IN PROGRESS',
                color: 'bg-gradient-to-br from-blue-50 to-blue-100',
                headerColor: 'bg-blue-200',
                tasks: [
                    {
                        id: 'task-3',
                        title: 'Implement project management features',
                        taskId: 'RP-003',
                        assigneeId: 'user-1',
                        priority: 'high',
                        createdAt: '2024-01-10',
                        labels: [{ name: 'FEATURE', color: 'bg-purple-500', textColor: 'text-white' }],
                        assignmentHistory: [
                            {
                                assigneeId: 'user-1',
                                assignedBy: 'user-1',
                                assignedAt: '2024-01-10T08:00:00Z',
                                action: 'assigned'
                            }
                        ]
                    }
                ]
            },
            {
                id: 'review',
                title: 'IN REVIEW',
                color: 'bg-gradient-to-br from-amber-50 to-amber-100',
                headerColor: 'bg-amber-200',
                tasks: []
            },
            {
                id: 'done',
                title: 'DONE',
                color: 'bg-gradient-to-br from-green-50 to-green-100',
                headerColor: 'bg-green-200',
                tasks: [
                    {
                        id: 'task-4',
                        title: 'Setup development environment',
                        taskId: 'RP-004',
                        assigneeId: 'user-4',
                        priority: 'low',
                        createdAt: '2024-01-05',
                        labels: [{ name: 'SETUP', color: 'bg-gray-500', textColor: 'text-white' }],
                        assignmentHistory: [
                            {
                                assigneeId: 'user-4',
                                assignedBy: 'user-1',
                                assignedAt: '2024-01-05T14:00:00Z',
                                action: 'assigned'
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        id: 'project-2',
        name: 'Data Analysis Tool',
        description: 'Advanced analytics and reporting system',
        color: 'from-green-500 to-teal-600',
        members: ['user-1', 'user-5', 'user-6', 'user-7'],
        createdAt: '2024-01-10',
        columns: [
            {
                id: 'todo',
                title: 'TO DO',
                color: 'bg-gradient-to-br from-slate-50 to-slate-100',
                headerColor: 'bg-slate-200',
                tasks: [
                    {
                        id: 'task-5',
                        title: 'Design analytics dashboard',
                        taskId: 'DAT-001',
                        assigneeId: 'user-5',
                        priority: 'medium',
                        createdAt: '2024-01-12',
                        labels: [{ name: 'DESIGN', color: 'bg-pink-500', textColor: 'text-white' }],
                        assignmentHistory: [
                            {
                                assigneeId: 'user-5',
                                assignedBy: 'user-1',
                                assignedAt: '2024-01-12T11:00:00Z',
                                action: 'assigned'
                            }
                        ]
                    }
                ]
            },
            {
                id: 'progress',
                title: 'IN PROGRESS',
                color: 'bg-gradient-to-br from-blue-50 to-blue-100',
                headerColor: 'bg-blue-200',
                tasks: []
            },
            {
                id: 'review',
                title: 'IN REVIEW',
                color: 'bg-gradient-to-br from-amber-50 to-amber-100',
                headerColor: 'bg-amber-200',
                tasks: []
            },
            {
                id: 'done',
                title: 'DONE',
                color: 'bg-gradient-to-br from-green-50 to-green-100',
                headerColor: 'bg-green-200',
                tasks: []
            }
        ]
    }
];

export default function ResearchManagementTool() {
    const [projects, setProjects] = useState(initialProjects);
    const [currentProjectId, setCurrentProjectId] = useState('project-1');
    const [searchTerm, setSearchTerm] = useState('');
    const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
    const [isManageTeamOpen, setIsManageTeamOpen] = useState(false);
    const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
    const [isAssignTaskOpen, setIsAssignTaskOpen] = useState(false);
    const [isBulkAssignOpen, setIsBulkAssignOpen] = useState(false);
    const [selectedColumnId, setSelectedColumnId] = useState('');
    const [selectedTaskForAssignment, setSelectedTaskForAssignment] = useState<Task | null>(null);
    const [selectedTasksForBulkAssign, setSelectedTasksForBulkAssign] = useState<string[]>([]);
    const [assigneeFilter, setAssigneeFilter] = useState<string>('all');

    // New task form state
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        priority: 'medium' as const,
        assigneeId: '',
        labels: [] as string[],
        dueDate: ''
    });

    // New project form state
    const [newProject, setNewProject] = useState({
        name: '',
        description: '',
        color: 'from-blue-500 to-purple-600'
    });

    // Get current project
    const currentProject = projects.find((p) => p.id === currentProjectId);

    // Get user's accessible projects (projects where user is a member)
    const userProjects = projects.filter((project) => project.members.includes(currentUser.id));

    // Get project members
    const projectMembers = currentProject ? allUsers.filter((user) => currentProject.members.includes(user.id)) : [];

    // Get available users to add to project
    const availableUsers = allUsers.filter((user) => !currentProject?.members.includes(user.id));

    // Assignment functionality
    const assignTask = (
        taskId: string,
        assigneeId: string | null,
        action: 'assigned' | 'unassigned' | 'reassigned'
    ) => {
        if (!currentProject) return;

        const newProjects = projects.map((project) => {
            if (project.id === currentProjectId) {
                const newColumns = project.columns.map((column) => ({
                    ...column,
                    tasks: column.tasks.map((task) => {
                        if (task.id === taskId) {
                            const assignmentEntry = {
                                assigneeId,
                                assignedBy: currentUser.id,
                                assignedAt: new Date().toISOString(),
                                action
                            };

                            return {
                                ...task,
                                assigneeId: assigneeId || undefined,
                                assignmentHistory: [...task.assignmentHistory, assignmentEntry]
                            };
                        }

                        return task;
                    })
                }));

                return { ...project, columns: newColumns };
            }

            return project;
        });

        setProjects(newProjects);

        // Show success message
        const assigneeName = assigneeId ? allUsers.find((u) => u.id === assigneeId)?.name : 'Unassigned';
        const taskTitle = currentProject.columns.flatMap((col) => col.tasks).find((task) => task.id === taskId)?.title;

        toast({
            title: 'Task Assignment Updated',
            description: `"${taskTitle}" ${action} to ${assigneeName}`
        });
    };

    const bulkAssignTasks = (taskIds: string[], assigneeId: string | null) => {
        taskIds.forEach((taskId) => {
            assignTask(taskId, assigneeId, assigneeId ? 'assigned' : 'unassigned');
        });
        setSelectedTasksForBulkAssign([]);
        setIsBulkAssignOpen(false);
    };

    const getTasksByAssignee = (assigneeId: string) => {
        if (!currentProject) return [];

        return currentProject.columns.flatMap((col) => col.tasks).filter((task) => task.assigneeId === assigneeId);
    };

    const getUnassignedTasks = () => {
        if (!currentProject) return [];

        return currentProject.columns.flatMap((col) => col.tasks).filter((task) => !task.assigneeId);
    };

    const onDragEnd = (result: any) => {
        const { destination, source, draggableId } = result;

        if (!destination || !currentProject) return;
        if (destination.droppableId === source.droppableId && destination.index === source.index) return;

        const sourceColumn = currentProject.columns.find((col) => col.id === source.droppableId);
        const destColumn = currentProject.columns.find((col) => col.id === destination.droppableId);

        if (!sourceColumn || !destColumn) return;

        const task = sourceColumn.tasks.find((task) => task.id === draggableId);
        if (!task) return;

        const newProjects = projects.map((project) => {
            if (project.id === currentProjectId) {
                const newColumns = project.columns.map((column) => {
                    if (column.id === source.droppableId) {
                        return {
                            ...column,
                            tasks: column.tasks.filter((task) => task.id !== draggableId)
                        };
                    }
                    if (column.id === destination.droppableId) {
                        const newTasks = [...column.tasks];
                        newTasks.splice(destination.index, 0, task);

                        return {
                            ...column,
                            tasks: newTasks
                        };
                    }

                    return column;
                });

                return { ...project, columns: newColumns };
            }

            return project;
        });

        setProjects(newProjects);
    };

    const createTask = () => {
        if (!newTask.title.trim() || !currentProject) return;

        const task: Task = {
            id: `task-${Date.now()}`,
            title: newTask.title,
            description: newTask.description,
            taskId: `${currentProject.name.substring(0, 2).toUpperCase()}-${String(Date.now()).slice(-3)}`,
            assigneeId: newTask.assigneeId || undefined,
            priority: newTask.priority,
            createdAt: new Date().toISOString(),
            dueDate: newTask.dueDate || undefined,
            labels: newTask.labels.map((label) => ({
                name: label,
                color: 'bg-blue-500',
                textColor: 'text-white'
            })),
            assignmentHistory: newTask.assigneeId
                ? [
                      {
                          assigneeId: newTask.assigneeId,
                          assignedBy: currentUser.id,
                          assignedAt: new Date().toISOString(),
                          action: 'assigned' as const
                      }
                  ]
                : []
        };

        const newProjects = projects.map((project) => {
            if (project.id === currentProjectId) {
                const newColumns = project.columns.map((column) => {
                    if (column.id === selectedColumnId) {
                        return {
                            ...column,
                            tasks: [...column.tasks, task]
                        };
                    }

                    return column;
                });

                return { ...project, columns: newColumns };
            }

            return project;
        });

        setProjects(newProjects);
        setNewTask({
            title: '',
            description: '',
            priority: 'medium',
            assigneeId: '',
            labels: [],
            dueDate: ''
        });
        setIsCreateTaskOpen(false);
    };

    const createProject = () => {
        if (!newProject.name.trim()) return;

        const project: Project = {
            id: `project-${Date.now()}`,
            name: newProject.name,
            description: newProject.description,
            color: newProject.color,
            members: [currentUser.id], // Creator is automatically added
            createdAt: new Date().toISOString(),
            columns: [
                {
                    id: 'todo',
                    title: 'TO DO',
                    color: 'bg-gradient-to-br from-slate-50 to-slate-100',
                    headerColor: 'bg-slate-200',
                    tasks: []
                },
                {
                    id: 'progress',
                    title: 'IN PROGRESS',
                    color: 'bg-gradient-to-br from-blue-50 to-blue-100',
                    headerColor: 'bg-blue-200',
                    tasks: []
                },
                {
                    id: 'review',
                    title: 'IN REVIEW',
                    color: 'bg-gradient-to-br from-amber-50 to-amber-100',
                    headerColor: 'bg-amber-200',
                    tasks: []
                },
                {
                    id: 'done',
                    title: 'DONE',
                    color: 'bg-gradient-to-br from-green-50 to-green-100',
                    headerColor: 'bg-green-200',
                    tasks: []
                }
            ]
        };

        setProjects([...projects, project]);
        setCurrentProjectId(project.id);
        setNewProject({
            name: '',
            description: '',
            color: 'from-blue-500 to-purple-600'
        });
        setIsCreateProjectOpen(false);
    };

    const addMemberToProject = (userId: string) => {
        if (!currentProject) return;

        const newProjects = projects.map((project) => {
            if (project.id === currentProjectId) {
                return {
                    ...project,
                    members: [...project.members, userId]
                };
            }

            return project;
        });

        setProjects(newProjects);
    };

    const removeMemberFromProject = (userId: string) => {
        if (!currentProject || userId === currentUser.id) return; // Can't remove yourself

        const newProjects = projects.map((project) => {
            if (project.id === currentProjectId) {
                return {
                    ...project,
                    members: project.members.filter((id) => id !== userId)
                };
            }

            return project;
        });

        setProjects(newProjects);
    };

    const filteredColumns = currentProject
        ? currentProject.columns.map((column) => ({
              ...column,
              tasks: column.tasks.filter((task) => {
                  const matchesSearch =
                      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      task.taskId.toLowerCase().includes(searchTerm.toLowerCase());

                  const matchesAssignee =
                      assigneeFilter === 'all' ||
                      (assigneeFilter === 'unassigned' && !task.assigneeId) ||
                      (assigneeFilter === 'me' && task.assigneeId === currentUser.id) ||
                      task.assigneeId === assigneeFilter;

                  return matchesSearch && matchesAssignee;
              })
          }))
        : [];

    if (!currentProject) {
        return (
            <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100'>
                <div className='text-center'>
                    <h1 className='mb-4 text-2xl font-bold text-gray-900'>No Project Selected</h1>
                    <p className='mb-6 text-gray-600'>
                        You don't have access to any projects or the selected project doesn't exist.
                    </p>
                    <Button onClick={() => setIsCreateProjectOpen(true)}>
                        <Plus className='mr-2 h-4 w-4' />
                        Create New Project
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className='min-h-screen bg-gradient-to-br from-slate-50 to-slate-100'>
            {/* Header */}
            <header className='border-b bg-white px-6 py-4 shadow-sm'>
                <div className='flex items-center justify-between'>
                    <div className='flex items-center space-x-6'>
                        <h1 className='text-xl font-bold text-gray-900'>Research Management</h1>
                        <Select value={currentProjectId} onValueChange={setCurrentProjectId}>
                            <SelectTrigger className='w-64'>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {userProjects.map((project) => (
                                    <SelectItem key={project.id} value={project.id}>
                                        <div className='flex items-center space-x-2'>
                                            <div className={`h-3 w-3 rounded-full bg-gradient-to-r ${project.color}`} />
                                            <span>{project.name}</span>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className='flex items-center space-x-4'>
                        <Dialog open={isCreateProjectOpen} onOpenChange={setIsCreateProjectOpen}>
                            <DialogTrigger asChild>
                                <Button variant='outline' size='sm'>
                                    <Plus className='mr-2 h-4 w-4' />
                                    New Project
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Create New Project</DialogTitle>
                                </DialogHeader>
                                <div className='space-y-4'>
                                    <div>
                                        <Label htmlFor='project-name'>Project Name</Label>
                                        <Input
                                            id='project-name'
                                            value={newProject.name}
                                            onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                                            placeholder='Enter project name...'
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor='project-description'>Description</Label>
                                        <Textarea
                                            id='project-description'
                                            value={newProject.description}
                                            onChange={(e) =>
                                                setNewProject({ ...newProject, description: e.target.value })
                                            }
                                            placeholder='Enter project description...'
                                        />
                                    </div>
                                    <div>
                                        <Label>Color Theme</Label>
                                        <div className='mt-2 flex space-x-2'>
                                            {[
                                                'from-blue-500 to-purple-600',
                                                'from-green-500 to-teal-600',
                                                'from-red-500 to-pink-600',
                                                'from-yellow-500 to-orange-600',
                                                'from-indigo-500 to-blue-600'
                                            ].map((color) => (
                                                <button
                                                    key={color}
                                                    onClick={() => setNewProject({ ...newProject, color })}
                                                    className={`h-8 w-8 rounded-full bg-gradient-to-r ${color} ${
                                                        newProject.color === color ? 'ring-2 ring-gray-400' : ''
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <Button onClick={createProject} className='w-full'>
                                        Create Project
                                    </Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                        <Avatar className='h-8 w-8'>
                            <AvatarImage src={currentUser.avatar || '/placeholder.svg'} />
                            <AvatarFallback>{currentUser.initials}</AvatarFallback>
                        </Avatar>
                    </div>
                </div>
            </header>

            <div className='p-6'>
                {/* Project Header */}
                <div className='mb-6'>
                    <div className='mb-2 flex items-center space-x-4'>
                        <div className={`h-4 w-4 rounded bg-gradient-to-r ${currentProject.color}`} />
                        <h2 className='text-2xl font-bold text-gray-900'>{currentProject.name}</h2>
                    </div>
                    <p className='text-gray-600'>{currentProject.description}</p>
                </div>

                {/* Controls */}
                <div className='mb-6 flex items-center justify-between rounded-lg bg-white p-4 shadow-sm'>
                    <div className='flex items-center space-x-4'>
                        <div className='relative'>
                            <Search className='absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400' />
                            <Input
                                placeholder='Search tasks...'
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className='w-64 pl-10'
                            />
                        </div>
                        <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
                            <SelectTrigger className='w-48'>
                                <SelectValue placeholder='Filter by assignee' />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value='all'>All Tasks</SelectItem>
                                <SelectItem value='me'>My Tasks</SelectItem>
                                <SelectItem value='unassigned'>Unassigned</SelectItem>
                                <DropdownMenuSeparator />
                                {projectMembers.map((member) => (
                                    <SelectItem key={member.id} value={member.id}>
                                        {member.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <div className='flex items-center -space-x-2'>
                            {projectMembers.slice(0, 4).map((member) => (
                                <Avatar key={member.id} className='h-8 w-8 border-2 border-white !text-black'>
                                    <AvatarImage src={member.avatar || '/placeholder.svg'} />
                                    <AvatarFallback>{member.initials}</AvatarFallback>
                                </Avatar>
                            ))}
                            {projectMembers.length > 4 && (
                                <div className='flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-gray-200 text-xs font-medium'>
                                    +{projectMembers.length - 4}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className='flex items-center space-x-2'>
                        <Dialog open={isBulkAssignOpen} onOpenChange={setIsBulkAssignOpen}>
                            <DialogTrigger asChild>
                                <Button variant='outline' size='sm'>
                                    <UserCheck className='mr-2 h-4 w-4' />
                                    Bulk Assign
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Bulk Task Assignment</DialogTitle>
                                </DialogHeader>
                                <div className='space-y-4'>
                                    <div>
                                        <Label>Select Tasks to Assign</Label>
                                        <div className='max-h-48 space-y-2 overflow-y-auto rounded-lg border p-2'>
                                            {currentProject.columns
                                                .flatMap((col) => col.tasks)
                                                .map((task) => (
                                                    <div key={task.id} className='flex items-center space-x-2'>
                                                        <input
                                                            type='checkbox'
                                                            checked={selectedTasksForBulkAssign.includes(task.id)}
                                                            onChange={(e) => {
                                                                if (e.target.checked) {
                                                                    setSelectedTasksForBulkAssign([
                                                                        ...selectedTasksForBulkAssign,
                                                                        task.id
                                                                    ]);
                                                                } else {
                                                                    setSelectedTasksForBulkAssign(
                                                                        selectedTasksForBulkAssign.filter(
                                                                            (id) => id !== task.id
                                                                        )
                                                                    );
                                                                }
                                                            }}
                                                        />
                                                        <span className='text-sm'>
                                                            {task.title} ({task.taskId})
                                                        </span>
                                                    </div>
                                                ))}
                                        </div>
                                    </div>
                                    <div>
                                        <Label>Assign To</Label>
                                        <Select
                                            onValueChange={(value) =>
                                                bulkAssignTasks(
                                                    selectedTasksForBulkAssign,
                                                    value === 'unassign' ? null : value
                                                )
                                            }>
                                            <SelectTrigger>
                                                <SelectValue placeholder='Select assignee' />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value='unassign'>Unassign All</SelectItem>
                                                <DropdownMenuSeparator />
                                                {projectMembers.map((member) => (
                                                    <SelectItem key={member.id} value={member.id}>
                                                        {member.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                        <Dialog open={isManageTeamOpen} onOpenChange={setIsManageTeamOpen}>
                            <DialogTrigger asChild>
                                <Button variant='outline' size='sm'>
                                    <Users className='mr-2 h-4 w-4' />
                                    Manage Team
                                </Button>
                            </DialogTrigger>
                            <DialogContent className='max-w-2xl'>
                                <DialogHeader>
                                    <DialogTitle>Manage Team - {currentProject.name}</DialogTitle>
                                </DialogHeader>
                                <Tabs defaultValue='members' className='w-full'>
                                    <TabsList className='grid w-full grid-cols-3'>
                                        <TabsTrigger value='members'>Current Members</TabsTrigger>
                                        <TabsTrigger value='add'>Add Members</TabsTrigger>
                                        <TabsTrigger value='assignments'>Task Assignments</TabsTrigger>
                                    </TabsList>
                                    <TabsContent value='members' className='space-y-4'>
                                        {projectMembers.map((member) => (
                                            <div
                                                key={member.id}
                                                className='flex items-center justify-between rounded-lg border p-3'>
                                                <div className='flex items-center space-x-3'>
                                                    <Avatar className='h-10 w-10'>
                                                        <AvatarImage src={member.avatar || '/placeholder.svg'} />
                                                        <AvatarFallback>{member.initials}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className='font-medium'>{member.name}</p>
                                                        <p className='text-sm text-gray-500'>{member.email}</p>
                                                    </div>
                                                    <Badge variant='secondary'>{member.role}</Badge>
                                                    <Badge variant='outline'>
                                                        {getTasksByAssignee(member.id).length} tasks
                                                    </Badge>
                                                </div>
                                                {member.id !== currentUser.id && (
                                                    <Button
                                                        variant='ghost'
                                                        size='sm'
                                                        onClick={() => removeMemberFromProject(member.id)}
                                                        className='text-red-600 hover:text-red-700'>
                                                        <Trash2 className='h-4 w-4' />
                                                    </Button>
                                                )}
                                            </div>
                                        ))}
                                    </TabsContent>
                                    <TabsContent value='add' className='space-y-4'>
                                        {availableUsers.map((user) => (
                                            <div
                                                key={user.id}
                                                className='flex items-center justify-between rounded-lg border p-3'>
                                                <div className='flex items-center space-x-3'>
                                                    <Avatar className='h-10 w-10'>
                                                        <AvatarImage src={user.avatar || '/placeholder.svg'} />
                                                        <AvatarFallback>{user.initials}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className='font-medium'>{user.name}</p>
                                                        <p className='text-sm text-gray-500'>{user.email}</p>
                                                    </div>
                                                    <Badge variant='secondary'>{user.role}</Badge>
                                                </div>
                                                <Button
                                                    variant='outline'
                                                    size='sm'
                                                    onClick={() => addMemberToProject(user.id)}>
                                                    <UserPlus className='mr-2 h-4 w-4' />
                                                    Add
                                                </Button>
                                            </div>
                                        ))}
                                        {availableUsers.length === 0 && (
                                            <p className='py-8 text-center text-gray-500'>
                                                No more users available to add
                                            </p>
                                        )}
                                    </TabsContent>
                                    <TabsContent value='assignments' className='space-y-4'>
                                        <div className='space-y-4'>
                                            <div>
                                                <h4 className='mb-2 font-medium'>
                                                    Unassigned Tasks ({getUnassignedTasks().length})
                                                </h4>
                                                {getUnassignedTasks().map((task) => (
                                                    <div
                                                        key={task.id}
                                                        className='flex items-center justify-between rounded border p-2 text-sm'>
                                                        <span>
                                                            {task.title} ({task.taskId})
                                                        </span>
                                                        <Button
                                                            variant='outline'
                                                            size='sm'
                                                            onClick={() => {
                                                                setSelectedTaskForAssignment(task);
                                                                setIsAssignTaskOpen(true);
                                                            }}>
                                                            Assign
                                                        </Button>
                                                    </div>
                                                ))}
                                            </div>
                                            {projectMembers.map((member) => {
                                                const memberTasks = getTasksByAssignee(member.id);

                                                return (
                                                    <div key={member.id}>
                                                        <h4 className='mb-2 font-medium'>
                                                            {member.name} ({memberTasks.length} tasks)
                                                        </h4>
                                                        {memberTasks.map((task) => (
                                                            <div
                                                                key={task.id}
                                                                className='flex items-center justify-between rounded border p-2 text-sm'>
                                                                <span>
                                                                    {task.title} ({task.taskId})
                                                                </span>
                                                                <Button
                                                                    variant='ghost'
                                                                    size='sm'
                                                                    onClick={() =>
                                                                        assignTask(task.id, null, 'unassigned')
                                                                    }
                                                                    className='text-red-600'>
                                                                    <UserX className='h-4 w-4' />
                                                                </Button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </TabsContent>
                                </Tabs>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                {/* Assignment Dialog */}
                <Dialog open={isAssignTaskOpen} onOpenChange={setIsAssignTaskOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Assign Task</DialogTitle>
                        </DialogHeader>
                        {selectedTaskForAssignment && (
                            <div className='space-y-4'>
                                <div>
                                    <p className='font-medium'>{selectedTaskForAssignment.title}</p>
                                    <p className='text-sm text-gray-500'>{selectedTaskForAssignment.taskId}</p>
                                </div>
                                <div>
                                    <Label>Assign to</Label>
                                    <Select
                                        onValueChange={(value) => {
                                            assignTask(
                                                selectedTaskForAssignment.id,
                                                value === 'unassign' ? null : value,
                                                value === 'unassign' ? 'unassigned' : 'assigned'
                                            );
                                            setIsAssignTaskOpen(false);
                                            setSelectedTaskForAssignment(null);
                                        }}>
                                        <SelectTrigger>
                                            <SelectValue placeholder='Select assignee' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value='unassign'>Unassign</SelectItem>
                                            <DropdownMenuSeparator />
                                            {projectMembers.map((member) => (
                                                <SelectItem key={member.id} value={member.id}>
                                                    {member.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>

                {/* Kanban Board */}
                <DragDropContext onDragEnd={onDragEnd}>
                    <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
                        {filteredColumns.map((column) => (
                            <div key={column.id} className={`${column.color} rounded-lg p-4`}>
                                <div
                                    className={`mb-4 flex items-center justify-between p-3 ${column.headerColor} rounded-lg`}>
                                    <div className='flex items-center space-x-2'>
                                        <h3 className='text-sm font-semibold tracking-wide text-gray-800 uppercase'>
                                            {column.title}
                                        </h3>
                                        <Badge variant='secondary' className='text-xs'>
                                            {column.tasks.length}
                                        </Badge>
                                    </div>
                                    <Dialog open={isCreateTaskOpen} onOpenChange={setIsCreateTaskOpen}>
                                        <DialogTrigger asChild>
                                            <Button
                                                variant='ghost'
                                                size='sm'
                                                className='h-6 w-6 p-0'
                                                onClick={() => setSelectedColumnId(column.id)}>
                                                <Plus className='h-4 w-4' />
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent >
                                            <DialogHeader>
                                                <DialogTitle>Create New Task</DialogTitle>
                                            </DialogHeader>
                                            <div className='space-y-4'>
                                                <div>
                                                    <Label htmlFor='task-title'>Title</Label>
                                                    <Input
                                                        id='task-title'
                                                        value={newTask.title}
                                                        onChange={(e) =>
                                                            setNewTask({ ...newTask, title: e.target.value })
                                                        }
                                                        placeholder='Enter task title...'
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor='task-description'>Description</Label>
                                                    <Textarea
                                                        id='task-description'
                                                        value={newTask.description}
                                                        onChange={(e) =>
                                                            setNewTask({ ...newTask, description: e.target.value })
                                                        }
                                                        placeholder='Enter task description...'
                                                    />
                                                </div>
                                                <div className='grid grid-cols-2 gap-4'>
                                                    <div>
                                                        <Label htmlFor='task-priority'>Priority</Label>
                                                        <Select
                                                            value={newTask.priority}
                                                            onValueChange={(value: any) =>
                                                                setNewTask({ ...newTask, priority: value })
                                                            }>
                                                            <SelectTrigger>
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value='low'>Low</SelectItem>
                                                                <SelectItem value='medium'>Medium</SelectItem>
                                                                <SelectItem value='high'>High</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div>
                                                        <Label htmlFor='task-assignee'>Assignee</Label>
                                                        <Select
                                                            value={newTask.assigneeId}
                                                            onValueChange={(value) =>
                                                                setNewTask({ ...newTask, assigneeId: value })
                                                            }>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder='Select assignee' />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value='unassigned'>Unassigned</SelectItem>
                                                                {projectMembers.map((member) => (
                                                                    <SelectItem key={member.id} value={member.id}>
                                                                        {member.name}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>
                                                <div>
                                                    <Label htmlFor='task-due-date'>Due Date</Label>
                                                    <Input
                                                        id='task-due-date'
                                                        type='date'
                                                        value={newTask.dueDate}
                                                        onChange={(e) =>
                                                            setNewTask({ ...newTask, dueDate: e.target.value })
                                                        }
                                                    />
                                                </div>
                                                <Button onClick={createTask} className='w-full'>
                                                    Create Task
                                                </Button>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </div>

                                <Droppable droppableId={column.id}>
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}
                                            className={`min-h-[200px] space-y-3 ${
                                                snapshot.isDraggingOver ? 'rounded-lg bg-white/30 p-2' : ''
                                            }`}>
                                            {column.tasks.map((task, index) => {
                                                const assignee = task.assigneeId
                                                    ? allUsers.find((u) => u.id === task.assigneeId)
                                                    : undefined;

                                                return (
                                                    <Draggable key={task.id} draggableId={task.id} index={index}>
                                                        {(provided, snapshot) => (
                                                            <Card
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                                className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                                                                    snapshot.isDragging ? 'rotate-2 shadow-lg' : ''
                                                                }}`}>
                                                                <CardContent className='p-4'>
                                                                    <div className='mb-2 flex items-start justify-between'>
                                                                        <h4 className='text-sm leading-tight font-medium'>
                                                                            {task.title}
                                                                        </h4>
                                                                        <DropdownMenu>
                                                                            <DropdownMenuTrigger asChild>
                                                                                <Button
                                                                                    variant='ghost'
                                                                                    size='sm'
                                                                                    className='h-6 w-6 p-0'>
                                                                                    <MoreHorizontal className='h-3 w-3' />
                                                                                </Button>
                                                                            </DropdownMenuTrigger>
                                                                            <DropdownMenuContent>
                                                                                <DropdownMenuItem
                                                                                    onClick={() => {
                                                                                        setSelectedTaskForAssignment(
                                                                                            task
                                                                                        );
                                                                                        setIsAssignTaskOpen(true);
                                                                                    }}>
                                                                                    <UserCheck className='mr-2 h-4 w-4' />
                                                                                    {task.assigneeId
                                                                                        ? 'Reassign'
                                                                                        : 'Assign'}
                                                                                </DropdownMenuItem>
                                                                                {task.assigneeId && (
                                                                                    <DropdownMenuItem
                                                                                        onClick={() =>
                                                                                            assignTask(
                                                                                                task.id,
                                                                                                null,
                                                                                                'unassigned'
                                                                                            )
                                                                                        }>
                                                                                        <UserX className='mr-2 h-4 w-4' />
                                                                                        Unassign
                                                                                    </DropdownMenuItem>
                                                                                )}
                                                                                <DropdownMenuSeparator />
                                                                                <DropdownMenuItem>
                                                                                    <Edit className='mr-2 h-4 w-4' />
                                                                                    Edit
                                                                                </DropdownMenuItem>
                                                                                <DropdownMenuItem className='text-red-600'>
                                                                                    <Trash2 className='mr-2 h-4 w-4' />
                                                                                    Delete
                                                                                </DropdownMenuItem>
                                                                            </DropdownMenuContent>
                                                                        </DropdownMenu>
                                                                    </div>
                                                                    {task.description && (
                                                                        <p className='mb-3 text-xs text-gray-600'>
                                                                            {task.description}
                                                                        </p>
                                                                    )}
                                                                    <div className='mb-3 flex flex-wrap gap-1'>
                                                                        {task.labels.map((label, labelIndex) => (
                                                                            <Badge
                                                                                key={labelIndex}
                                                                                className={`${label.color} ${label.textColor} text-xs`}>
                                                                                {label.name}
                                                                            </Badge>
                                                                        ))}
                                                                    </div>
                                                                    <div className='flex items-center justify-between'>
                                                                        <span className='text-xs font-medium text-gray-500'>
                                                                            {task.taskId}
                                                                        </span>
                                                                        {assignee ? (
                                                                            <Avatar className='h-6 w-6'>
                                                                                <AvatarImage
                                                                                    src={
                                                                                        assignee.avatar ||
                                                                                        '/placeholder.svg'
                                                                                    }
                                                                                />
                                                                                <AvatarFallback className='text-xs'>
                                                                                    {assignee.initials}
                                                                                </AvatarFallback>
                                                                            </Avatar>
                                                                        ) : (
                                                                            <Button
                                                                                variant='ghost'
                                                                                size='sm'
                                                                                className='h-6 w-6 p-0 text-gray-400'
                                                                                onClick={() => {
                                                                                    setSelectedTaskForAssignment(task);
                                                                                    setIsAssignTaskOpen(true);
                                                                                }}>
                                                                                <UserPlus className='h-3 w-3' />
                                                                            </Button>
                                                                        )}
                                                                    </div>
                                                                </CardContent>
                                                            </Card>
                                                        )}
                                                    </Draggable>
                                                );
                                            })}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </div>
                        ))}
                    </div>
                </DragDropContext>
            </div>
        </div>
    );
}