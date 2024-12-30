import React from 'react'

import { ConnectableElement, useDrag, useDrop } from 'react-dnd'
import { styled } from '@mui/system'

import {
    TableCell,
    TableSortLabel,
    Box
} from '@mui/material'

import { 
    IMSTblHead 
} from '../../../../../../models/MSTableModel'

import TableContext from '../../../../../../contexts/TableContext'

const CustomTableCell = styled(TableCell)(() => ({
    transition: 'all .15s ease-in-out'
}))

const DragNDropCell = styled(Box)(() => ({
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
    '&:hover': {
        background: '#038C65',
        cursor: 'e-resize'
    }
}))

interface DragAndDropTableCellPropsType {
    head: IMSTblHead // CURRENT HEAD INFO
    dragHover: boolean // IS ANOTHER COLUMN DRAGED HOVER THE CURRENT COLUMN
    orderBy: string
    order: 'asc' | 'desc'

    moveItem: (key: string, to: number) => void // MOVE COLUMN TO NEW INDEX
    findItem: (key: string) => { index: number } // FINE COLUMN BY AN INDEX
    clearHoverHeader: () => void // CLEAR HOVERED COLUMN
    onRequestSort: (event: React.MouseEvent<unknown>, property: string) => void
    createHandleMouseDown: (cellRef: React.RefObject<HTMLTableCellElement>, key: string, index: number) => (e: React.MouseEvent<HTMLDivElement>) => void

    hideLeftBorder?: boolean, // HIDE LEFT BORDER
}

// ITEM INTERFACE
interface Item {
    id: string
    originalIndex: number
}

const TYPE_CARD = 'CARD'

const DragAndDropTableCell = ({ head, dragHover, orderBy, order, moveItem, findItem, clearHoverHeader, onRequestSort, createHandleMouseDown, hideLeftBorder=false }:DragAndDropTableCellPropsType) => {

    // CONTEXT ----------------------------------------------------------------------------------
    const tableContext = React.useContext(TableContext)
    
    // USE STATE --------------------------------------------------------------------------------

    // USE MEMO ---------------------------------------------------------------------------------
    const OriginalIndex = React.useMemo(() => findItem(head.key).index, [head.key, findItem])
    const HeadCellWidth = React.useMemo(() => head.size, [head.size])

    // REF --------------------------------------------------------------------------------------
    const cellRef = React.useRef<HTMLTableCellElement>(null)

    // USE HOOKS --------------------------------------------------------------------------------

    // DRAG AND DROP ----------------------------------------------------------------------------
    const [{ isDragging }, drag] = useDrag(
        () => ({
            type: TYPE_CARD,
            item: { id: head.key, OriginalIndex }, // LINKED INDEX WITH KEY
            collect: (monitor) => ({
                isDragging: monitor.isDragging(), // IDENTIFY IF IS DRAGGING
            }),
            end: (item, monitor) => {
                const { id: droppedId, OriginalIndex: OIndex } = item // GET ITEM ID [KEY] AND INDEX

                const didDrop = monitor.didDrop() // IDENTIFY IF DROPPED

                clearHoverHeader() // IF WE HAVE FINESHED DRAGGING, CLEAR HOVERED COLUMN

                if (!didDrop) {
                    moveItem(droppedId, OIndex) // IF WE HAVE FINISHED DRAGGING AND DID NOT DROP, MOVE TO ORIGINAL INDEX
                }
            },
        }),
        [head.key, OriginalIndex, moveItem],
    )

    const [, drop] = useDrop(
        () => ({
            accept: TYPE_CARD,
          
            //hover({ id: draggedId }: Item) {
            hover() {
                tableContext?.setHoverHead(head.key) // IF WE ARE HOVERING OVER ANOTHER COLUMN, SET IT AS HOVERED
            },
            drop({ id: draggedId }: Item) {
                if (draggedId !== head.key) { // IF WE HAVE DROPPED ON ANOTHER COLUMN, MOVE IT TO THAT COLUMN
                    const { index: overIndex } = findItem(head.key)
                    moveItem(draggedId, overIndex)
                }
            },
        }),
        [findItem, moveItem],
    )

    // PROPERTIES / USEMEMO ---------------------------------------------------------------------
    const OPACITY = React.useMemo(() => isDragging ? 0.5 : 1, [isDragging])

    const BLICKOBJ = React.useMemo<React.ReactNode>(() => (<DragNDropCell onMouseDown={createHandleMouseDown(cellRef, head.key, OriginalIndex)} />), [cellRef, createHandleMouseDown, head.key, OriginalIndex])

    // ACTIONS ----------------------------------------------------------------------------------
    const createSortHandler = (property:string) => (event: React.MouseEvent<unknown>) => { onRequestSort(event, property); }

    // ------------------------------------------------------------------------------------------

    return (
        <CustomTableCell
            ref={cellRef}
            key={head.key}
            align="left"
            padding='none'
            sx={{
                opacity: `${OPACITY}`,
                ...(HeadCellWidth && {
                    width: `${HeadCellWidth}px`,
                    maxWidth: `${HeadCellWidth}px`,
                }),
                ...(hideLeftBorder && {
                    borderLeft: '0px !important'
                }),
                ...(dragHover && {
                    borderLeft: `${hideLeftBorder? 2 : 3}px solid #038C65 !important`
                }),
                position: 'relative',
            }}
        >
            <TableSortLabel
                ref={(node:ConnectableElement) => drag(drop(node))}
                active={orderBy === head.key}
                direction={orderBy === head.key ? order : 'asc'}
                onClick={createSortHandler(head.key)}
                sx={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    '& .MuiTableSortLabel-icon': {
                        fontSize: '0.8rem'
                    }
                }}
            >
                {head.label}
            </TableSortLabel>
            {BLICKOBJ}
        </CustomTableCell>
    )
}

export default DragAndDropTableCell