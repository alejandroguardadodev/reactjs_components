import React from "react"

import { 
    IMSTblCell,
} from "../../../models/MSTableModel"

import { 
    TableContainer,
    Table,
    TableBody,
    Box
} from "@mui/material"

import TableContext from "../../../contexts/TableContext"


import MSRow from "./MSRow"
import EnhancedTableHead from "./EnhancedTableHead"

// SUB MENU ITEMS TYPES
interface MenuItemType {
    title: string;
    icon?: React.ReactNode;
}

interface TableBoxPropsType {
    rowHeight: number // ROW HEIGHT
    defaultSort: string // DEFAULT SORT COLUMN
    submenuItems: null | MenuItemType[] // SUB MENU ITEMS
    containerWidth?: number // CONTAINER WIDTH
    containerHeight?: number // CONTAINER HEIGHT
    containerXLimit?: number // CONTAINER X LIMIT

    actionSection?: (row: any) => React.ReactNode // ACTION SECTION
}

// COMPARE TWO ELEMENTS OF THE ROW AND ORDER THEM
function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    if (b[orderBy] < a[orderBy]) return -1;
    if (b[orderBy] > a[orderBy]) return 1;
    
    return 0;
}

function getComparator<Key extends keyof any>(order: 'asc' | 'desc', orderBy: Key): ( a: { [key in Key]: number | string }, b: { [key in Key]: number | string } ) => number {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

const TableBox = ({ defaultSort, actionSection, containerWidth=0, containerHeight=0, rowHeight, submenuItems=null, containerXLimit=0 }: TableBoxPropsType) => {

    // CONTEXT ----------------------------------------------------------------------------------
    const tableContext = React.useContext(TableContext)
    
    // USE STATE --------------------------------------------------------------------------------
    const [order, setOrder] = React.useState<'asc' | 'desc'>('asc') // ORDER OF THE CURRENT PROPETY
    const [orderBy, setOrderBy] = React.useState<string>(defaultSort) // PROPETY TO BE SORTED

    // USE MEMO ---------------------------------------------------------------------------------
    const TableContainerWidth = React.useMemo(() => Math.floor(containerWidth), [containerWidth]) // CONTAINER WIDTH
    const TableContainerHeight = React.useMemo(() => Math.floor(containerHeight), [containerHeight]) // CONTAINER HEIGHT

    const NumberOfRows = React.useMemo(() => Math.floor(TableContainerHeight / rowHeight), [TableContainerHeight, rowHeight]) // NUMBER OF ROWS BY SPACE
    //const showActionHead = React.useMemo(() => Boolean(actionSection), [actionSection]) // CHECK IF THE ACTION SECTION IS ENABLED
    
    const VisibleRows = React.useMemo(
        () => {
            if (tableContext?.data) 
                return [...tableContext.data].sort(getComparator(order, orderBy))

            return []
        }, [order, orderBy, tableContext?.data],
    )

    // ACTIONS ----------------------------------------------------------------------------------
    const orderCellsByHeader = (cells:IMSTblCell[]) => (
        tableContext?.displayedHeads.map((h) => {
            const c = cells.find(c => c.key == h.key)

            if (c) return c
        })
    ) // ORDER CELLS BY HEADER POSITION

    const handleRequestSort = ( event: React.MouseEvent<unknown>, property: string ) => {
        const isAsc = orderBy === property && order === 'asc'

        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    } // HANDLE SORTING

    // ------------------------------------------------------------------------------------------

    return (
        <TableContainer
            sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: `${TableContainerWidth}px`,
                height: `${TableContainerHeight}px`,
            }}
        >
            <Table
                size="medium"
                stickyHeader
            >
                {/* RENDER HEADERS */}
                <EnhancedTableHead 
                    showAction={Boolean(actionSection)} 
                    order={order}
                    orderBy={orderBy}

                    onRequestSort={handleRequestSort}
                />
                <TableBody>
                    {/* DISPLAY ROWS */}
                    {VisibleRows && VisibleRows.slice(0, NumberOfRows).map((row, index) => {
                        if (tableContext == null) return

                        const [_row, id] = tableContext.render(row)

                        const cells = orderCellsByHeader(_row) || []

                        return <MSRow
                            id={id}
                            key={`row-${index}`} 
                            data={cells}
                            hoverHead={tableContext.hoverHeadKey}
                            action={actionSection && actionSection(row)}
                            items={submenuItems}
                            inputHeaderKeys={tableContext.inputHeads}
                            containerXLimit={containerXLimit}
                        />
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default TableBox