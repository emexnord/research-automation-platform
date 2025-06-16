'use client';

import { Button } from '@/registry/new-york-v4/ui/button';
import { Card } from '@/registry/new-york-v4/ui/card';
import { Input } from '@/registry/new-york-v4/ui/input';
import { mockFileService, FileItem } from '@/lib/mock-file-service';
import { useEffect, useState } from 'react';
import { FileIcon, FolderIcon, Upload, Download, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ShareDialog } from './share-dialog';
import { useToast } from '@/components/ui/use-toast';

export function FileManager() {
    const [files, setFiles] = useState<FileItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        loadFiles();
    }, []);

    const loadFiles = async () => {
        try {
            setLoading(true);
            const response = await mockFileService.listFiles();
            setFiles(response.files);
            setError(null);
        } catch (err) {
            setError('Failed to load files');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            setLoading(true);
            await mockFileService.uploadFile(file);
            await loadFiles();
            setError(null);
        } catch (err) {
            setError('Failed to upload file');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (fileId: string) => {
        try {
            await mockFileService.deleteFile(fileId);
            await loadFiles();
            setError(null);
        } catch (err) {
            setError('Failed to delete file');
            console.error(err);
        }
    };

    const handleShare = async (fileId: string, email: string, permission: string) => {
        try {
            await mockFileService.shareFile(fileId, email, permission as 'viewer' | 'editor' | 'owner');
            await loadFiles();
            toast({
                title: "File shared successfully",
                description: `${email} now has ${permission} access to the file.`,
            });
        } catch (err) {
            toast({
                title: "Failed to share file",
                description: "There was an error sharing the file. Please try again.",
                variant: "destructive",
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
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">My Files</h2>
                <div className="flex items-center gap-2">
                    <Input
                        type="file"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="file-upload"
                    />
                    <Button
                        onClick={() => document.getElementById('file-upload')?.click()}
                        className="flex items-center gap-2"
                    >
                        <Upload className="h-4 w-4" />
                        Upload File
                    </Button>
                </div>
            </div>

            {error && (
                <div className="rounded-md bg-red-50 p-4 text-red-500">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="text-center">Loading...</div>
            ) : (
                <div className="grid gap-4">
                    {files.map((file) => (
                        <Card key={file.id} className="p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    {file.type === 'folder' ? (
                                        <FolderIcon className="h-6 w-6 text-blue-500" />
                                    ) : (
                                        <FileIcon className="h-6 w-6 text-gray-500" />
                                    )}
                                    <div>
                                        <h3 className="font-medium">{file.name}</h3>
                                        <p className="text-sm text-gray-500">
                                            {file.type === 'file' ? formatFileSize(file.size) : 'Folder'} • 
                                            {formatDistanceToNow(new Date(file.modifiedAt), { addSuffix: true })}
                                        </p>
                                        {file.sharedWith && file.sharedWith.length > 0 && (
                                            <p className="text-xs text-gray-400 mt-1">
                                                Shared with {file.sharedWith.length} {file.sharedWith.length === 1 ? 'person' : 'people'}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {file.type === 'file' && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => window.open(`/api/files/${file.id}`, '_blank')}
                                        >
                                            <Download className="h-4 w-4" />
                                        </Button>
                                    )}
                                    <ShareDialog
                                        itemId={file.id}
                                        itemName={file.name}
                                        itemType={file.type}
                                        onShareComplete={loadFiles}
                                    />
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleDelete(file.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
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