import * as React from 'react';

import Image from 'next/image';

interface LogoProps {
    iconOnly?: boolean;
}

const Logo: React.FC<LogoProps> = (props) => {
    // const { theme } = useTheme();
    // const isDarkMode = theme === "dark";
    const iconOnly = props.iconOnly || false;
    if (iconOnly) {
        return (
            <div className='flex items-center justify-center'>
                <Image src={'/Icon-logo.svg'} alt='logo' width={100} height={100} className='h-8 w-8' />
            </div>
        );
    }

    return (
        <div className='max-w-auto'>
            <div className='flex items-left justify-left'>
                <Image
                    src={'/logo.svg'}
                    alt='Researchify logo'
                    width={500}
                    height={100}
                    className="h-[200px] w-auto"
                    objectFit="contain"
                />
            </div>
        </div>
    );
};

export default Logo;
