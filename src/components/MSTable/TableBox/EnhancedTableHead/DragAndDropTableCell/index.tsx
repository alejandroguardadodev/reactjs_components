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
    
}))

interface DragAndDropTableCellPropsType {
    head: IMSTblHead,
    dragHover: boolean,
    
    moveItem: (key: string, to: number) => void
    findItem: (key: string) => { index: number }
    hoverHeader: (key: string) => void
    clearHoverHeader: () => void

    hideLeftBorder?: boolean,
}

interface Item {
    id: string
    originalIndex: number
}

const TYPE_CARD = 'CARD'

const DragAndDropTableCell = ({ head, dragHover, moveItem, findItem, hoverHeader, clearHoverHeader, hideLeftBorder=false }:DragAndDropTableCellPropsType) => {

    const originalIndex = findItem(head.key).index

    const [{ isDragging }, drag] = useDrag(
        () => ({
            type: TYPE_CARD,
            item: { id: head.key, originalIndex },
            collect: (monitor) => ({
                isDragging: monitor.isDragging(),
            }),
            end: (item, monitor) => {
                const { id: droppedId, originalIndex } = item

                const didDrop = monitor.didDrop()

                clearHoverHeader()

                if (!didDrop) {
                    moveItem(droppedId, originalIndex)
                }
            },
        }),
        [head.key, originalIndex, moveItem],
    )

    const [, drop] = useDrop(
        () => ({
            accept: TYPE_CARD,
          
            hover({ id: draggedId }: Item) {
                if (draggedId !== head.key) hoverHeader(head.key)
            },
            drop({ id: draggedId }: Item) {
                if (draggedId !== head.key) {
                    const { index: overIndex } = findItem(head.key)
                    moveItem(draggedId, overIndex)
                }
            },
        }),
        [findItem, moveItem],
    )

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
                ...(!hideLeftBorder && dragHover && {
                    borderLeft: '1px solid #038C65 !important'
                })
            }}
        >
            <TableSortLabel
                active={false}
                direction={'asc'}
                sx={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between'
                }}
            >
                {head.label}
            </TableSortLabel>
        </CustomTableCell>
    )
}

export default DragAndDropTableCell