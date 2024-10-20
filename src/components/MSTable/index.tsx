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

interface MSTablePropsType {
    rowHeight?: number, // DEFAULT SIZE OF EVERY ROW
    headers: IMSTblHead[],
    data: any[],
    render: (row:any) => IMSTblCell[]
}


const MSTable = ({ headers, data, render, rowHeight=40 }:MSTablePropsType) => {

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
                />
            </Box>
            <Box>Pagination</Box>
        </Stack>
    )
}

export default MSTable