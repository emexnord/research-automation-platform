import MaxWidthWrapper from '@/components/max-width-wrapper';
import { FileManager } from '@/components/file-manager';
import React from 'react';

const Files = () => {
    return (
        <div>
            <MaxWidthWrapper className='py-8'>
                <div className='flex flex-col gap-4'>
                    <h1 className='text-2xl font-bold'>Files</h1>
                    <FileManager />
                </div>
            </MaxWidthWrapper>
        </div>
    );
};

export default Files;
