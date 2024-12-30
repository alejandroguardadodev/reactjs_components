import React from 'react'
import update from 'immutability-helper'

import {
    IMSTblHead,
    IMSTblCell,
    IMSTableHeadInputType
} from '../../../models/MSTableModel'

import { 
    Box,
    Stack,
    TablePagination
} from "@mui/material"

import TableBox from "./TableBox"
import EnhancedTableToolbar from './EnhancedTableToolbar'

import { useResizeDetector } from 'react-resize-detector'
import useResponsive from '../../../hooks/old_useResponsive'

import TableContext, { TableContextType } from '../../../contexts/TableContext'

// SUB MENU ITEMS TYPES
interface MenuItemType {
    title: string;
    icon?: React.ReactNode;
    onClick?: (id: string, value: (IMSTblCell | undefined)[]) => void;
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

const MSTable = ({ headers, data, render, actionSection, rowHeight=40, submenuItems=null, defaultSort="" }:MSTablePropsType) => {

    // HOOKS ------------------------------------------------------------------------------------
    const { 
        ref: tableContainerRef, 
        width: tableContainerWidth, 
        height: tableContainerHeight
    } = useResizeDetector() // GET THE WIDTH AND HEIGHT OF THE TABLE CONTAINER
    const { isDesktop, isTablet, isMobile } = useResponsive() // IDENTIFY THE CURRENT DEVICE SIZE

    // USE STATES -------------------------------------------------------------------------------
    const [page, setPage] = React.useState(0);

    // USE MEMOS --------------------------------------------------------------------------------
    const tableContainerXLimit = React.useMemo(
        () => Math.floor((tableContainerRef.current?.offsetLeft || 0) + (tableContainerWidth || 0)), 
        [tableContainerRef.current?.offsetLeft, tableContainerWidth]
    ) // GET THE X LIMIT OF THE TABLE CONTAINER

    const NumberOfRows = React.useMemo(() => Math.floor((tableContainerHeight || 0) / rowHeight), [tableContainerHeight, rowHeight]) // NUMBER OF ROWS BY SPACE

    // CALLBACKS --------------------------------------------------------------------------------
    const CheckShowColumn = React.useCallback((header:IMSTblHead) => {
        if (isMobile && header.hideOnMobileDevice) return false
        else if (isTablet && header.hideOnTabletDevice) return false
        else if (isDesktop && header.hideOnDesktopDevice) return false
        
        return true
    }, [isDesktop, isTablet, isMobile])

    // PREPARE CONTEXT --------------------------------------------------------------------------
    const [table, setTable] = React.useState<TableContextType>({
        heads: headers,
        inputHeads: headers.filter((h) => Boolean(h.inputType) && Boolean(h.onSubmit)).map((h) => ({
            key: h.key,
            inputType: h.inputType || IMSTableHeadInputType.TEXT,
            onSubmit: h.onSubmit
        })),
        displayedHeads: headers.filter((h) => CheckShowColumn(h)),
        data,
        hoverHeadKey: null,
        mousePosXResize: null,
        render,
        // UPDATE HEADER CELL WIDTH
        updateHeadWidth: (key: string, width: number) => {
            if (width <= 100) return
            
            setTable((table) => update(table, {
                heads: {
                    [table.heads.findIndex((h) => h.key === key)]: {
                        size: {
                            $set: width
                        }
                    }
                }
            }))
        },
        setHoverHead: (key: string | null) => {
            setTable((table) => ({
                ...table,
                hoverHeadKey: key
            }))
        },
        moveHead: (head, index, atIndex) => {
            setTable((table) => update(table, {
                heads: {
                    $splice: [
                        [index, 1],
                        [atIndex, 0, head],
                    ],
                }
            }))
        },
        setMousePosXResize: (value) => setTable((table) => ({
            ...table,
            mousePosXResize: value
        }))
    })

    // ACTIONS ----------------------------------------------------------------------------------
    const handleChangePage = (newPage: number) => { setPage(newPage); }

    // USE EFFECTS ------------------------------------------------------------------------------
    React.useEffect(() => {
        setTable((table) => ({
            ...table,
            displayedHeads: table.heads.filter((h) => CheckShowColumn(h)), // FILTER HEADS BY SCREEN SIZE
        }))

    }, [isDesktop, isTablet, isMobile, table.heads])

    React.useEffect(() => {
        setTable((table) => ({
            ...table,
            data: data
        }))
    }, [data])
    // ------------------------------------------------------------------------------------------
    
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
                <Box>
                    <EnhancedTableToolbar title='Test Table' />
                </Box>
                <Box ref={tableContainerRef} sx={{ 
                    flexGrow: 1,
                    position: 'relative',
                }}>
                    <TableBox 
                        containerWidth={tableContainerWidth} 
                        containerHeight={tableContainerHeight}
                        actionSection={actionSection}
                        submenuItems={submenuItems}
                        containerXLimit={tableContainerXLimit}
                        defaultSort={defaultSort}
                        page={page}
                        numberOfRows={NumberOfRows}
                    />
                </Box>
                <Box>
                    <TablePagination
                        rowsPerPageOptions={[]}
                        component="div"
                        count={data.length}
                        rowsPerPage={NumberOfRows}
                        page={page}
                        onPageChange={(_, newPage) => handleChangePage(newPage)}
                    />
                </Box>
            </Stack>
        </TableContext.Provider>
    )
}

export default MSTable