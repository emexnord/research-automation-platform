import Link from 'next/link';

export function Footer() {
    return (
        <footer className='flex items-center justify-center border-t py-6 md:py-8'>
            <div className='container flex flex-col items-center justify-between gap-4 px-4 md:flex-row'>
                <p className='text-muted-foreground text-center text-sm md:text-left'>
                    &copy; {new Date().getFullYear()} Research Collab. All rights reserved.
                </p>
                <div className='flex gap-4'>
                    <Link href='/terms' className='text-muted-foreground hover:text-foreground text-sm'>
                        Terms
                    </Link>
                    <Link href='/privacy' className='text-muted-foreground hover:text-foreground text-sm'>
                        Privacy
                    </Link>
                </div>
            </div>
        </footer>
    );
}
