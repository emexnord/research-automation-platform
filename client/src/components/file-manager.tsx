'use client';

import { useEffect, useState } from 'react';



import { useToast } from '@/components/ui/use-toast';
import api from '@/lib/api';
import { FileItem, mockFileService } from '@/lib/mock-file-service';
import { Button } from '@/registry/new-york-v4/ui/button';
import { Card } from '@/registry/new-york-v4/ui/card';
import { Input } from '@/registry/new-york-v4/ui/input';



import { ShareDialog } from './share-dialog';
import { formatDistanceToNow } from 'date-fns';
import { Download, FileIcon, FolderIcon, Trash2, Upload } from 'lucide-react';





export function FileManager() {
    const [files, setFiles] = useState<FileItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        loadFiles();
    }, []);
    const token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1hbWVtb2hhbW1lZDIwMTdAZ21haWwuY29tIiwiaWQiOiIzZGM4ZDJiYS01MzI5LTQ0NjYtYmQ4MS1mNGFmNjYwNjEyNjciLCJpbWFnZSI6IiIsInVzZXJuYW1lIjoiIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3NTAxMTY3OTUsImV4cCI6MTc1MDcyMTU5NX0.TPJRpycLgy1P2To7HC2VQXVAONgFbSgq89UDgWuMZbI';

    const loadFiles = async () => {
        try {
            const response = await api.get('files', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log('Files loaded:', response.data);
            if (response.status !== 200) {
                throw new Error('Invalid response format');
            }
            setFiles(response.data);
        } catch (err) {
            setError('Failed to load files');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log('handleFileUpload triggered');
        const file = event.target.files?.[0];
        if (!file) {
            console.log('No file selected');

            return;
        }
        console.log('File selected:', file);

        const formData = new FormData();
        formData.append('file', file);

        try {
            console.log('Uploading file...');
            const response = await api.post('files/upload', formData, {
                headers: {
                    'Content-Type': file.type,
                    Authorization: `Bearer ${token}`
                }
            });
            console.log('Response received:', response);

            if (response.status !== 201) {
                throw new Error('File upload failed');
            }
            // setFiles((prevFiles) => [response.data, ...prevFiles]);
            toast({
                title: 'File uploaded successfully',
                description: `${file.name} has been uploaded successfully.`
            });
            console.log('File uploaded successfully');
            setLoading(true);
        } catch (err) {
            console.error('Error during file upload:', err);
            setError('Failed to upload file');
        } finally {
            console.log('Upload process finished, setting loading false');
            setLoading(false);
        }
    };

    const handleDelete = async (fileId: string) => {
        try {
            const response = await api.delete(`files/${fileId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log('Delete response:', response);
            if (response.status !== 200) {
                throw new Error('Failed to delete file');
            }
            console.log('File deleted successfully');
            // Optimistically update UI
            setFiles((prevFiles) => prevFiles.filter((file) => file.file_id !== fileId));
            setError(null);
            toast({
                title: 'File deleted',
                description: 'The file was successfully deleted.'
            });
        } catch (err) {
            setError('Failed to delete file');
            console.error(err);
            toast({
                title: 'Error',
                description: 'Failed to delete file',
                variant: 'destructive'
            });
        }
    };

    const handleShare = async (fileId: string, email: string, permission: string) => {
        try {
            await mockFileService.shareFile(fileId, email, permission as 'viewer' | 'editor' | 'owner');
            await loadFiles();
            toast({
                title: 'File shared successfully',
                description: `${email} now has ${permission} access to the file.`
            });
        } catch (err) {
            toast({
                title: 'Failed to share file',
                description: 'There was an error sharing the file. Please try again.',
                variant: 'destructive'
            });
            console.error(err);
        }
    };

    const formatFileSize = (bytes?: number) => {
        if (!bytes) return '';
        const units = ['B', 'KB', 'MB', 'GB'];
        let size = bytes;
        let unitIndex = 0;
        while (size >= 1024 && unitIndex < units.length - 1) {
            size /= 1024;
            unitIndex++;
        }

        return `${Math.round(size)} ${units[unitIndex]}`;
    };

    return (
        <div className='space-y-4'>
            <div className='flex items-center justify-between'>
                <h2 className='text-xl font-semibold'>My Files</h2>
                <div className='flex items-center gap-2'>
                    <Input type='file' onChange={handleFileUpload} className='hidden' id='file-upload' />
                    <Button
                        onClick={() => document.getElementById('file-upload')?.click()}
                        className='flex items-center gap-2'>
                        <Upload className='h-4 w-4' />
                        Upload File
                    </Button>
                </div>
            </div>

            {error && <div className='rounded-md bg-red-50 p-4 text-red-500'>{error}</div>}

            {loading ? (
                <div className='text-center'>Loading...</div>
            ) : (
                <div className='grid gap-4'>
                    {files.map((file) => (
                        <Card key={file.file_id} className='p-4'>
                            <div className='flex items-center justify-between'>
                                <div className='flex items-center gap-3'>
                                    <FileIcon className='h-6 w-6 text-gray-500' />
                                    <div>
                                        <h3 className='font-medium'>{file.filename}</h3>
                                        <p className='text-sm text-gray-500'>
                                            {file.file_type === 'file' ? formatFileSize(file.file_size) : 'Folder'} •
                                            {formatDistanceToNow(new Date(file.last_modified ?? file.created_at ?? 0), {
                                                addSuffix: true
                                            })}
                                        </p>
                                        {file.sharedWith && file.sharedWith.length > 0 && (
                                            <p className='mt-1 text-xs text-gray-400'>
                                                Shared with {file.sharedWith.length}{' '}
                                                {file.sharedWith.length === 1 ? 'person' : 'people'}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className='flex items-center gap-2'>
                                    {file.file_type === 'file' && (
                                        <Button
                                            variant='ghost'
                                            size='icon'
                                            onClick={() => window.open(`/api/files/${file.file_id}`, '_blank')}>
                                            <Download className='h-4 w-4' />
                                        </Button>
                                    )}
                                    <ShareDialog
                                        itemId={file.file_id}
                                        itemName={file.filename}
                                        itemType={'file'}
                                        onShareComplete={loadFiles}
                                    />
                                    <Button variant='ghost' size='icon' onClick={() => handleDelete(file.file_id)}>
                                        <Trash2 className='h-4 w-4' />
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}