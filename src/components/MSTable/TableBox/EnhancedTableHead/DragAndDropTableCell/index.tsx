import React from 'react'

import { useResizeDetector } from 'react-resize-detector'
import { ConnectableElement, useDrag, useDrop } from 'react-dnd'
import { styled } from '@mui/system'

import {
    TableCell,
    TableSortLabel,
    Box
} from '@mui/material'

import { 
    IMSTblHead 
} from '../../../../../models/MSTableModel'

import TableContext from '../../../../../contexts/TableContext'

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
    handleMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void

    hideLeftBorder?: boolean, // HIDE LEFT BORDER
}

// ITEM INTERFACE
interface Item {
    id: string
    originalIndex: number
}

const TYPE_CARD = 'CARD'

const DragAndDropTableCell = ({ head, dragHover, orderBy, order, moveItem, findItem, clearHoverHeader, onRequestSort, handleMouseDown, hideLeftBorder=false }:DragAndDropTableCellPropsType) => {

    // CONTEXT ----------------------------------------------------------------------------------
    const tableContext = React.useContext(TableContext)
    
    // USE STATE --------------------------------------------------------------------------------
    const [cellHeadWidth, setCellHeadWidth] = React.useState<number | undefined>(head.size)

    // USE MEMO ---------------------------------------------------------------------------------
    const OriginalIndex = React.useMemo(() => findItem(head.key).index, [head.key, findItem])
    const HeadCellWidth = React.useMemo(() => head.size, [head.size])

    // USE HOOKS --------------------------------------------------------------------------------
    const { ref: cellRef, width: cellWidth } = useResizeDetector() // GET CURRENT CELL WIDTH

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

    // ACTIONS ----------------------------------------------------------------------------------
    const createSortHandler = (property:string) => (event: React.MouseEvent<unknown>) => { onRequestSort(event, property); }

    // const handleMouseDown:React.MouseEventHandler<HTMLButtonElement> = (mouseDownEvent) => {
        
    //     updateHeadCellPosX(mouseDownEvent.pageX)
        
    //     const startSize = Math.floor(cellWidth || 0)
    //     const startPosition = { x: mouseDownEvent.pageX || 0 }
        
    //     const onMouseMove = (mouseMoveEvent: MouseEvent) => {
    //         //tableContext?.updateHeadWidth(head.key, startSize - startPosition.x + mouseMoveEvent.pageX)
    //         //setCellHeadWidth(startSize - startPosition.x + mouseMoveEvent.pageX)

    //         updateHeadCellPosX(Math.floor(mouseMoveEvent.clientX))
    //     }
    
    //     function onMouseUp() {
    //         document.body.removeEventListener("mousemove", onMouseMove)
            
    //         updateHeadCellPosX(null)
    //     }
      
    //     document.body.addEventListener("mousemove", onMouseMove)
    //     document.body.addEventListener("mouseup", onMouseUp, { once: true })
    // }

    // ------------------------------------------------------------------------------------------

    return (
        <CustomTableCell
            ref={cellRef}
            key={head.key}
            align="left"
            padding='none'
            sx={{
                opacity: `${OPACITY}`,
                ...(cellHeadWidth && {
                    width: `${cellHeadWidth}px`,
                    maxWidth: `${cellHeadWidth}px`,
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
            <DragNDropCell onMouseDown={handleMouseDown} />
        </CustomTableCell>
    )
}

export default DragAndDropTableCell