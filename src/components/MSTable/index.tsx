import React from 'react'
import update from 'immutability-helper'

import {
    IMSTblHead,
    IMSTblCell,
    IMSTableHeadInputType
} from '../../models/MSTableModel'

import { 
    Box,
    Stack
} from "@mui/material"

import TableBox from "./TableBox"

import { useResizeDetector } from 'react-resize-detector'
import useResponsive from '../../hooks/useResponsive'

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

    // HOOKS ------------------------------------------------------------------------------------
    const { 
        ref: tableContainerRef, 
        width: tableContainerWidth, 
        height: tableContainerHeight
    } = useResizeDetector() // GET THE WIDTH AND HEIGHT OF THE TABLE CONTAINER
    const { isDesktop, isTablet, isMobile } = useResponsive() // IDENTIFY THE CURRENT DEVICE SIZE

    // USE MEMOS --------------------------------------------------------------------------------
    const tableContainerXLimit = React.useMemo(
        () => Math.floor((tableContainerRef.current?.offsetLeft || 0) + (tableContainerWidth || 0)), 
        [tableContainerRef.current?.offsetLeft, tableContainerWidth]
    ) // GET THE X LIMIT OF THE TABLE CONTAINER

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
        render,
        // UPDATE HEADER CELL WIDTH
        updateHeadWidth: (key: string, width: number) => {
            if (width <= 100) return

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
    })

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
                <Box>Toolbar</Box>
                <Box ref={tableContainerRef} sx={{ 
                    flexGrow: 1,
                    position: 'relative',
                }}>
                    <TableBox 
                        rowHeight={rowHeight}
                        containerWidth={tableContainerWidth} 
                        containerHeight={tableContainerHeight}
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