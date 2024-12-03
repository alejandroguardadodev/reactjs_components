import React from 'react'

import { styled } from '@mui/system'

import {
    Box
} from '@mui/material'

import { TableContext } from '../../../../contexts/MTableContextProvider'

const ResizeBoxBlink = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'blinkColor',
})<{blinkColor?: string}>(({ blinkColor }) => ({
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
        cursor: 'e-resize',
        ...(blinkColor && {
            background: blinkColor
        })
    }
}))

interface ResizeBlinkPropsType {
    onMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void
}

const ResizeBlink = ({ onMouseDown }:ResizeBlinkPropsType) => {

    const tableContext = React.useContext(TableContext)
    
    return (
        <ResizeBoxBlink onMouseDown={onMouseDown} blinkColor={tableContext.blinkColor} />
    )
}

export default ResizeBlink