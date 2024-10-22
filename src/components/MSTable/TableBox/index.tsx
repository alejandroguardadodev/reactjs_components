import React from "react"

import { 
    IMSTblHead,
    IMSTblCell,
    IMSTblKeyInputType,
    IMSTableHeadInputType
} from "../../../models/MSTableModel"

import { 
    TableContainer,
    Table,
    TableBody
} from "@mui/material"

import MSRow from "./EnhancedTableHead/MSRow"
import EnhancedTableHead from "./EnhancedTableHead"

import useResponsive from "../../../hooks/useResponsive"

// SUB MENU ITEMS TYPES
interface MenuItemType {
    title: string;
    icon?: React.ReactNode;
}

interface TableBoxPropsType {
    rowHeight: number // ROW HEIGHT
    headers: IMSTblHead[] // HEADERS FOR THE TABLE
    data: any[]; // DATA OF THE TABLE
    render: (row:any) => [IMSTblCell[], string] // RENDER FUNCTION FOR THE ROWS
    submenuItems: null | MenuItemType[] // SUB MENU ITEMS
    containerWidth?: number // CONTAINER WIDTH
    containerHeight?: number // CONTAINER HEIGHT
    containerXLimit?: number // CONTAINER X LIMIT
    actionSection?: (row: any) => React.ReactNode // ACTION SECTION
}

const TableBox = ({ headers, data, render, actionSection, containerWidth=0, containerHeight=0, rowHeight, submenuItems=null, containerXLimit=0 }: TableBoxPropsType) => {

    const { isDesktop, isTablet, isMobile } = useResponsive() // IDENTIFY THE CURRENT DEVICE SIZE

    const [ heads, setHeads ] = React.useState<IMSTblHead[]>(headers) // CREATE A STATE FOR THE HEADERS TO BE MODIFIED BY THE DRAG AND DROP FUNCTION
    const [ hoverHead, setHoverHead ] = React.useState<string | null>(null) // CREATE A STATE FOR THE HOVERED HEAD KEY IDENTIFIER

    // GET THE CURRENT SIZE OF THE TABLE CONTAINER
    const width = React.useMemo(() => Math.floor(containerWidth), [containerWidth]) // CONTAINER WIDTH
    const height = React.useMemo(() => Math.floor(containerHeight), [containerHeight]) // CONTAINER HEIGHT

    // GET ROW INFO
    const numberOfRows = React.useMemo(() => Math.floor(height / rowHeight), [height, rowHeight]) // NUMBER OF ROWS BY SPACE

    const showActionHead = React.useMemo(() => Boolean(actionSection), [actionSection]) // CHECK IF THE ACTION SECTION IS ENABLED

    // GET WHICH HEADERS HAVE BEEN AVAILABLE TO BE INPUT [ THEY REQUIRED A INPUT TYPE AND A SUBMIT FUNCTION ]
    const inputHeaderKeys = React.useMemo<IMSTblKeyInputType[]>(() => headers.filter((h) => Boolean(h.inputType) && Boolean(h.onSubmit)).map((h) => ({
        key: h.key,
        inputType: h.inputType || IMSTableHeadInputType.TEXT,
        onSubmit: h.onSubmit
    })), [headers])

    // UPDATE HEADERS (COPY)
    const updtateHeaders = (hs:IMSTblHead[]) => setHeads(hs)

    // DEFINE IF A COLUMN SHOULD BE SHOWN OR NOT BY CURRENT DISPLAY SIZE
    const ShowColumn = React.useCallback((header:IMSTblHead) => {
        if (isMobile && header.hideOnMobileDevice) return false
        else if (isTablet && header.hideOnTabletDevice) return false
        else if (isDesktop && header.hideOnDesktopDevice) return false
        
        return true
    }, [isDesktop, isTablet, isMobile])

    // RETURN ONLY THE HEADERS THAT ARE ENABLED TO BE SHOWN
    const displayedHeads = React.useMemo(() => heads.filter((h) => ShowColumn(h)), [ShowColumn, heads])

    // RETURN THE CELLS AVAILABLE BY THE DISPLAYED HEADERS
    const orderCellsByHeader = (cells:IMSTblCell[]) => (
        displayedHeads.map((h) => {
            const c = cells.find(c => c.key == h.key)

            if (c) return c
        })
    )

    // CHANGE THE CURRENT HOVER HEADER
    const defineHoverHeader = (value: string | null) => setHoverHead(value)

    return (
        <TableContainer>
            <Table
                size="medium"
                stickyHeader
            >
                {/* RENDER HEADERS */}
                <EnhancedTableHead showAction={Boolean(actionSection)} headers={displayedHeads} hoverHead={hoverHead} updtateHeaders={updtateHeaders} setHoverHead={defineHoverHeader} />
                <TableBody>
                    {/* DISPLAY ROWS */}
                    {data && data.map((row, index) => {
                        const [_row, id] = render(row)

                        const cells = orderCellsByHeader(_row)

                        return <MSRow
                            id={id}
                            key={`row-${index}`} 
                            data={cells}
                            hoverHead={hoverHead}
                            action={actionSection && actionSection(row)}
                            items={submenuItems}
                            inputHeaderKeys={inputHeaderKeys}
                            containerXLimit={containerXLimit}
                        />
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default TableBox