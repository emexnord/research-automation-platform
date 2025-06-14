'use client';

import { useState } from 'react';
<<<<<<< Updated upstream



import { toast } from '@/components/ui/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/registry/new-york-v4/ui/avatar';
import { Badge } from '@/registry/new-york-v4/ui/badge';
import { Button } from '@/registry/new-york-v4/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/registry/new-york-v4/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/registry/new-york-v4/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/registry/new-york-v4/ui/dropdown-menu';
import { Input } from '@/registry/new-york-v4/ui/input';
import { Label } from '@/registry/new-york-v4/ui/label';
import { ScrollArea } from '@/registry/new-york-v4/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/registry/new-york-v4/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/registry/new-york-v4/ui/tabs';
import { Textarea } from '@/registry/new-york-v4/ui/textarea';
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';



import { ArrowRight, Calendar, Clock, Edit, Eye, History, MessageSquare, MoreHorizontal, Paperclip, Plus, Search, Trash2, UserCheck, UserPlus, UserX, Users } from 'lucide-react';





interface User {
    id: string;
    name: string;
    email: string;
    avatar: string;
    initials: string;
    role: 'admin' | 'member' | 'viewer';
}
=======
import { DragDropContext, Draggable, Droppable, DropResult } from '@hello-pangea/dnd';
import { Avatar, AvatarFallback, AvatarImage } from '@/registry/new-york-v4/ui/avatar';
import { Badge } from '@/registry/new-york-v4/ui/badge';
import { Button } from '@/registry/new-york-v4/ui/button';
import { Card, CardContent } from '@/registry/new-york-v4/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/registry/new-york-v4/ui/dropdown-menu';
import { Input } from '@/registry/new-york-v4/ui/input';
import {
    AlertCircle,
    BarChart3,
    Bell,
    ChevronDown,
    Code,
    HelpCircle,
    Kanban,
    List,
    Map,
    MoreHorizontal,
    Package,
    Plus,
    Search,
    Settings,
    Shield,
    Star
} from 'lucide-react';
>>>>>>> Stashed changes

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
    taskId: string;
    assignee?: {
        name: string;
        avatar: string;
        initials: string;
    };
    labels: Array<{
        name: string;
        color: string;
        textColor: string;
    }>;
    priority: 'low' | 'medium' | 'high';
<<<<<<< Updated upstream
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
=======
>>>>>>> Stashed changes
}

interface Column {
    id: string;
    title: string;
    count: number;
    tasks: Task[];
    color: string;
    headerColor: string;
}

<<<<<<< Updated upstream
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
=======
const initialData: Column[] = [
    {
        id: 'todo',
        title: 'TO DO',
        count: 5,
        color: 'bg-gradient-to-br from-slate-50 to-slate-100',
        headerColor: 'bg-slate-200',
        tasks: [
            {
                id: '1',
                title: 'Optimize experience for mobile web',
                taskId: 'NUC-344',
                priority: 'high',
                assignee: { name: 'John Doe', avatar: '/placeholder.svg?height=24&width=24', initials: 'JD' },
                labels: [{ name: 'BILLING', color: 'bg-blue-500', textColor: 'text-white' }]
            },
            {
                id: '2',
                title: 'Onboard workout options (OWO)',
                taskId: 'NUC-360',
                priority: 'medium',
                assignee: { name: 'Jane Smith', avatar: '/placeholder.svg?height=24&width=24', initials: 'JS' },
                labels: [{ name: 'ACCOUNTS', color: 'bg-emerald-500', textColor: 'text-white' }]
            },
            {
                id: '3',
                title: 'Multi-dest search UI mobileweb',
                taskId: 'NUC-337',
                priority: 'low',
                assignee: { name: 'Mike Johnson', avatar: '/placeholder.svg?height=24&width=24', initials: 'MJ' },
                labels: [{ name: 'ACCOUNTS', color: 'bg-emerald-500', textColor: 'text-white' }]
            },
            {
                id: '4',
                title: 'Billing system integration - frontend',
                taskId: 'NUC-339',
                priority: 'medium',
                assignee: { name: 'Sarah Wilson', avatar: '/placeholder.svg?height=24&width=24', initials: 'SW' },
                labels: [{ name: 'FORMS', color: 'bg-purple-500', textColor: 'text-white' }]
            },
            {
                id: '5',
                title: 'Account settings defaults',
                taskId: 'NUC-340',
                priority: 'low',
                assignee: { name: 'Alex Brown', avatar: '/placeholder.svg?height=24&width=24', initials: 'AB' },
                labels: [{ name: 'ACCOUNTS', color: 'bg-emerald-500', textColor: 'text-white' }]
            }
        ]
    },
    {
        id: 'progress',
        title: 'IN PROGRESS',
        count: 3,
        color: 'bg-gradient-to-br from-slate-50 to-slate-100',
        headerColor: 'bg-blue-200',
        tasks: [
            {
                id: '6',
                title: 'Fast trip search',
                taskId: 'NUC-342',
                priority: 'high',
                assignee: { name: 'Chris Davis', avatar: '/placeholder.svg?height=24&width=24', initials: 'CD' },
                labels: [{ name: 'ACCOUNTS', color: 'bg-emerald-500', textColor: 'text-white' }]
            },
            {
                id: '7',
                title: 'Affelife links integration - frontend',
                taskId: 'NUC-335',
                priority: 'medium',
                assignee: { name: 'Emma Wilson', avatar: '/placeholder.svg?height=24&width=24', initials: 'EW' },
                labels: [{ name: 'BILLING', color: 'bg-blue-500', textColor: 'text-white' }]
            },
            {
                id: '8',
                title: 'Shopping cart purchasing error - quick fix required',
                taskId: 'NUC-341',
                priority: 'high',
                assignee: { name: 'David Lee', avatar: '/placeholder.svg?height=24&width=24', initials: 'DL' },
                labels: [{ name: 'FORMS', color: 'bg-purple-500', textColor: 'text-white' }]
            }
        ]
    },
    {
        id: 'review',
        title: 'IN REVIEW',
        count: 4,
        color: 'bg-gradient-to-br from-slate-50 to-slate-100',
        headerColor: 'bg-amber-200',
        tasks: [
            {
                id: '9',
                title: 'Revise and streamline booking flow',
                taskId: 'NUC-367',
                priority: 'medium',
                assignee: { name: 'Lisa Garcia', avatar: '/placeholder.svg?height=24&width=24', initials: 'LG' },
                labels: [{ name: 'ACCOUNTS', color: 'bg-emerald-500', textColor: 'text-white' }]
>>>>>>> Stashed changes
            },
            {
                id: '10',
                title: 'Travel suggestion experiments',
                taskId: 'NUC-368',
                priority: 'low',
                assignee: { name: 'Tom Anderson', avatar: '/placeholder.svg?height=24&width=24', initials: 'TA' },
                labels: [{ name: 'ACCOUNTS', color: 'bg-emerald-500', textColor: 'text-white' }]
            },
            {
                id: '11',
                title: 'Ongoing customer satisfaction',
                taskId: 'NUC-354',
                priority: 'medium',
                assignee: { name: 'Rachel Kim', avatar: '/placeholder.svg?height=24&width=24', initials: 'RK' },
                labels: [{ name: 'ACCOUNTS', color: 'bg-emerald-500', textColor: 'text-white' }]
            },
            {
                id: '12',
                title: 'Planet Taxi Device exploration & research',
                taskId: 'NUC-351',
                priority: 'low',
                assignee: { name: 'Kevin Chen', avatar: '/placeholder.svg?height=24&width=24', initials: 'KC' },
                labels: [{ name: 'FEEDBACK', color: 'bg-orange-500', textColor: 'text-white' }]
            }
        ]
    },
    {
        id: 'done',
        title: 'DONE',
        count: 2,
        color: 'bg-gradient-to-br from-slate-50 to-slate-100',
        headerColor: 'bg-green-200',
        tasks: [
            {
                id: '13',
                title: 'High outage: Software bug fix - BG Web-store app crashing',
                taskId: 'NUC-340',
                priority: 'high',
                assignee: { name: 'Mark Taylor', avatar: '/placeholder.svg?height=24&width=24', initials: 'MT' },
                labels: [{ name: 'BILLING', color: 'bg-blue-500', textColor: 'text-white' }]
            },
            {
                id: '14',
                title: 'Web-store purchasing performance issue fix...t',
                taskId: 'NUC-341',
                priority: 'medium',
                assignee: { name: 'Nina Rodriguez', avatar: '/placeholder.svg?height=24&width=24', initials: 'NR' },
                labels: [{ name: 'FORMS', color: 'bg-purple-500', textColor: 'text-white' }]
            }
        ]
    }
];

const teamMembers = [
    { name: 'John Doe', avatar: '/placeholder.svg?height=32&width=32', initials: 'JD' },
    { name: 'Jane Smith', avatar: '/placeholder.svg?height=32&width=32', initials: 'JS' },
    { name: 'Mike Johnson', avatar: '/placeholder.svg?height=32&width=32', initials: 'MJ' },
    { name: 'Sarah Wilson', avatar: '/placeholder.svg?height=32&width=32', initials: 'SW' }
];

export default function JiraClone() {
    const [columns, setColumns] = useState<Column[]>(initialData);
    const [searchTerm, setSearchTerm] = useState('');
<<<<<<< Updated upstream
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
=======

    const onDragEnd = (result: DropResult) => {
>>>>>>> Stashed changes
        const { destination, source, draggableId } = result;

        if (!destination) return;
        if (destination.droppableId === source.droppableId && destination.index === source.index) return;

        const sourceColumn = columns.find((col) => col.id === source.droppableId);
        const destColumn = columns.find((col) => col.id === destination.droppableId);

        if (!sourceColumn || !destColumn) return;

        const task = sourceColumn.tasks.find((task) => task.id === draggableId);
        if (!task) return;

<<<<<<< Updated upstream
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

    const createTask = () => {
        if (!newTask.title.trim() || !currentProject) return;

        const task: Task = {
            id: `task-${Date.now()}`,
            title: newTask.title,
            description: newTask.description,
            taskId: `${currentProject.name.substring(0, 2).toUpperCase()}-${String(Date.now()).slice(-3)}`,
            assigneeId: newTask.assigneeId || undefined,
            priority: newTask.priority,
            status: selectedColumnId as Task['status'],
            createdAt: new Date().toISOString(),
            dueDate: newTask.dueDate || undefined,
            estimatedHours: newTask.estimatedHours || undefined,
            actualHours: 0,
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
                : [],
            comments: [],
            attachments: [],
            timeEntries: [],
            subtasks: [],
            activity: [
                {
                    id: `act-${Date.now()}`,
                    type: 'created',
                    description: 'Task created',
                    userId: currentUser.id,
                    createdAt: new Date().toISOString()
                }
            ],
            relatedTasks: []
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
            dueDate: '',
            estimatedHours: 0
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
=======
        const newColumns = columns.map((column) => {
            if (column.id === source.droppableId) {
>>>>>>> Stashed changes
                return {
                    ...column,
                    tasks: column.tasks.filter((task) => task.id !== draggableId),
                    count: column.tasks.length - 1
                };
            }
            if (column.id === destination.droppableId) {
                const newTasks = [...column.tasks];
                newTasks.splice(destination.index, 0, task);

<<<<<<< Updated upstream
            return project;
        });

        setProjects(newProjects);
    };

    const removeMemberFromProject = (userId: string) => {
        if (!currentProject || userId === currentUser.id) return;

        const newProjects = projects.map((project) => {
            if (project.id === currentProjectId) {
=======
>>>>>>> Stashed changes
                return {
                    ...column,
                    tasks: newTasks,
                    count: newTasks.length
                };
            }
            return column; // Return unchanged column for other cases
        });

        setColumns(newColumns);
    };

    const filteredColumns = columns.map((column) => ({
        ...column,
        tasks: column.tasks.filter(
            (task) =>
                task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                task.taskId.toLowerCase().includes(searchTerm.toLowerCase())
        )
    }));

    return (
        <div className='min-h-screen bg-gradient-to-br from-slate-50 to-slate-100'>
            {/* Jira Header */}
            <header className='bg-gradient-to-r px-4 py-3 shadow-lg'>
                <div className='flex items-center justify-between'>
                    <div className='flex items-center space-x-6'>
                        <nav className='flex items-center space-x-4 text-sm'>
                            {['Your work', 'Projects', 'Filter', 'Dashboards', 'Teams', 'Plans', 'Apps'].map((item) => (
                                <DropdownMenu key={item}>
                                    <DropdownMenuTrigger className='flex items-center space-x-1 rounded-lg px-3 py-2 text-black transition-colors hover:bg-blue-500'>
                                        <span>{item}</span>
                                        <ChevronDown className='h-3 w-3' />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuItem>Option 1</DropdownMenuItem>
                                        <DropdownMenuItem>Option 2</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ))}
                        </nav>
                    </div>
                </div>
            </header>

            <div className='flex'>
                {/* Main Content */}
                <main className='flex-1 bg-gradient-to-br from-slate-50 to-slate-100'>
                    <div className='p-8'>
                        {/* Breadcrumb */}
                        <div className='mb-4 flex items-center text-sm text-gray-600'>
                            <span className='cursor-pointer hover:text-blue-600'>Projects</span>
                            <span className='mx-2 text-gray-400'>/</span>
                            <span className='font-medium text-blue-600'>Beyond Gravity</span>
                        </div>

<<<<<<< Updated upstream
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
=======
                        {/* Board Header */}
                        <div className='mb-8 flex items-center justify-between'>
                            <div className='flex items-center space-x-4'>
                                <h1 className='text-3xl font-bold text-gray-900'>Board</h1>
                                <Button
                                    variant='ghost'
                                    size='sm'
                                    className='text-yellow-500 hover:bg-yellow-50 hover:text-yellow-600'>
                                    <Star className='h-5 w-5' />
>>>>>>> Stashed changes
                                </Button>
                                <Button variant='ghost' size='sm' className='hover:bg-gray-100'>
                                    <MoreHorizontal className='h-5 w-5' />
                                </Button>
                            </div>
                        </div>

                        {/* Board Controls */}
                        <div className='mb-8 flex items-center justify-between rounded-xl bg-white p-6 shadow-sm'>
                            <div className='flex items-center space-x-6'>
                                <div className='relative'>
                                    <Search className='absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400' />
                                    <Input
                                        placeholder='Search tasks...'
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className='h-10 w-64 rounded-lg border-gray-200 pl-10 focus:border-blue-400'
                                    />
                                </div>
                                <div className='flex items-center -space-x-3'>
                                    {teamMembers.map((member, index) => (
                                        <Avatar
                                            key={index}
                                            className='h-10 w-10 cursor-pointer border-3 border-white shadow-md transition-transform hover:scale-110'>
                                            <AvatarImage src={member.avatar || '/placeholder.svg'} />
                                            <AvatarFallback className='bg-gradient-to-br from-blue-400 to-purple-500 text-sm font-semibold text-white'>
                                                {member.initials}
                                            </AvatarFallback>
                                        </Avatar>
                                    ))}
                                    <div className='flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-3 border-white bg-gradient-to-br from-gray-200 to-gray-300 text-sm font-semibold text-gray-700 shadow-md transition-transform hover:scale-110'>
                                        +3
                                    </div>
                                </div>
                            </div>
                            <div className='flex items-center space-x-4'>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant='outline'
                                            size='sm'
                                            className='border-blue-200 text-blue-600 hover:bg-blue-50'>
                                            Epic <ChevronDown className='ml-1 h-3 w-3' />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuItem>All epics</DropdownMenuItem>
                                        <DropdownMenuItem>No epic</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant='outline'
                                            size='sm'
                                            className='border-gray-200 text-gray-600 hover:bg-gray-50'>
                                            GROUP BY None <ChevronDown className='ml-1 h-3 w-3' />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuItem>None</DropdownMenuItem>
                                        <DropdownMenuItem>Assignee</DropdownMenuItem>
                                        <DropdownMenuItem>Epic</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                <Button
                                    variant='outline'
                                    size='sm'
                                    className='border-purple-200 text-purple-600 hover:bg-purple-50'>
                                    <BarChart3 className='mr-2 h-4 w-4' />
                                    Insights
                                </Button>
                            </div>
                        </div>

                        {/* Horizontal Kanban Board */}
                        <DragDropContext onDragEnd={onDragEnd}>
                            <div className='overflow-x-auto'>
                                <div className='flex min-w-max space-x-6 pb-6'>
                                    {filteredColumns.map((column) => (
                                        <div
                                            key={column.id}
                                            className={`${column.color} max-w-[320px] min-w-[320px] rounded-xl p-6 shadow-lg`}>
                                            <div
                                                className={`mb-6 flex items-center justify-between p-3 ${column.headerColor} rounded-lg`}>
                                                <div className='flex items-center space-x-3'>
                                                    <h3 className='text-sm font-bold tracking-wider text-gray-800 uppercase'>
                                                        {column.title}
                                                    </h3>
                                                    <span className='rounded-full bg-white px-3 py-1 text-xs font-semibold text-gray-700 shadow-sm'>
                                                        {column.count}
                                                    </span>
                                                </div>
                                                <Button
                                                    variant='ghost'
                                                    size='sm'
                                                    className='h-8 w-8 rounded-lg p-0 hover:bg-white/50'>
                                                    <Plus className='h-4 w-4' />
                                                </Button>
                                            </div>

                                            <Droppable droppableId={column.id}>
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.droppableProps}
                                                        className={`min-h-[400px] space-y-4 transition-all duration-200 ${
                                                            snapshot.isDraggingOver ? 'rounded-lg bg-white/30 p-2' : ''
                                                        }`}>
                                                        {column.tasks.map((task, index) => (
                                                            <Draggable
                                                                key={task.id}
<<<<<<< Updated upstream
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

                {/* Task Detail Dialog */}
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
                                                                {projectMembers.map((member) => (
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
=======
                                                                draggableId={task.id}
                                                                index={index}>
                                                                {(provided, snapshot) => (
                                                                    <Card
                                                                        ref={provided.innerRef}
                                                                        {...provided.draggableProps}
                                                                        {...provided.dragHandleProps}
                                                                        className={`cursor-pointer bg-white shadow-md transition-all duration-200 hover:shadow-xl ${
                                                                            snapshot.isDragging
                                                                                ? 'scale-105 rotate-3 shadow-2xl'
                                                                                : ''
                                                                        } overflow-hidden rounded-lg`}>
                                                                        <CardContent className='p-4'>
                                                                            <p className='mb-4 text-sm leading-relaxed font-medium text-gray-900'>
                                                                                {task.title}
                                                                            </p>
                                                                            <div className='mb-4 flex flex-wrap gap-2'>
                                                                                {task.labels.map(
                                                                                    (label, labelIndex) => (
                                                                                        <Badge
                                                                                            key={labelIndex}
                                                                                            className={`${label.color} ${label.textColor} rounded-full px-3 py-1 text-xs font-semibold shadow-sm`}>
                                                                                            {label.name}
                                                                                        </Badge>
                                                                                    )
>>>>>>> Stashed changes
                                                                                )}
                                                                            </div>
                                                                            <div className='flex items-center justify-between'>
                                                                                <div className='flex items-center space-x-3'>
                                                                                    <div className='flex h-5 w-5 items-center justify-center rounded-md bg-gradient-to-br from-green-400 to-green-600 shadow-sm'>
                                                                                        <span className='text-xs text-white'>
                                                                                            ✓
                                                                                        </span>
                                                                                    </div>
                                                                                    <span className='rounded bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-600'>
                                                                                        {task.taskId}
                                                                                    </span>
                                                                                </div>
                                                                                {task.assignee && (
                                                                                    <Avatar className='h-8 w-8 shadow-md transition-transform hover:scale-110'>
                                                                                        <AvatarImage
                                                                                            src={
                                                                                                task.assignee.avatar ||
                                                                                                '/placeholder.svg'
                                                                                            }
                                                                                        />
                                                                                        <AvatarFallback className='bg-gradient-to-br from-blue-400 to-purple-500 text-xs font-semibold text-white'>
                                                                                            {task.assignee.initials}
                                                                                        </AvatarFallback>
                                                                                    </Avatar>
                                                                                )}
                                                                            </div>
                                                                        </CardContent>
                                                                    </Card>
                                                                )}
                                                            </Draggable>
                                                        ))}
                                                        {provided.placeholder}
                                                    </div>
                                                )}
                                            </Droppable>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </DragDropContext>
                    </div>
                </main>
            </div>
        </div>
    );
}
