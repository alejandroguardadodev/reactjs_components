import React from 'react'

import {
    IMSTblHead,
    IMSTblCell
} from '../../models/MSTableModel'

import { 
    Box,
    Stack
} from "@mui/material"

import TableBox from "./TableBox"

import { useResizeDetector } from 'react-resize-detector'

// SUB MENU ITEMS TYPES
interface MenuItemType {
    title: string;
    icon?: React.ReactNode;
}

interface MSTablePropsType {
    rowHeight?: number // DEFAULT SIZE OF EVERY ROW
    headers: IMSTblHead[] // HEADERS OF THE TABLE
    data: any[] // DATA OF THE TABLE
    submenuItems?: null | MenuItemType[] // SUBMENU ITEMS
    render: (row:any) => IMSTblCell[] // FUNCTION TO RENDER CELLS
    actionSection?: (row: any) => React.ReactNode // FUNCTION TO RENDER ACTION SECTION [ like OPEN MENU, ERASE, EDIT ]
}

const MSTable = ({ headers, data, render, actionSection, rowHeight=40, submenuItems=null }:MSTablePropsType) => {

    const { ref: tableContainerRef, width: tableContainerWidth, height: tableContainerHeight } = useResizeDetector()

    const tableContainerXLimit = React.useMemo(() => Math.floor((tableContainerRef.current?.offsetLeft || 0) + (tableContainerWidth || 0)), [tableContainerRef.current?.offsetLeft, tableContainerWidth])

    return (
        <Stack 
            spacing={2}
            sx={{
                padding: '10px',
                width: '100%',
                height: '100%',
                border: '1px solid black',
                borderRadius: '5px',
                boxShadow: '0px 0px 20px -10px rgba(0,0,0,0.6)'
            }}
        >
            <Box>Toolbar</Box>
            <Box ref={tableContainerRef} sx={{ flexGrow: 1 }}>
                <TableBox 
                    rowHeight={rowHeight}
                    containerWidth={tableContainerWidth} 
                    containerHeight={tableContainerHeight}
                    headers={headers}
                    data={data}
                    render={render}
                    actionSection={actionSection}
                    submenuItems={submenuItems}
                    containerXLimit={tableContainerXLimit}
                />
            </Box>
            <Box>Pagination</Box>
        </Stack>
    )
}

export default MSTable