'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';

import { toast } from '@/components/ui/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/registry/new-york-v4/ui/avatar';
import { Badge } from '@/registry/new-york-v4/ui/badge';
import { Button } from '@/registry/new-york-v4/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/registry/new-york-v4/ui/card';
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
import { ScrollArea } from '@/registry/new-york-v4/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/registry/new-york-v4/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/registry/new-york-v4/ui/tabs';
import { Textarea } from '@/registry/new-york-v4/ui/textarea';
import { useTeamStore } from '@/store/projectStore';
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import { ArrowRight, Calendar, Clock, Edit, Eye, History, MessageSquare, MoreHorizontal, Paperclip, Plus, Search, Trash2, UserCheck, UserPlus, UserX, Users } from 'lucide-react';
import { useSession } from 'next-auth/react';

interface User {
    id: string;
    name: string;
    email: string;
    avatar: string;
    initials: string;
    role: 'admin' | 'member' | 'viewer';
}

interface Comment {
    id: string;
    content: string;
    authorId: string;
    createdAt: string;
    updatedAt?: string;
}

interface Attachment {
    id: string;
    name: string;
    size: number;
    type: string;
    url: string;
    uploadedBy: string;
    uploadedAt: string;
}

interface TimeEntry {
    id: string;
    description: string;
    hours: number;
    userId: string;
    date: string;
    createdAt: string;
}

interface Subtask {
    id: string;
    title: string;
    completed: boolean;
    assigneeId?: string;
    createdAt: string;
}

interface ActivityEntry {
    id: string;
    type: 'created' | 'updated' | 'assigned' | 'commented' | 'moved' | 'completed';
    description: string;
    userId: string;
    createdAt: string;
    metadata?: any;
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
    status: 'todo' | 'progress' | 'review' | 'done';
    createdAt: string;
    updatedAt?: string;
    dueDate?: string;
    estimatedHours?: number;
    actualHours?: number;
    assignmentHistory: Array<{
        assigneeId: string | null;
        assignedBy: string;
        assignedAt: string;
        action: 'assigned' | 'unassigned' | 'reassigned';
    }>;
    comments: Comment[];
    attachments: Attachment[];
    timeEntries: TimeEntry[];
    subtasks: Subtask[];
    activity: ActivityEntry[];
    relatedTasks: string[];
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
    members: string[];
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

// Mock projects data with enhanced task details
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
                        description:
                            'Create secure login and registration flow with OAuth integration and multi-factor authentication support',
                        taskId: 'RP-001',
                        assigneeId: 'user-2',
                        priority: 'high',
                        status: 'todo',
                        createdAt: '2024-01-15T10:00:00Z',
                        updatedAt: '2024-01-16T14:30:00Z',
                        dueDate: '2024-02-15',
                        estimatedHours: 40,
                        actualHours: 12,
                        labels: [{ name: 'BACKEND', color: 'bg-blue-500', textColor: 'text-white' }],
                        assignmentHistory: [
                            {
                                assigneeId: 'user-2',
                                assignedBy: 'user-1',
                                assignedAt: '2024-01-15T10:00:00Z',
                                action: 'assigned'
                            }
                        ],
                        comments: [
                            {
                                id: 'comment-1',
                                content: 'We should consider using Auth0 for this implementation',
                                authorId: 'user-1',
                                createdAt: '2024-01-15T11:00:00Z'
                            },
                            {
                                id: 'comment-2',
                                content: "Good idea! I'll research the integration options",
                                authorId: 'user-2',
                                createdAt: '2024-01-15T11:30:00Z'
                            }
                        ],
                        attachments: [
                            {
                                id: 'att-1',
                                name: 'auth-flow-diagram.png',
                                size: 245760,
                                type: 'image/png',
                                url: '/placeholder.svg',
                                uploadedBy: 'user-1',
                                uploadedAt: '2024-01-15T12:00:00Z'
                            }
                        ],
                        timeEntries: [
                            {
                                id: 'time-1',
                                description: 'Research authentication libraries',
                                hours: 4,
                                userId: 'user-2',
                                date: '2024-01-16',
                                createdAt: '2024-01-16T18:00:00Z'
                            },
                            {
                                id: 'time-2',
                                description: 'Initial setup and configuration',
                                hours: 8,
                                userId: 'user-2',
                                date: '2024-01-17',
                                createdAt: '2024-01-17T17:00:00Z'
                            }
                        ],
                        subtasks: [
                            {
                                id: 'sub-1',
                                title: 'Set up OAuth providers',
                                completed: true,
                                assigneeId: 'user-2',
                                createdAt: '2024-01-15T10:30:00Z'
                            },
                            {
                                id: 'sub-2',
                                title: 'Implement login form',
                                completed: false,
                                assigneeId: 'user-2',
                                createdAt: '2024-01-15T10:31:00Z'
                            },
                            {
                                id: 'sub-3',
                                title: 'Add password reset functionality',
                                completed: false,
                                createdAt: '2024-01-15T10:32:00Z'
                            }
                        ],
                        activity: [
                            {
                                id: 'act-1',
                                type: 'created',
                                description: 'Task created',
                                userId: 'user-1',
                                createdAt: '2024-01-15T10:00:00Z'
                            },
                            {
                                id: 'act-2',
                                type: 'assigned',
                                description: 'Assigned to Jane Smith',
                                userId: 'user-1',
                                createdAt: '2024-01-15T10:00:00Z'
                            },
                            {
                                id: 'act-3',
                                type: 'commented',
                                description: 'Added a comment',
                                userId: 'user-1',
                                createdAt: '2024-01-15T11:00:00Z'
                            }
                        ],
                        relatedTasks: ['task-3']
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
                        description:
                            'Build comprehensive project management functionality including task creation, assignment, and tracking',
                        taskId: 'RP-003',
                        assigneeId: 'user-1',
                        priority: 'high',
                        status: 'progress',
                        createdAt: '2024-01-10T08:00:00Z',
                        dueDate: '2024-02-01',
                        estimatedHours: 60,
                        actualHours: 25,
                        labels: [{ name: 'FEATURE', color: 'bg-purple-500', textColor: 'text-white' }],
                        assignmentHistory: [
                            {
                                assigneeId: 'user-1',
                                assignedBy: 'user-1',
                                assignedAt: '2024-01-10T08:00:00Z',
                                action: 'assigned'
                            }
                        ],
                        comments: [],
                        attachments: [],
                        timeEntries: [
                            {
                                id: 'time-3',
                                description: 'Initial planning and architecture',
                                hours: 8,
                                userId: 'user-1',
                                date: '2024-01-10',
                                createdAt: '2024-01-10T17:00:00Z'
                            }
                        ],
                        subtasks: [
                            {
                                id: 'sub-4',
                                title: 'Design database schema',
                                completed: true,
                                assigneeId: 'user-1',
                                createdAt: '2024-01-10T08:30:00Z'
                            },
                            {
                                id: 'sub-5',
                                title: 'Implement task CRUD operations',
                                completed: true,
                                assigneeId: 'user-1',
                                createdAt: '2024-01-10T08:31:00Z'
                            },
                            {
                                id: 'sub-6',
                                title: 'Add drag and drop functionality',
                                completed: false,
                                assigneeId: 'user-1',
                                createdAt: '2024-01-10T08:32:00Z'
                            }
                        ],
                        activity: [
                            {
                                id: 'act-4',
                                type: 'created',
                                description: 'Task created',
                                userId: 'user-1',
                                createdAt: '2024-01-10T08:00:00Z'
                            },
                            {
                                id: 'act-5',
                                type: 'moved',
                                description: 'Moved to In Progress',
                                userId: 'user-1',
                                createdAt: '2024-01-12T09:00:00Z'
                            }
                        ],
                        relatedTasks: ['task-1']
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
    const [isTaskDetailOpen, setIsTaskDetailOpen] = useState(false);
    const [selectedTaskForDetail, setSelectedTaskForDetail] = useState<Task | null>(null);
    const [selectedTasksForBulkAssign, setSelectedTasksForBulkAssign] = useState<string[]>([]);
    const [selectedColumnId, setSelectedColumnId] = useState('');
    const [selectedTaskForAssignment, setSelectedTaskForAssignment] = useState<Task | null>(null);
    const [assigneeFilter, setAssigneeFilter] = useState<string>('all');
    const [newComment, setNewComment] = useState('');
    const [newTimeEntry, setNewTimeEntry] = useState({ description: '', hours: 0, date: '' });
    const [newSubtask, setNewSubtask] = useState('');
    const [isEditTaskOpen, setIsEditTaskOpen] = useState(false);
    const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

    const { currentTeam } = useTeamStore();

    useEffect(() => {
        console.log('Current Team:', currentTeam);
    }, [currentTeam]);
    const [isLoading, setIsLoading] = useState(false);
    const [teamMembers, setTeamMembers] = useState<User[]>([]);

    const { data: session } = useSession()

    // Fetch team members
    useEffect(() => {
        if (!session) return;
        console.log(session)
        const fetchTeamMembers = async () => {
            try {

                const response = await api.get(
                    `/team/634577e5-c57b-4772-80fa-92b2a796e507/members`,
                    {
                      headers: {
                        Authorization: `Bearer ${session.accessToken}`, 
                      },
                    }
                  );
                setTeamMembers(response.data);
            } catch (error) {
                console.error('Error fetching team members:', error);
                toast({
                    title: 'Error',
                    description: 'Failed to fetch team members',
                    variant: 'destructive'
                });
            }
        };

        fetchTeamMembers();
    }, [session]);

    // New task form state
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        priority: 'medium' as const,
        assigneeId: '',
        labels: [] as string[],
        dueDate: '',
        estimatedHours: 0
    });

    // New project form state
    const [newProject, setNewProject] = useState({
        name: '',
        description: '',
        color: 'from-blue-500 to-purple-600'
    });

    // Get current project
    const currentProject = projects.find((p) => p.id === currentProjectId);

    // Get user's accessible projects
    const userProjects = projects.filter((project) => project.members.includes(currentUser.id));

    // Get project members
    const projectMembers = currentProject ? allUsers.filter((user) => currentProject.members.includes(user.id)) : [];

    // Get available users to add to project
    const availableUsers = allUsers.filter((user) => !currentProject?.members.includes(user.id));

    // Task detail functions
    const addComment = () => {
        if (!newComment.trim() || !selectedTaskForDetail) return;

        const comment: Comment = {
            id: `comment-${Date.now()}`,
            content: newComment,
            authorId: currentUser.id,
            createdAt: new Date().toISOString()
        };

        const activity: ActivityEntry = {
            id: `act-${Date.now()}`,
            type: 'commented',
            description: 'Added a comment',
            userId: currentUser.id,
            createdAt: new Date().toISOString()
        };

        updateTask(selectedTaskForDetail.id, {
            comments: [...selectedTaskForDetail.comments, comment],
            activity: [...selectedTaskForDetail.activity, activity]
        });

        setNewComment('');
    };

    const addTimeEntry = () => {
        if (!newTimeEntry.description.trim() || !newTimeEntry.hours || !selectedTaskForDetail) return;

        const timeEntry: TimeEntry = {
            id: `time-${Date.now()}`,
            description: newTimeEntry.description,
            hours: newTimeEntry.hours,
            userId: currentUser.id,
            date: newTimeEntry.date || new Date().toISOString().split('T')[0],
            createdAt: new Date().toISOString()
        };

        const currentActualHours = selectedTaskForDetail.actualHours || 0;
        const newActualHours = currentActualHours + newTimeEntry.hours;

        updateTask(selectedTaskForDetail.id, {
            timeEntries: [...selectedTaskForDetail.timeEntries, timeEntry],
            actualHours: newActualHours
        });

        setNewTimeEntry({ description: '', hours: 0, date: '' });
    };

    const addSubtask = () => {
        if (!newSubtask.trim() || !selectedTaskForDetail) return;

        const subtask: Subtask = {
            id: `sub-${Date.now()}`,
            title: newSubtask,
            completed: false,
            createdAt: new Date().toISOString()
        };

        updateTask(selectedTaskForDetail.id, {
            subtasks: [...selectedTaskForDetail.subtasks, subtask]
        });

        setNewSubtask('');
    };

    const toggleSubtask = (subtaskId: string) => {
        if (!selectedTaskForDetail) return;

        const updatedSubtasks = selectedTaskForDetail.subtasks.map((subtask) =>
            subtask.id === subtaskId ? { ...subtask, completed: !subtask.completed } : subtask
        );

        updateTask(selectedTaskForDetail.id, {
            subtasks: updatedSubtasks
        });
    };

    const updateTask = (taskId: string, updates: Partial<Task>) => {
        const newProjects = projects.map((project) => {
            if (project.id === currentProjectId) {
                const newColumns = project.columns.map((column) => ({
                    ...column,
                    tasks: column.tasks.map((task) => {
                        if (task.id === taskId) {
                            const updatedTask = { ...task, ...updates, updatedAt: new Date().toISOString() };
                            if (selectedTaskForDetail?.id === taskId) {
                                setSelectedTaskForDetail(updatedTask);
                            }

                            return updatedTask;
                        }

                        return task;
                    })
                }));

                return { ...project, columns: newColumns };
            }

            return project;
        });

        setProjects(newProjects);
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getRelatedTasks = (taskIds: string[]) => {
        if (!currentProject) return [];
        const allTasks = currentProject.columns.flatMap((col) => col.tasks);

        return allTasks.filter((task) => taskIds.includes(task.id));
    };

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

                            const activityEntry: ActivityEntry = {
                                id: `act-${Date.now()}`,
                                type: 'assigned',
                                description: assigneeId
                                    ? `Assigned to ${allUsers.find((u) => u.id === assigneeId)?.name}`
                                    : 'Unassigned',
                                userId: currentUser.id,
                                createdAt: new Date().toISOString()
                            };

                            const updatedTask = {
                                ...task,
                                assigneeId: assigneeId || undefined,
                                assignmentHistory: [...task.assignmentHistory, assignmentEntry],
                                activity: [...task.activity, activityEntry],
                                updatedAt: new Date().toISOString()
                            };

                            if (selectedTaskForDetail?.id === taskId) {
                                setSelectedTaskForDetail(updatedTask);
                            }

                            return updatedTask;
                        }

                        return task;
                    })
                }));

                return { ...project, columns: newColumns };
            }

            return project;
        });

        setProjects(newProjects);

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

        // Add activity entry for task movement
        const activityEntry: ActivityEntry = {
            id: `act-${Date.now()}`,
            type: 'moved',
            description: `Moved from ${sourceColumn.title} to ${destColumn.title}`,
            userId: currentUser.id,
            createdAt: new Date().toISOString()
        };

        const updatedTask = {
            ...task,
            status: destColumn.id as Task['status'],
            activity: [...task.activity, activityEntry],
            updatedAt: new Date().toISOString()
        };

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
                        newTasks.splice(destination.index, 0, updatedTask);

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

        if (selectedTaskForDetail?.id === draggableId) {
            setSelectedTaskForDetail(updatedTask);
        }
    };

    const createTask = async () => {
        console.log("creating task")
        if (!newTask.title.trim() || !session?.accessToken) {
            if (!session?.accessToken) {
                toast({
                    title: 'Authentication Error',
                    description: 'You are not logged in. Please log in to create a task.',
                    variant: 'destructive'
                });
            }

            return;
        }

        setIsLoading(true);

        try {

            const taskPayload = {
                title: newTask.title, 
                description: newTask.description || undefined, 
                teamId: '634577e5-c57b-4772-80fa-92b2a796e507',
                priority: newTask.priority || undefined, 
                status: 'todo', 
                assigneeId: newTask.assigneeId === 'unassigned' ? undefined : newTask.assigneeId, // Optional
                dueDate: newTask.dueDate ? new Date(newTask.dueDate).toISOString() : undefined, // Optional
                estimatedHours: newTask.estimatedHours || undefined, // Optional
                labels: newTask.labels.length > 0
                    ? newTask.labels.map((label) => ({
                          name: label,
                          color: 'bg-blue-500',
                          textColor: 'text-white',
                      }))
                    : undefined, 
            };
            console.log("Task Payload:", taskPayload);
            const response = await api.post(
                `/teams/634577e5-c57b-4772-80fa-92b2a796e507/tasks`,
                taskPayload, 
                {
                    headers: { 
                      Authorization: `Bearer ${session.accessToken}`,
                    },
                }
            );

            const task = response.data;
            console.log("data -> ", task)


            const newProjects = projects.map((project) => {
                if (project.id === currentProjectId) {
                    const newColumns = project.columns.map((column) => {
                        if (column.id === 'todo') {
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
                dueDate: '',
                estimatedHours: 0
            });
            setIsCreateTaskOpen(false);
            toast({
                title: 'Task Created',
                description: 'The task was created successfully.'
            });
        } catch (error) {
            console.error('Error creating task:', error);
            toast({
                title: 'Error',
                description: 'Failed to create task. Please try again.',
                variant: 'destructive'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const createProject = () => {
        if (!newProject.name.trim()) return;

        const project: Project = {
            id: `project-${Date.now()}`,
            name: newProject.name,
            description: newProject.description,
            color: newProject.color,
            members: [currentUser.id],
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
        if (!currentProject || userId === currentUser.id) return;

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
    const deleteTask = (taskId: string) => {
        const newProjects = projects.map((project) => {
            if (project.id === currentProjectId) {
                const newColumns = project.columns.map((column) => ({
                    ...column,
                    tasks: column.tasks.filter((task) => task.id !== taskId)
                }));

                return { ...project, columns: newColumns };
            }

            return project;
        });
        setProjects(newProjects);
        setIsDeleteConfirmOpen(false);
        setTaskToDelete(null);
        toast({ title: 'Task Deleted', description: 'The task was deleted successfully.' });
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
                        <Dialog open={isCreateTaskOpen} onOpenChange={setIsCreateTaskOpen}>
                            <DialogTrigger asChild>
                                <Button>
                                    <Plus className='mr-2 h-4 w-4' />
                                    New Task
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
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
                                                    {teamMembers.map((member) => (
                                                        <SelectItem key={member.id} value={member.id}>
                                                            {member.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div className='grid grid-cols-2 gap-4'>
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
                                        <div>
                                            <Label htmlFor='task-estimated-hours'>Estimated Hours</Label>
                                            <Input
                                                id='task-estimated-hours'
                                                type='number'
                                                value={newTask.estimatedHours || ''}
                                                onChange={(e) =>
                                                    setNewTask({
                                                        ...newTask,
                                                        estimatedHours: Number(e.target.value)
                                                    })
                                                }
                                                placeholder='0'
                                            />
                                        </div>
                                    </div>
                                    <Button onClick={() => {createTask();}} className='w-full'>
                                        Create Task
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
                                <Avatar key={member.id} className='h-8 w-8 border-2 border-white'>
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
                                                {teamMembers.map((member) => (
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
                        <Dialog open={isEditTaskOpen} onOpenChange={setIsEditTaskOpen}>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Edit Task</DialogTitle>
                                </DialogHeader>
                                {taskToEdit && (
                                    <form
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            const form = e.target as HTMLFormElement;
                                            updateTask(taskToEdit.id, {
                                                //@ts-ignore
                                                title: form.title.value,
                                                description: form.description.value
                                                // ...add other fields as needed
                                            });
                                            setIsEditTaskOpen(false);
                                            setTaskToEdit(null);
                                        }}>
                                        <div>
                                            <Label htmlFor='title'>Title</Label>
                                            <Input name='title' id='title' defaultValue={taskToEdit.title} required />
                                        </div>
                                        <div>
                                            <Label htmlFor='description'>Description</Label>
                                            <Textarea
                                                name='description'
                                                id='description'
                                                defaultValue={taskToEdit.description}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor='dueDate'>Due Date</Label>
                                            <Input
                                                name='dueDate'
                                                id='dueDate'
                                                type='date'
                                                defaultValue={taskToEdit.dueDate ? taskToEdit.dueDate : ''}
                                            />
                                        </div>
                                        <div className='flex justify-end gap-2'>
                                            <Button
                                                type='button'
                                                variant='outline'
                                                onClick={() => setIsEditTaskOpen(false)}>
                                                Cancel
                                            </Button>
                                            <Button type='submit'>Save</Button>
                                        </div>
                                    </form>
                                )}
                            </DialogContent>
                        </Dialog>
                        <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
                            <DialogTrigger asChild>
                                <Button variant='outline' size='sm'>
                                    <Users className='mr-2 h-4 w-4' />
                                    Delete Task
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Delete Task</DialogTitle>
                                </DialogHeader>
                                <div>Are you sure you want to delete this task?</div>
                                <div className='mt-4 flex gap-2'>
                                    <Button
                                        variant='destructive'
                                        onClick={() => {
                                            if (taskToDelete) deleteTask(taskToDelete.id);
                                        }}>
                                        Delete
                                    </Button>
                                    <Button variant='outline' onClick={() => setIsDeleteConfirmOpen(false)}>
                                        Cancel
                                    </Button>
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
                ;{/* Assignment Dialog */}
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
                                            {teamMembers.map((member) => (
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
                ;{/* Task Detail Dialog */}
                <Dialog open={isTaskDetailOpen} onOpenChange={setIsTaskDetailOpen}>
                    <DialogContent className='!sm:max-w-full max-h-[90vh] !overflow-auto'>
                        <DialogHeader>
                            <DialogTitle className='flex items-center space-x-2'>
                                <span>{selectedTaskForDetail?.taskId}</span>
                                <Badge
                                    className={
                                        selectedTaskForDetail?.priority === 'high'
                                            ? 'bg-red-500'
                                            : selectedTaskForDetail?.priority === 'medium'
                                              ? 'bg-yellow-500'
                                              : 'bg-green-500'
                                    }>
                                    {selectedTaskForDetail?.priority}
                                </Badge>
                            </DialogTitle>
                        </DialogHeader>
                        {selectedTaskForDetail && (
                            <div className='grid h-full grid-cols-3 gap-6'>
                                {/* Main Content */}
                                <div className='col-span-2 space-y-6'>
                                    <div>
                                        <h3 className='mb-2 text-xl font-semibold'>{selectedTaskForDetail.title}</h3>
                                        {selectedTaskForDetail.description && (
                                            <p className='mb-4 text-gray-600'>{selectedTaskForDetail.description}</p>
                                        )}
                                        <div className='flex flex-wrap gap-2'>
                                            {selectedTaskForDetail.labels.map((label, index) => (
                                                <Badge key={index} className={`${label.color} ${label.textColor}`}>
                                                    {label.name}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>

                                    <Tabs defaultValue='comments' className='w-full'>
                                        <TabsList className='grid w-full grid-cols-5'>
                                            <TabsTrigger value='comments'>Comments</TabsTrigger>
                                            <TabsTrigger value='subtasks'>Subtasks</TabsTrigger>
                                            <TabsTrigger value='time'>Time</TabsTrigger>
                                            <TabsTrigger value='attachments'>Files</TabsTrigger>
                                            <TabsTrigger value='activity'>Activity</TabsTrigger>
                                        </TabsList>

                                        <TabsContent value='comments' className='space-y-4'>
                                            <div className='max-h-64 space-y-4 overflow-y-auto'>
                                                {selectedTaskForDetail.comments.map((comment) => {
                                                    const author = allUsers.find((u) => u.id === comment.authorId);

                                                    return (
                                                        <div key={comment.id} className='flex space-x-3'>
                                                            <Avatar className='h-8 w-8'>
                                                                <AvatarImage
                                                                    src={author?.avatar || '/placeholder.svg'}
                                                                />
                                                                <AvatarFallback>{author?.initials}</AvatarFallback>
                                                            </Avatar>
                                                            <div className='flex-1'>
                                                                <div className='mb-1 flex items-center space-x-2'>
                                                                    <span className='text-sm font-medium'>
                                                                        {author?.name}
                                                                    </span>
                                                                    <span className='text-xs text-gray-500'>
                                                                        {formatDate(comment.createdAt)}
                                                                    </span>
                                                                </div>
                                                                <p className='text-sm text-gray-700'>
                                                                    {comment.content}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                            <div className='flex space-x-2'>
                                                <Textarea
                                                    placeholder='Add a comment...'
                                                    value={newComment}
                                                    onChange={(e) => setNewComment(e.target.value)}
                                                    className='flex-1'
                                                />
                                                <Button onClick={addComment} disabled={!newComment.trim()}>
                                                    <MessageSquare className='h-4 w-4' />
                                                </Button>
                                            </div>
                                        </TabsContent>

                                        <TabsContent value='subtasks' className='space-y-4'>
                                            <div className='max-h-64 space-y-2 overflow-y-auto'>
                                                {selectedTaskForDetail.subtasks.map((subtask) => {
                                                    const assignee = subtask.assigneeId
                                                        ? allUsers.find((u) => u.id === subtask.assigneeId)
                                                        : null;

                                                    return (
                                                        <div
                                                            key={subtask.id}
                                                            className='flex items-center space-x-3 rounded border p-2'>
                                                            <input
                                                                type='checkbox'
                                                                checked={subtask.completed}
                                                                onChange={() => toggleSubtask(subtask.id)}
                                                            />
                                                            <span
                                                                className={`flex-1 ${subtask.completed ? 'text-gray-500 line-through' : ''}`}>
                                                                {subtask.title}
                                                            </span>
                                                            {assignee && (
                                                                <Avatar className='h-6 w-6'>
                                                                    <AvatarImage
                                                                        src={assignee.avatar || '/placeholder.svg'}
                                                                    />
                                                                    <AvatarFallback className='text-xs'>
                                                                        {assignee.initials}
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                            <div className='flex space-x-2'>
                                                <Input
                                                    placeholder='Add a subtask...'
                                                    value={newSubtask}
                                                    onChange={(e) => setNewSubtask(e.target.value)}
                                                    className='flex-1'
                                                />
                                                <Button onClick={addSubtask} disabled={!newSubtask.trim()}>
                                                    <Plus className='h-4 w-4' />
                                                </Button>
                                            </div>
                                        </TabsContent>

                                        <TabsContent value='time' className='space-y-4'>
                                            <div className='grid grid-cols-2 gap-4 rounded-lg bg-gray-50 p-4'>
                                                <div>
                                                    <Label className='text-sm font-medium'>Estimated Hours</Label>
                                                    <p className='text-lg font-semibold'>
                                                        {selectedTaskForDetail.estimatedHours || 0}h
                                                    </p>
                                                </div>
                                                <div>
                                                    <Label className='text-sm font-medium'>Actual Hours</Label>
                                                    <p className='text-lg font-semibold'>
                                                        {selectedTaskForDetail.actualHours || 0}h
                                                    </p>
                                                </div>
                                            </div>
                                            <div className='max-h-48 space-y-2 overflow-y-auto'>
                                                {selectedTaskForDetail.timeEntries.map((entry) => {
                                                    const user = allUsers.find((u) => u.id === entry.userId);

                                                    return (
                                                        <div
                                                            key={entry.id}
                                                            className='flex items-center justify-between rounded border p-2'>
                                                            <div className='flex items-center space-x-2'>
                                                                <Avatar className='h-6 w-6'>
                                                                    <AvatarImage
                                                                        src={user?.avatar || '/placeholder.svg'}
                                                                    />
                                                                    <AvatarFallback className='text-xs'>
                                                                        {user?.initials}
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                                <div>
                                                                    <p className='text-sm font-medium'>
                                                                        {entry.description}
                                                                    </p>
                                                                    <p className='text-xs text-gray-500'>
                                                                        {entry.date}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <Badge variant='outline'>{entry.hours}h</Badge>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                            <div className='grid grid-cols-3 gap-2'>
                                                <Input
                                                    placeholder='Description'
                                                    value={newTimeEntry.description}
                                                    onChange={(e) =>
                                                        setNewTimeEntry({
                                                            ...newTimeEntry,
                                                            description: e.target.value
                                                        })
                                                    }
                                                />
                                                <Input
                                                    type='number'
                                                    placeholder='Hours'
                                                    value={newTimeEntry.hours || ''}
                                                    onChange={(e) =>
                                                        setNewTimeEntry({
                                                            ...newTimeEntry,
                                                            hours: Number(e.target.value)
                                                        })
                                                    }
                                                />
                                                <Button
                                                    onClick={addTimeEntry}
                                                    disabled={!newTimeEntry.description || !newTimeEntry.hours}>
                                                    <Clock className='h-4 w-4' />
                                                </Button>
                                            </div>
                                        </TabsContent>

                                        <TabsContent value='attachments' className='space-y-4'>
                                            <div className='max-h-64 space-y-2 overflow-y-auto'>
                                                {selectedTaskForDetail.attachments.map((attachment) => {
                                                    const uploader = allUsers.find(
                                                        (u) => u.id === attachment.uploadedBy
                                                    );

                                                    return (
                                                        <div
                                                            key={attachment.id}
                                                            className='flex items-center space-x-3 rounded border p-2'>
                                                            <Paperclip className='h-4 w-4 text-gray-500' />
                                                            <div className='flex-1'>
                                                                <p className='text-sm font-medium'>{attachment.name}</p>
                                                                <p className='text-xs text-gray-500'>
                                                                    {formatFileSize(attachment.size)} • {uploader?.name}{' '}
                                                                    • {formatDate(attachment.uploadedAt)}
                                                                </p>
                                                            </div>
                                                            <Button variant='ghost' size='sm'>
                                                                <Eye className='h-4 w-4' />
                                                            </Button>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                            <Button variant='outline' className='w-full'>
                                                <Paperclip className='mr-2 h-4 w-4' />
                                                Upload File
                                            </Button>
                                        </TabsContent>

                                        <TabsContent value='activity' className='space-y-4'>
                                            <ScrollArea className='h-64'>
                                                <div className='space-y-3'>
                                                    {selectedTaskForDetail.activity.map((activity) => {
                                                        const user = allUsers.find((u) => u.id === activity.userId);

                                                        return (
                                                            <div key={activity.id} className='flex space-x-3'>
                                                                <Avatar className='h-6 w-6'>
                                                                    <AvatarImage
                                                                        src={user?.avatar || '/placeholder.svg'}
                                                                    />
                                                                    <AvatarFallback className='text-xs'>
                                                                        {user?.initials}
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                                <div className='flex-1'>
                                                                    <p className='text-sm'>
                                                                        <span className='font-medium'>
                                                                            {user?.name}
                                                                        </span>{' '}
                                                                        {activity.description}
                                                                    </p>
                                                                    <p className='text-xs text-gray-500'>
                                                                        {formatDate(activity.createdAt)}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </ScrollArea>
                                        </TabsContent>
                                    </Tabs>
                                </div>

                                {/* Sidebar */}
                                <div className='space-y-6'>
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className='text-sm'>Details</CardTitle>
                                        </CardHeader>
                                        <CardContent className='space-y-4'>
                                            <div>
                                                <Label className='text-xs text-gray-500'>Assignee</Label>
                                                <div className='mt-1 flex items-center space-x-2'>
                                                    {selectedTaskForDetail.assigneeId ? (
                                                        <>
                                                            <Avatar className='h-6 w-6'>
                                                                <AvatarImage
                                                                    src={
                                                                        allUsers.find(
                                                                            (u) =>
                                                                                u.id ===
                                                                                selectedTaskForDetail.assigneeId
                                                                        )?.avatar || '/placeholder.svg'
                                                                    }
                                                                />
                                                                <AvatarFallback className='text-xs'>
                                                                    {
                                                                        allUsers.find(
                                                                            (u) =>
                                                                                u.id ===
                                                                                selectedTaskForDetail.assigneeId
                                                                        )?.initials
                                                                    }
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <span className='text-sm'>
                                                                {
                                                                    allUsers.find(
                                                                        (u) => u.id === selectedTaskForDetail.assigneeId
                                                                    )?.name
                                                                }
                                                            </span>
                                                        </>
                                                    ) : (
                                                        <span className='text-sm text-gray-500'>Unassigned</span>
                                                    )}
                                                </div>
                                            </div>

                                            <div>
                                                <Label className='text-xs text-gray-500'>Status</Label>
                                                <p className='mt-1 text-sm capitalize'>
                                                    {selectedTaskForDetail.status.replace('_', ' ')}
                                                </p>
                                            </div>

                                            <div>
                                                <Label className='text-xs text-gray-500'>Priority</Label>
                                                <Badge
                                                    className={`mt-1 ${
                                                        selectedTaskForDetail.priority === 'high'
                                                            ? 'bg-red-500'
                                                            : selectedTaskForDetail.priority === 'medium'
                                                              ? 'bg-yellow-500'
                                                              : 'bg-green-500'
                                                    }`}>
                                                    {selectedTaskForDetail.priority}
                                                </Badge>
                                            </div>

                                            {selectedTaskForDetail.dueDate && (
                                                <div>
                                                    <Label className='text-xs text-gray-500'>Due Date</Label>
                                                    <div className='mt-1 flex items-center space-x-2'>
                                                        <Calendar className='h-4 w-4 text-gray-500' />
                                                        <span className='text-sm'>
                                                            {new Date(
                                                                selectedTaskForDetail.dueDate
                                                            ).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                </div>
                                            )}

                                            <div>
                                                <Label className='text-xs text-gray-500'>Created</Label>
                                                <p className='mt-1 text-sm'>
                                                    {formatDate(selectedTaskForDetail.createdAt)}
                                                </p>
                                            </div>

                                            {selectedTaskForDetail.updatedAt && (
                                                <div>
                                                    <Label className='text-xs text-gray-500'>Updated</Label>
                                                    <p className='mt-1 text-sm'>
                                                        {formatDate(selectedTaskForDetail.updatedAt)}
                                                    </p>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>

                                    {selectedTaskForDetail.relatedTasks.length > 0 && (
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className='text-sm'>Related Tasks</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className='space-y-2'>
                                                    {getRelatedTasks(selectedTaskForDetail.relatedTasks).map((task) => (
                                                        <div
                                                            key={task.id}
                                                            className='flex items-center space-x-2 rounded border p-2 text-sm'>
                                                            <ArrowRight className='h-3 w-3 text-gray-500' />
                                                            <span className='flex-1'>{task.title}</span>
                                                            <Badge variant='outline' className='text-xs'>
                                                                {task.taskId}
                                                            </Badge>
                                                        </div>
                                                    ))}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )}

                                    <Card>
                                        <CardHeader>
                                            <CardTitle className='text-sm'>Progress</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className='space-y-3'>
                                                <div>
                                                    <div className='mb-1 flex justify-between text-sm'>
                                                        <span>Subtasks</span>
                                                        <span>
                                                            {
                                                                selectedTaskForDetail.subtasks.filter(
                                                                    (s) => s.completed
                                                                ).length
                                                            }
                                                            /{selectedTaskForDetail.subtasks.length}
                                                        </span>
                                                    </div>
                                                    <div className='h-2 w-full rounded-full bg-gray-200'>
                                                        <div
                                                            className='h-2 rounded-full bg-blue-600'
                                                            style={{
                                                                width: `${
                                                                    selectedTaskForDetail.subtasks.length > 0
                                                                        ? (selectedTaskForDetail.subtasks.filter(
                                                                              (s) => s.completed
                                                                          ).length /
                                                                              selectedTaskForDetail.subtasks.length) *
                                                                          100
                                                                        : 0
                                                                }%`
                                                            }}
                                                        />
                                                    </div>
                                                </div>

                                                {selectedTaskForDetail.estimatedHours && (
                                                    <div>
                                                        <div className='mb-1 flex justify-between text-sm'>
                                                            <span>Time Progress</span>
                                                            <span>
                                                                {selectedTaskForDetail.actualHours || 0}h /{' '}
                                                                {selectedTaskForDetail.estimatedHours}h
                                                            </span>
                                                        </div>
                                                        <div className='h-2 w-full rounded-full bg-gray-200'>
                                                            <div
                                                                className='h-2 rounded-full bg-green-600'
                                                                style={{
                                                                    width: `${Math.min(
                                                                        ((selectedTaskForDetail.actualHours || 0) /
                                                                            selectedTaskForDetail.estimatedHours) *
                                                                            100,
                                                                        100
                                                                    )}%`
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader>
                                            <CardTitle className='text-sm'>Assignment History</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className='max-h-32 space-y-2 overflow-y-auto'>
                                                {selectedTaskForDetail.assignmentHistory.map((entry, index) => {
                                                    const assignedBy = allUsers.find((u) => u.id === entry.assignedBy);
                                                    const assignee = entry.assigneeId
                                                        ? allUsers.find((u) => u.id === entry.assigneeId)
                                                        : null;

                                                    return (
                                                        <div key={index} className='text-xs text-gray-600'>
                                                            <div className='flex items-center space-x-1'>
                                                                <History className='h-3 w-3' />
                                                                <span>
                                                                    {entry.action}{' '}
                                                                    {assignee ? `to ${assignee.name}` : ''} by{' '}
                                                                    {assignedBy?.name}
                                                                </span>
                                                            </div>
                                                            <p className='ml-4 text-gray-500'>
                                                                {formatDate(entry.assignedAt)}
                                                            </p>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
                ;{/* Kanban Board */}
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
                                                                } `}>
                                                                <CardContent className='p-4'>
                                                                    <div className='mb-2 flex items-start justify-between'>
                                                                        <h4
                                                                            className='cursor-pointer text-sm leading-tight font-medium hover:text-blue-600'
                                                                            onClick={() => {
                                                                                setSelectedTaskForDetail(task);
                                                                                setIsTaskDetailOpen(true);
                                                                            }}>
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
                                                                                        setSelectedTaskForDetail(task);
                                                                                        setIsTaskDetailOpen(true);
                                                                                    }}>
                                                                                    <Eye className='mr-2 h-4 w-4' />
                                                                                    View Details
                                                                                </DropdownMenuItem>
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
                                                                                <DropdownMenuItem
                                                                                    onClick={() => {
                                                                                        setTaskToEdit(task);
                                                                                        setIsEditTaskOpen(true);
                                                                                    }}>
                                                                                    <Edit className='mr-2 h-4 w-4' />
                                                                                    Edit
                                                                                </DropdownMenuItem>
                                                                                <DropdownMenuItem
                                                                                    onClick={() => {
                                                                                        setTaskToDelete(task);
                                                                                        console.log(
                                                                                            'Task to delete:',
                                                                                            task
                                                                                        );
                                                                                        setIsDeleteConfirmOpen(true);
                                                                                    }}
                                                                                    className='text-red-600'>
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
                ;
            </div>
        </div>
    );
}
