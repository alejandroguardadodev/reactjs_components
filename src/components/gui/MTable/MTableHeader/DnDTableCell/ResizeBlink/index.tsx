import React from 'react'

import { styled } from '@mui/system'

import {
    Box
} from '@mui/material'

const ResizeBoxBlink = styled(Box)(() => ({
    position: 'absolute',
    top: 0,
    right: '-5px',
    width: '10px',
    height: '100%',
    borderRadius: '0px',
    padding: 0,
    margin: 0,
    border: 'none',
    background: 'transparent',
    transition: 'all .15s ease-in-out',
    zIndex: 99999,
    '&:hover': {
        background: '#038C65',
        cursor: 'e-resize'
    }
}))

interface ResizeBlinkPropsType {
    onMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void
}

const ResizeBlink = ({ onMouseDown }:ResizeBlinkPropsType) => {
    
    return (
        <ResizeBoxBlink onMouseDown={onMouseDown} />
    )
}

export default ResizeBlink