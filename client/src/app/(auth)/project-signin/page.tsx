'use client';

import { useEffect, useState } from 'react';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { Button } from '@/registry/new-york-v4/ui/button';
import { Card, CardContent } from '@/registry/new-york-v4/ui/card';
import { useTeamStore } from '@/store/projectStore';

import { useSession } from 'next-auth/react';

// ✅ use correct store

export type Team = {
    id: string;
    name: string;
};

export default function ProjectSignInPage() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [teams, setTeams] = useState<Team[]>([]);

    const { setTeam, addTeam, clearTeams, currentTeam } = useTeamStore();

    useEffect(() => {
        const fetchTeams = async () => {
            if (!session?.accessToken) return;

            try {
                clearTeams();
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/team`, {
                    headers: {
                        Authorization: `Bearer ${session.accessToken}`
                    }
                });

                if (!res.ok) throw new Error('Failed to fetch teams');

                const data = await res.json();
                const formatted = data.map((t: any) => ({
                    id: t.id,
                    name: t.name
                }));

                setTeams(formatted);
                console.log('Fetched teams:', formatted);
                formatted.forEach((team) => addTeam({ id: team.id, name: team.name }));
            } catch (error) {
                console.error('Error fetching teams:', error);
            }
        };

        fetchTeams();
    }, [session?.accessToken, addTeam, clearTeams]);

    const handleProjectSelect = (team: Team) => {
        console.log('Selected team:', team);
        setTeam({ id: team.id, name: team.name });
        console.log('currentTeam', currentTeam);
        // router.push('/task');
    };

    if (status === 'loading') {
        return <p className='mt-20 text-center text-gray-600'>Loading session...</p>;
    }

    return (
        <div className='flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900'>
            <div className='w-full max-w-md space-y-8'>
                <div className='text-center'>
                    <Image
                        src='/logo.svg'
                        alt='Researchify Logo'
                        width={200}
                        height={50}
                        className='mx-auto mb-4 h-20 w-auto'
                    />
                    <h2 className='mt-6 text-3xl font-extrabold text-gray-900 dark:text-white'>
                        Sign in to your project
                    </h2>
                    <p className='mt-2 text-sm text-gray-600 dark:text-gray-400'>Choose your project from below</p>
                </div>

                <Card className='mx-auto w-full'>
                    <CardContent className='py-6'>
                        <div className='space-y-4'>
                            <div className='relative'>
                                <div className='absolute inset-0 flex items-center' aria-hidden='true'>
                                    <div className='w-full border-t border-gray-300 dark:border-gray-700' />
                                </div>
                                <div className='relative flex justify-center text-sm'>
                                    <span className='bg-white px-2 text-gray-500 dark:bg-gray-900 dark:text-gray-400'>
                                        You're already signed in to...
                                    </span>
                                </div>
                            </div>

                            {teams.length === 0 ? (
                                <p className='text-center text-sm text-gray-500 dark:text-gray-400'>
                                    You haven’t joined any team yet.
                                </p>
                            ) : (
                                <div className='space-y-2'>
                                    {teams.map((team) => (
                                        <Card
                                            key={team.id}
                                            className='flex items-center justify-between rounded-xl px-4 py-3 shadow-sm transition-all hover:shadow-md'>
                                            <div className='flex items-center gap-4'>
                                                <div className='flex h-10 w-10 items-center justify-center rounded-lg border text-gray-600 dark:text-gray-300'>
                                                    <span className='text-base font-semibold'>
                                                        {team.name.charAt(0)}
                                                    </span>
                                                </div>
                                                <div className='flex flex-col'>
                                                    <span className='text-sm font-medium text-gray-900 dark:text-white'>
                                                        {team.name}
                                                    </span>
                                                </div>
                                            </div>
                                            <Button
                                                variant='outline'
                                                className='text-sm font-medium'
                                                onClick={() => handleProjectSelect(team)}>
                                                Open
                                            </Button>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
