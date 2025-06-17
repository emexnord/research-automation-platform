export interface FileItem {
    file_id: string;
    filename: string;
    file_type: 'file';
    file_size?: number;
    last_modified: string;
    mimeType: string;
    sharedWith?: SharedUser[];
    created_at?: string;
}

export interface SharedUser {
    email: string;
    permission: 'viewer' | 'editor' | 'owner';
}

// Mock data
const mockFiles: FileItem[] = [
    {
        file_id: '1',
        filename: 'Project Documents',
        file_type: 'file',
        last_modified: '2024-03-20T10:00:00Z',
        created_at: '2024-03-20T10:00:00Z',
        mimeType: 'application/vnd.google-apps.folder',
        sharedWith: [{ email: 'john@example.com', permission: 'editor' }]
    }
];

class MockFileService {
    private files: FileItem[] = [...mockFiles];

    async listFiles(): Promise<{ files: FileItem[] }> {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500));
        return { files: this.files };
    }

    async uploadFile(file: File): Promise<FileItem> {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const newFile: FileItem = {
            file_id: Math.random().toString(36).substr(2, 9),
            name: file.name,
            type: 'file',
            size: file.size,
            last_modified: new Date().toISOString(),
            mimeType: file.type
        };

        this.files = [newFile, ...this.files];
        return newFile;
    }

    async deleteFile(filefile_id: string): Promise<boolean> {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        this.files = this.files.filter((file) => file.id !== fileId);
        return true;
    }

    async shareFile(fileId: string, email: string, permission: 'viewer' | 'editor' | 'owner'): Promise<FileItem> {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        const fileIndex = this.files.findIndex((file) => file.id === fileId);
        if (fileIndex === -1) {
            throw new Error('File not found');
        }

        const file = this.files[fileIndex];
        const sharedWith = file.sharedWith || [];

        // Update or add sharing permission
        const existingShareIndex = sharedWith.findIndex((share) => share.email === email);
        if (existingShareIndex !== -1) {
            sharedWith[existingShareIndex].permission = permission;
        } else {
            sharedWith.push({ email, permission });
        }

        const updatedFile = {
            ...file,
            sharedWith
        };

        this.files[fileIndex] = updatedFile;
        return updatedFile;
    }
}

export const mockFileService = new MockFileService(); 