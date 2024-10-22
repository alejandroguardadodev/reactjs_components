import React from 'react'

import { ConnectableElement, useDrag, useDrop } from 'react-dnd'
import { styled } from '@mui/system'

import {
    TableCell,
    TableSortLabel
} from '@mui/material'

import { 
    IMSTblHead 
} from '../../../../../models/MSTableModel'

const CustomTableCell = styled(TableCell)(() => ({
    transition: 'all .15s ease-in-out'
}))

interface DragAndDropTableCellPropsType {
    head: IMSTblHead, // CURRENT HEAD INFO
    dragHover: boolean, // IS ANOTHER COLUMN DRAGED HOVER THE CURRENT COLUMN
     
    moveItem: (key: string, to: number) => void // MOVE COLUMN TO NEW INDEX
    findItem: (key: string) => { index: number } // FINE COLUMN BY AN INDEX
    hoverHeader: (key: string) => void // SET COLUMN AS HOVERED
    clearHoverHeader: () => void // CLEAR HOVERED COLUMN

    hideLeftBorder?: boolean, // HIDE LEFT BORDER
}

// ITEM INTERFACE
interface Item {
    id: string
    originalIndex: number
}

const TYPE_CARD = 'CARD'

const DragAndDropTableCell = ({ head, dragHover, moveItem, findItem, hoverHeader, clearHoverHeader, hideLeftBorder=false }:DragAndDropTableCellPropsType) => {

    // GET ORIGINAL INDEX
    const originalIndex = findItem(head.key).index

    // DRAG INFORMATION FUNCTION
    const [{ isDragging }, drag] = useDrag(
        () => ({
            type: TYPE_CARD,
            item: { id: head.key, originalIndex }, // LINKED INDEX WITH KEY
            collect: (monitor) => ({
                isDragging: monitor.isDragging(), // IDENTIFY IF IS DRAGGING
            }),
            end: (item, monitor) => {
                const { id: droppedId, originalIndex } = item // GET ITEM ID [KEY] AND INDEX

                const didDrop = monitor.didDrop() // IDENTIFY IF DROPPED

                clearHoverHeader() // IF WE HAVE FINESHED DRAGGING, CLEAR HOVERED COLUMN

                if (!didDrop) {
                    moveItem(droppedId, originalIndex) // IF WE HAVE FINISHED DRAGGING AND DID NOT DROP, MOVE TO ORIGINAL INDEX
                }
            },
        }),
        [head.key, originalIndex, moveItem],
    )

    // DROP INFORMATION FUNCTION
    /**
     * DROP WORKS AS CLIENT SIDE - CHECKING IF ANOTHER "CARD" IS ABOVE US
     */
    const [, drop] = useDrop(
        () => ({
            accept: TYPE_CARD,
          
            //hover({ id: draggedId }: Item) {
            hover() {
                hoverHeader(head.key) // IF WE ARE HOVERING OVER ANOTHER COLUMN, SET IT AS HOVERED
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

    // IF WE ARE DRAGGING, SET THE OPACITY TO 0.5
    const OPACITY = React.useMemo(() => isDragging ? 0.5 : 1, [isDragging])

    return (
        <CustomTableCell
            ref={(node:ConnectableElement) => drag(drop(node))}
            key={head.key}
            align="left"
            padding='none'
            sx={{
                opacity: `${OPACITY}`,
                ...(hideLeftBorder && {
                    borderLeft: '0px !important'
                }),
                ...(dragHover && {
                    borderLeft: `${hideLeftBorder? 2 : 3}px solid #038C65 !important`
                }),
            }}
        >
            <TableSortLabel
                active={false}
                direction={'asc'}
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
        </CustomTableCell>
    )
}

export default DragAndDropTableCell