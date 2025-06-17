export type ItemType = 'file' | 'folder';
export type PermissionType = 'viewer' | 'editor' | 'owner';

export interface CreateSharedLinkDto {
    item_id: string;
    item_type: ItemType;
    permission_type: PermissionType;
    expiry_date?: string;
    password?: string;
    recipient_email: string;
}

export interface SharedLink {
    id: string;
    item_id: string;
    item_type: ItemType;
    permission_type: PermissionType;
    expiry_date?: string;
    has_password: boolean;
    recipient_email: string;
    created_at: string;
    created_by: string;
} 