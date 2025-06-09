import React from 'react';

type SearchParams = Promise<{ q?: string | undefined }>;

const page = async (props: { searchParams: SearchParams }) => {
    const searchParams = await props.searchParams;

    return <div>Task page</div>;
};

export default page;
