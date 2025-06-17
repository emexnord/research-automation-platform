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

}

export const mockFileService = new MockFileService(); 