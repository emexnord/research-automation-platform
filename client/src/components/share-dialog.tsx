'use client';

import { Button } from '@/registry/new-york-v4/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/registry/new-york-v4/ui/dialog';
import { Input } from '@/registry/new-york-v4/ui/input';
import { Label } from '@/registry/new-york-v4/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/registry/new-york-v4/ui/select';
import { Share2 } from 'lucide-react';
import { useState } from 'react';

interface ShareDialogProps {
    fileName: string;
    onShare: (email: string, permission: string) => void;
}

export function ShareDialog({ fileName, onShare }: ShareDialogProps) {
    const [email, setEmail] = useState('');
    const [permission, setPermission] = useState('viewer');
    const [isOpen, setIsOpen] = useState(false);

    const handleShare = () => {
        onShare(email, permission);
        setEmail('');
        setPermission('viewer');
        setIsOpen(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Share2 className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Share "{fileName}"</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email address</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="Enter email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="permission">Permission</Label>
                        <Select value={permission} onValueChange={setPermission}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select permission" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="viewer">Viewer</SelectItem>
                                <SelectItem value="editor">Editor</SelectItem>
                                <SelectItem value="owner">Owner</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="text-sm text-gray-500">
                        {permission === 'viewer' && 'Can view the file'}
                        {permission === 'editor' && 'Can view and edit the file'}
                        {permission === 'owner' && 'Has full control of the file'}
                    </div>
                </div>
                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsOpen(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleShare} disabled={!email}>
                        Share
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
} 