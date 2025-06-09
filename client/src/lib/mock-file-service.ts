export interface FileItem {
    id: string;
    name: string;
    type: 'file' | 'folder';
    size?: number;
    modifiedAt: string;
    mimeType: string;
    sharedWith?: SharedUser[];
}

export interface SharedUser {
    email: string;
    permission: 'viewer' | 'editor' | 'owner';
}

// Mock data
const mockFiles: FileItem[] = [
    {
        id: '1',
        name: 'Project Documents',
        type: 'folder',
        modifiedAt: '2024-03-20T10:00:00Z',
        mimeType: 'application/vnd.google-apps.folder',
        sharedWith: [
            { email: 'john@example.com', permission: 'editor' }
        ]
    },
    {
        id: '2',
        name: 'Research Paper.pdf',
        type: 'file',
        size: 2048576, // 2MB
        modifiedAt: '2024-03-19T15:30:00Z',
        mimeType: 'application/pdf',
        sharedWith: [
            { email: 'alice@example.com', permission: 'viewer' }
        ]
    },
    {
        id: '3',
        name: 'Meeting Notes.docx',
        type: 'file',
        size: 1048576, // 1MB
        modifiedAt: '2024-03-18T09:15:00Z',
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    },
    {
        id: '4',
        name: 'Images',
        type: 'folder',
        modifiedAt: '2024-03-17T14:20:00Z',
        mimeType: 'application/vnd.google-apps.folder'
    }
];

class MockFileService {
    private files: FileItem[] = [...mockFiles];

    async listFiles(): Promise<{ files: FileItem[] }> {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        return { files: this.files };
    }

    async uploadFile(file: File): Promise<FileItem> {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const newFile: FileItem = {
            id: Math.random().toString(36).substr(2, 9),
            name: file.name,
            type: 'file',
            size: file.size,
            modifiedAt: new Date().toISOString(),
            mimeType: file.type
        };

        this.files = [newFile, ...this.files];
        return newFile;
    }

    async deleteFile(fileId: string): Promise<boolean> {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        this.files = this.files.filter(file => file.id !== fileId);
        return true;
    }

    async shareFile(fileId: string, email: string, permission: 'viewer' | 'editor' | 'owner'): Promise<FileItem> {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        const fileIndex = this.files.findIndex(file => file.id === fileId);
        if (fileIndex === -1) {
            throw new Error('File not found');
        }

        const file = this.files[fileIndex];
        const sharedWith = file.sharedWith || [];
        
        // Update or add sharing permission
        const existingShareIndex = sharedWith.findIndex(share => share.email === email);
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