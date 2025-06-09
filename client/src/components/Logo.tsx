import * as React from 'react';

import Image from 'next/image';

interface LogoProps {
    iconOnly?: boolean;
}

const Logo: React.FC<LogoProps> = (props) => {
    // const { theme } = useTheme();
    // const isDarkMode = theme === "dark";
    const isDarkMode = false;
    const iconOnly = props.iconOnly || false;
    if (iconOnly) {
        return (
            <div className='flex items-center justify-center'>
                <Image src={'/Icon-logo.svg'} alt='logo' width={100} height={100} className='h-8 w-8' />
            </div>
        );
    }

    return (
        <div className='max-w-[155px]'>
            <div className='flex items-center justify-center'>
                <Image
                    src={isDarkMode ? '/darkmode-icon.svg' : '/lightmode-icon.svg'}
                    alt='logo'
                    width={100}
                    height={100}
                    // className="h-8 w-8"
                />
            </div>
        </div>
    );
};

export default Logo;
