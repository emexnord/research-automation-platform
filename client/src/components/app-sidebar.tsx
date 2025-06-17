'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
    useSidebar,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent
} from '@/registry/new-york-v4/ui/sidebar';
import Logo from './Logo';
import { UserProfile } from './user-profile';
import {
    History,
    ClipboardList,
    FileText,
    Folder,
    Star,
    Clock,
    MoreHorizontal,
    Calendar,
    Trash2,
    ChevronDown,
    GitPullRequestArrow
} from 'lucide-react';
import { IoChevronDown, IoChevronForward } from 'react-icons/io5';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/registry/new-york-v4/ui/dropdown-menu";
import { useProjectStore, Project } from '@/store/projectStore';
import { useRouter } from 'next/navigation';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { state, setOpen } = useSidebar();
    const [showHistory, setShowHistory] = useState(false);
    const router = useRouter();

    const { currentProject, availableProjects, setProject, clearProjects } = useProjectStore();

    useEffect(() => {
        if (state === 'collapsed') {
            setShowHistory(false);
        }
    }, [state]);

    const handleRecentClick = () => {
        setOpen(true);
        setShowHistory((prev) => !prev);
    };

    const handleProjectSwitch = (project: Project) => {
        setProject(project);
        // You might want to navigate to the task page or refresh the current page
        router.push('/task');
    };

    const handleAddNewProject = () => {
        router.push('/project-signin');
    };

    return (
        <Sidebar collapsible='icon' {...props}>
            <SidebarHeader>
                <Link href='/' className='mb-2'>
                    {state === 'expanded' ? <Logo /> : <Logo iconOnly />}
                </Link>
                {state === 'expanded' && currentProject && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <SidebarMenuButton className="w-full flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <GitPullRequestArrow size={20} />
                                    <span>{currentProject.name}</span>
                                </div>
                                <ChevronDown size={16} />
                            </SidebarMenuButton>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)]">
                            <div className="px-2 py-1.5 text-sm font-semibold">
                                Projects
                            </div>
                            <DropdownMenuSeparator />
                            {availableProjects.map((project) => (
                                <DropdownMenuItem key={project.id} onClick={() => handleProjectSwitch(project)} className="cursor-pointer">
                                    <div className="flex items-center gap-2">
                                        <GitPullRequestArrow size={16} />
                                        <span>{project.name}</span>
                                    </div>
                                </DropdownMenuItem>
                            ))}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleAddNewProject} className="cursor-pointer">
                                <div className="flex items-center gap-2">
                                    <span>Add new project</span>
                                </div>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Main</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu className='gap-4 px-2'>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    className='mt-2 cursor-pointer overflow-visible rounded-lg'
                                    onClick={() => window.open('/task', '_self')}
                                    title='Tasks'>
                                    <div className='mx-1'>
                                        <ClipboardList size={20} />
                                    </div>
                                    <span className='text-md'>Tasks</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    className='mt-2 cursor-pointer overflow-visible rounded-lg'
                                    onClick={() => window.open('/forms', '_self')}
                                    title='Forms'>
                                    <div className='mx-1'>
                                        <FileText size={20} />
                                    </div>
                                    <span className='text-md'>Forms</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    className='mt-2 cursor-pointer overflow-visible rounded-lg'
                                    onClick={() => window.open('/files', '_self')}
                                    title='Files'>
                                    <div className='mx-1'>
                                        <Folder size={20} />
                                    </div>
                                    <span className='text-md'>Files</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel>Quick Access</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu className='gap-4 px-2'>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    className='mt-2 cursor-pointer overflow-visible rounded-lg'
                                    onClick={handleRecentClick}
                                    title='Recent'>
                                    <div className='mx-1'>
                                        <Clock size={20} />
                                    </div>
                                    <span className='text-md'>Recent</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    className='mt-2 cursor-pointer overflow-visible rounded-lg'
                                    onClick={() => {}}
                                    title='Starred'>
                                    <div className='mx-1'>
                                        <Star size={20} />
                                    </div>
                                    <span className='text-md'>Starred</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    className='mt-2 cursor-pointer overflow-visible rounded-lg'
                                    onClick={() => {}}
                                    title='Plans'>
                                    <div className='mx-1'>
                                        <Calendar size={20} />
                                    </div>
                                    <span className='text-md'>Plans</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    className='mt-2 cursor-pointer overflow-visible rounded-lg'
                                    onClick={() => {}}
                                    title='Recycle Bin'>
                                    <div className='mx-1'>
                                        <Trash2 size={20} />
                                    </div>
                                    <span className='text-md'>Recycle Bin</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    className='mt-2 cursor-pointer overflow-visible rounded-lg'
                                    onClick={() => {}}
                                    title='More'>
                                    <div className='mx-1'>
                                        <MoreHorizontal size={20} />
                                    </div>
                                    <span className='text-md'>More</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <UserProfile />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
