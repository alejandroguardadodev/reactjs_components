import React from 'react'

import { display, styled } from '@mui/system'

import { ConnectableElement, useDrag, useDrop } from 'react-dnd'

import {
    Stack,
    IconButton,
    TableCell,
} from '@mui/material'

import ResizeBlink from './ResizeBlink'

import { MTblHeaderDataType, TableContext } from '../../../contexts/MTableContextProvider'

import { DRAG_DROP_TYPE_HEADER } from '../../../../../constants'

import MoreVertIcon from '@mui/icons-material/MoreVert'

const TableCellLabel = styled(Stack)(() => ({
    width: '100%',
    '& .MBtn-submenu': {
        padding: '0px !important',
        opacity: '0',
        transition: 'all 0.2s ease-in-out',
        '& svg': {
            fontSize: '1rem'
        }
    },
    '&:hover .MBtn-submenu': {
        opacity: '1'
    }
}))

interface ItemType {
    id: string
    originalIndex: number
}

interface DnDTableCellPropsType {
    head: MTblHeaderDataType

    findHeadData: (key: string) => { index: number }
    moveHead: (key: string, atIndex: number) => void
    createMouseDownHandler: (cellRef: React.RefObject<HTMLTableCellElement>, key: string, index: number) => (e: React.MouseEvent<HTMLDivElement>) => void
}

const DnDTableCell = ({ head,findHeadData, moveHead, createMouseDownHandler }:DnDTableCellPropsType) => {

    const tableContext = React.useContext(TableContext)

    const cellRef = React.useRef<HTMLTableCellElement>(null)

    const OriginalIndex = React.useMemo(() => findHeadData(head.key).index, [head.key, findHeadData])

    const HeadCellWidth = React.useMemo(() => head.width, [head.width])

    const [{ isDragging }, drag] = useDrag(
        () => ({
            type: DRAG_DROP_TYPE_HEADER,
            item: { id: head.key, OriginalIndex }, // LINKED INDEX WITH KEY
            collect: (monitor) => ({
                isDragging: monitor.isDragging(), // IDENTIFY IF IS DRAGGING
            }),
            end: (item, monitor) => {
                const { id: droppedId, OriginalIndex: OIndex } = item // GET ITEM ID [KEY] AND INDEX

                const didDrop = monitor.didDrop() // IDENTIFY IF DROPPED

                tableContext.setHoverHead?.(null) // IF WE HAVE FINESHED DRAGGING, CLEAR HOVERED COLUMN

                if (!didDrop) moveHead(droppedId, OIndex) // IF WE HAVE FINISHED DRAGGING AND DID NOT DROP, MOVE TO ORIGINAL INDEX
            },
        }),
        [head.key, OriginalIndex, moveHead],
    )

    const [, drop] = useDrop(
        () => ({
            accept: DRAG_DROP_TYPE_HEADER,
          
            //hover({ id: draggedId }: Item) {
            hover() {
                tableContext.setHoverHead?.(head.key) // IF WE ARE HOVERING OVER ANOTHER COLUMN, SET IT AS HOVERED
            },
            drop({ id: draggedId }: ItemType) {
                if (draggedId !== head.key) { // IF WE HAVE DROPPED ON ANOTHER COLUMN, MOVE IT TO THAT COLUMN
                    const { index: overIndex } = findHeadData(head.key)
                    moveHead(draggedId, overIndex)
                }
            },
        }),
        [findHeadData, findHeadData],
    )

    const actionCreateSortHandler = () => { tableContext.handleRequestSort?.(head.key); }

    // active={tableContext.orderBy === head.key}
    //                 direction={tableContext.orderBy === head.key ? tableContext.order : 'asc'}
    //                 onClick={actionCreateSortHandler}

    return (
        <TableCell
            ref={cellRef}
            key={head.key}
            align="left"
            padding='none'
            sx={{ 
                transition: 'all .15s ease-in-out',
                ...(HeadCellWidth && {
                    width: `${HeadCellWidth}px`,
                    maxWidth: `${HeadCellWidth}px`,
                }),
                position: 'relative',
            }}
        >
            <TableCellLabel
                ref={(node:ConnectableElement) =>  head.blockDnD? null : drag(drop(node)) }
                direction="row"
                justifyContent="space-between"
                alignItems="center"
            >
                {head.label}

                <IconButton className='MBtn-submenu' aria-label="show_sub_menu" disableRipple>
                    <MoreVertIcon />
                </IconButton>
            </TableCellLabel>

            <ResizeBlink onMouseDown={createMouseDownHandler(cellRef, head.key, OriginalIndex)} />
        </TableCell>
    )
}

export default DnDTableCell