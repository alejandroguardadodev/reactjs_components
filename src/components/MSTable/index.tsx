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

import TableContext, { TableContextType } from '../../contexts/TableContext'

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
    defaultSort?: string // DEFAULT SORT COLUMN
    render: (row:any) => [IMSTblCell[], string] // FUNCTION TO RENDER CELLS
    actionSection?: (row: any) => React.ReactNode // FUNCTION TO RENDER ACTION SECTION [ like OPEN MENU, ERASE, EDIT ]
}

const MSTable = ({ headers, data, render, actionSection, rowHeight=38, submenuItems=null, defaultSort="" }:MSTablePropsType) => {

    const { ref: tableContainerRef, width: tableContainerWidth, height: tableContainerHeight } = useResizeDetector()

    const tableContainerXLimit = React.useMemo(() => Math.floor((tableContainerRef.current?.offsetLeft || 0) + (tableContainerWidth || 0)), [tableContainerRef.current?.offsetLeft, tableContainerWidth])

    const [table, setTable] = React.useState<TableContextType>({
        heads: headers,
        updateHeadWidth: (key: string, width: number) => {
            console.log(key, width)

            setTable((table) => ({
                ...table,
                heads: table.heads.map((head) => {
                    if (head.key === key) {
                        return {
                            ...head,
                            size: width
                        }
                    }

                    return head
                })
            }))
        }
    });
    
    return (
        <TableContext.Provider value={table}>
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
                <Box ref={tableContainerRef} sx={{ 
                    flexGrow: 1,
                    position: 'relative',
                }}>
                    <TableBox 
                        rowHeight={rowHeight}
                        containerWidth={tableContainerWidth} 
                        containerHeight={tableContainerHeight}
                        headers={table.heads}
                        data={data}
                        render={render}
                        actionSection={actionSection}
                        submenuItems={submenuItems}
                        containerXLimit={tableContainerXLimit}
                        defaultSort={defaultSort}
                    />
                </Box>
                <Box>Pagination</Box>
            </Stack>
        </TableContext.Provider>
    )
}

export default MSTable