// src/components/dialog/DialogProvider.tsx
'use client';

import { ReactNode, createContext, useContext, useState } from 'react';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/registry/new-york-v4/ui/dialog';
import { Separator } from '@/registry/new-york-v4/ui/separator';
import { DialogOptions } from '@/types/dialog-options';

// src/components/dialog/DialogProvider.tsx

// import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

type DialogContextValue = {
    openDialog: (opts: DialogOptions) => void;
    closeDialog: () => void;
};

const DialogContext = createContext<DialogContextValue | undefined>(undefined);

export function useDialog() {
    const ctx = useContext(DialogContext);
    if (!ctx) throw new Error('useDialog must be inside DialogProvider');

    return ctx;
}

export function DialogProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [options, setOptions] = useState<DialogOptions | null>(null);

    function openDialog(opts: DialogOptions) {
        // Close any existing dialog first
        setIsOpen(false);
        // then set new content and open
        setOptions(opts);
        setIsOpen(true);
    }

    function closeDialog() {
        setIsOpen(false);
    }

    return (
        <DialogContext.Provider value={{ openDialog, closeDialog }}>
            {children}

            {/* Single, central Dialog instance */}
            <Dialog open={isOpen} onOpenChange={(open) => !open && closeDialog()}>
                <DialogContent className='font-roboto gap-0 p-0'>
                    <DialogHeader className='p-4'>
                        <DialogTitle className='text-lg font-semibold'>{options?.title}</DialogTitle>
                        <DialogDescription className='text-muted-foreground text-sm'>
                            {options?.description}
                        </DialogDescription>

                        {/* <VisuallyHidden>
              <DialogTitle></DialogTitle>
            </VisuallyHidden> */}
                    </DialogHeader>
                    <Separator className='mb-0' />
                    {options?.content}

                    {/* <DialogClose className="absolute top-4 right-4" /> */}
                </DialogContent>
            </Dialog>
        </DialogContext.Provider>
    );
}
