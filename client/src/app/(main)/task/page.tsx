'use client';

import { useState } from 'react';

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
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';

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
}

interface Column {
    id: string;
    title: string;
    count: number;
    tasks: Task[];
    color: string;
    headerColor: string;
}

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
    const [columns, setColumns] = useState(initialData);
    const [searchTerm, setSearchTerm] = useState('');

    const onDragEnd = (result: any) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;
        if (destination.droppableId === source.droppableId && destination.index === source.index) return;

        const sourceColumn = columns.find((col) => col.id === source.droppableId);
        const destColumn = columns.find((col) => col.id === destination.droppableId);

        if (!sourceColumn || !destColumn) return;

        const task = sourceColumn.tasks.find((task) => task.id === draggableId);
        if (!task) return;

        const newColumns = columns.map((column) => {
            if (column.id === source.droppableId) {
                return {
                    ...column,
                    tasks: column.tasks.filter((task) => task.id !== draggableId),
                    count: column.tasks.length - 1
                };
            }

            if (column.id === destination.droppableId) {
                const newTasks = [...column.tasks];
                newTasks.splice(destination.index, 0, task);

                return {
                    ...column,
                    tasks: newTasks,
                    count: newTasks.length
                };
            }

            return column;
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

                        {/* Board Header */}
                        <div className='mb-8 flex items-center justify-between'>
                            <div className='flex items-center space-x-4'>
                                <h1 className='text-3xl font-bold text-gray-900'>Board</h1>
                                <Button
                                    variant='ghost'
                                    size='sm'
                                    className='text-yellow-500 hover:bg-yellow-50 hover:text-yellow-600'>
                                    <Star className='h-5 w-5' />
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
