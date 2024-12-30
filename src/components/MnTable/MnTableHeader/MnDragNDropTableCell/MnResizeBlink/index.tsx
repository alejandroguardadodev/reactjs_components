import React from 'react'

import { styled } from '@mui/system'

import {
    Box
} from '@mui/material'

import { TableContext } from '../../../../../contexts/TableContextProvider'

const ResizeBoxBlink = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'blinkColor',
})<{blinkColor?: string}>(({ blinkColor }) => ({
    position: 'absolute',
    top: 0,
    right: '-4px',
    width: '8px',
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

interface MnResizeBlinkPropsType {
    onMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void
}

const MnResizeBlink = ({ onMouseDown }:MnResizeBlinkPropsType) => {

    const tableContext = React.useContext(TableContext)
    
    return (
        <ResizeBoxBlink onMouseDown={onMouseDown} blinkColor={tableContext.blinkColor} />
    )
}

export default MnResizeBlink