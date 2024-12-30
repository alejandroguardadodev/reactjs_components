import React from 'react';

import { Theme } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';

const useResponsive = () => {

    const [screenSize, setScreenSize] = React.useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });
    

    const isDownSM = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))
    const isDownMD = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))
    const isDownLG = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'))
    const isDownXL = useMediaQuery((theme: Theme) => theme.breakpoints.down('xl'))

    const actionCheckDownWidth = (breakpoint: 'sm' | 'md' | 'lg' | 'xl') => {
        switch(breakpoint) {
            case 'sm':
                return isDownSM
            case 'md':
                return isDownMD
            case 'lg':
                return isDownLG
            case 'xl':
                return isDownXL
        }
    }

    React.useEffect(() => {
        const handleResize = () => {
            setScreenSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };
    
        window.addEventListener('resize', handleResize);
    
        // Clean up the event listener when the component unmounts
        return () => {
          window.removeEventListener('resize', handleResize);
        };
    }, []);

    return {
        checkDownBreakpoint: actionCheckDownWidth,
        screenSize
    }
}

export default useResponsive