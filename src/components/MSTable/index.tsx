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

interface MenuItemType {
    title: string;
    icon?: React.ReactNode;
}

interface MSTablePropsType {
    rowHeight?: number // DEFAULT SIZE OF EVERY ROW
    headers: IMSTblHead[]
    data: any[]
    submenuItems?: null | MenuItemType[]
    render: (row:any) => IMSTblCell[]
    actionSection?: (row: any) => React.ReactNode
}

const MSTable = ({ headers, data, render, actionSection, rowHeight=40, submenuItems=null }:MSTablePropsType) => {

    const { ref: tableContainerRef, width: tableContainerWidth, height: tableContainerHeight } = useResizeDetector()

    return (
        <Stack 
            spacing={2}
            sx={{
                width: '100%',
                height: '100%',
                border: '1px solid black'
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
                />
            </Box>
            <Box>Pagination</Box>
        </Stack>
    )
}

export default MSTable