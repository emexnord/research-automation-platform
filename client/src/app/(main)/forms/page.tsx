'use client';

import { useRouter } from 'next/navigation';

import MaxWidthWrapper from '@/components/max-width-wrapper';
import { Button } from '@/registry/new-york-v4/ui/button';

import FormsList from './components/FormsList';
import { PlusCircle } from 'lucide-react';

const Forms = () => {
    const router = useRouter();

    const handleCreateForm = () => {
        router.push('/forms/create');
    };

    return (
        <MaxWidthWrapper>
            <div className='container mx-auto py-8'>
                <div className='mb-8 flex items-center justify-between'>
                    <div>
                        <h1 className='mb-2 text-3xl font-bold'>Research Surveys</h1>
                        <p className='text-gray-600'>
                            Create and manage your research surveys. Share them with collaborators and collect
                            responses.
                        </p>
                    </div>
                    <Button onClick={handleCreateForm} className='flex items-center gap-2' size='lg'>
                        <PlusCircle className='h-5 w-5' />
                        Create New Survey
                    </Button>
                </div>

                <FormsList />
            </div>
        </MaxWidthWrapper>
    );
};

export default Forms;
