'use client';

import { useState } from 'react';

import { useToast } from '@/components/ui/use-toast';
import api from '@/lib/api';
import { sharedLinksService } from '@/lib/shared-links-service';
import { Button } from '@/registry/new-york-v4/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/registry/new-york-v4/ui/dialog';
import { Input } from '@/registry/new-york-v4/ui/input';
import { Label } from '@/registry/new-york-v4/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/registry/new-york-v4/ui/select';
import { Switch } from '@/registry/new-york-v4/ui/switch';
import { CreateSharedLinkDto, PermissionType } from '@/types/shared-links';





import { Share2 } from 'lucide-react';

interface ShareDialogProps {
    itemId: string;
    itemName: string;
    itemType: 'file' | 'folder';
    onShareComplete: () => void;
}

export function ShareDialog({ itemId, itemName, itemType, onShareComplete }: ShareDialogProps) {
    const [email, setEmail] = useState('');
    const [permission, setPermission] = useState<PermissionType>('viewer');
    const [isOpen, setIsOpen] = useState(false);
    const [isPasswordProtected, setIsPasswordProtected] = useState(false);
    const [password, setPassword] = useState('');
    const [hasExpiry, setHasExpiry] = useState(false);
    const [expiryDate, setExpiryDate] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1hbWVtb2hhbW1lZDIwMTdAZ21haWwuY29tIiwiaWQiOiIzZGM4ZDJiYS01MzI5LTQ0NjYtYmQ4MS1mNGFmNjYwNjEyNjciLCJpbWFnZSI6IiIsInVzZXJuYW1lIjoiIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3NTAxMTY3OTUsImV4cCI6MTc1MDcyMTU5NX0.TPJRpycLgy1P2To7HC2VQXVAONgFbSgq89UDgWuMZbI';

    // const toFakeUUID = (id: string | number): string => {
    //     const base = id.toString().padStart(12, '0'); // pad to make sure it's long enough

    //     return `${base.slice(0, 8)}-${base.slice(8, 12)}-4000-8000-000000000000`;
    // };
    // const safeItemId = toFakeUUID(itemId);
    const handleShare = async () => {
        try {
            setIsLoading(true);

            const data: CreateSharedLinkDto = {
                item_id: itemId,
                item_type: itemType,
                permission_type: permission,
                recipient_email: email,
                ...(isPasswordProtected && password ? { password } : {}),
                ...(hasExpiry && expiryDate ? { expiry_date: expiryDate } : {})
            };

            console.log('The data to be submitted is', data);

            const response = await api.post('shared-links', data, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log('Response from API:', response.data);

            toast({
                title: 'Link shared successfully',
                description: `A share link has been sent to ${email}`
            });

            // Reset form
            setEmail('');
            setPermission('viewer');
            setIsPasswordProtected(false);
            setPassword('');
            setHasExpiry(false);
            setExpiryDate('');
            setIsOpen(false);
            onShareComplete();
        } catch (error) {
            console.error('Error creating shared link:', error);
            toast({
                title: 'Failed to share',
                description: 'There was an error sharing the item. Please try again.',
                variant: 'destructive'
            });
        } finally {
            setIsLoading(false);
        }
    };
    const getMinExpiryDate = () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        return tomorrow.toISOString().split('T')[0];
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant='ghost' size='icon'>
                    <Share2 className='h-4 w-4' />
                </Button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-[425px]'>
                <DialogHeader>
                    <DialogTitle>Share "{itemName}"</DialogTitle>
                </DialogHeader>
                <div className='grid gap-4 py-4'>
                    <div className='grid gap-2'>
                        <Label htmlFor='email'>Email address</Label>
                        <Input
                            id='email'
                            type='email'
                            placeholder='Enter email address'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className='grid gap-2'>
                        <Label htmlFor='permission'>Permission</Label>
                        <Select value={permission} onValueChange={(value) => setPermission(value as PermissionType)}>
                            <SelectTrigger>
                                <SelectValue placeholder='Select permission' />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value='viewer'>Viewer</SelectItem>
                                <SelectItem value='editor'>Editor</SelectItem>
                                <SelectItem value='owner'>Owner</SelectItem>
                            </SelectContent>
                        </Select>
                        <div className='text-sm text-gray-500'>
                            {permission === 'viewer' && 'Can view the item'}
                            {permission === 'editor' && 'Can view and edit the item'}
                            {permission === 'owner' && 'Has full control of the item'}
                        </div>
                    </div>
                    <div className='flex items-center justify-between'>
                        <Label htmlFor='password-protection'>Password Protection</Label>
                        <Switch
                            id='password-protection'
                            checked={isPasswordProtected}
                            onCheckedChange={setIsPasswordProtected}
                        />
                    </div>
                    {isPasswordProtected && (
                        <div className='grid gap-2'>
                            <Label htmlFor='password'>Password</Label>
                            <Input
                                id='password'
                                type='password'
                                placeholder='Enter password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    )}
                    <div className='flex items-center justify-between'>
                        <Label htmlFor='expiry'>Set Expiry Date</Label>
                        <Switch id='expiry' checked={hasExpiry} onCheckedChange={setHasExpiry} />
                    </div>
                    {hasExpiry && (
                        <div className='grid gap-2'>
                            <Label htmlFor='expiry-date'>Expiry Date</Label>
                            <Input
                                id='expiry-date'
                                type='date'
                                min={getMinExpiryDate()}
                                value={expiryDate}
                                onChange={(e) => setExpiryDate(e.target.value)}
                            />
                        </div>
                    )}
                </div>
                <div className='flex justify-end gap-2'>
                    <Button variant='outline' onClick={() => setIsOpen(false)}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleShare}
                        disabled={
                            !email || isLoading || (isPasswordProtected && !password) || (hasExpiry && !expiryDate)
                        }>
                        {isLoading ? 'Sharing...' : 'Share'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}