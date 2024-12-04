import React from 'react'

import { display, styled } from '@mui/system'

import { ConnectableElement, useDrag, useDrop } from 'react-dnd'
import { getEmptyImage } from 'react-dnd-html5-backend'

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
    originalIndex: number,
    ref: any
}

interface DnDTableCellPropsType {
    head: MTblHeaderDataType
    zIndex: number
    dragHover: boolean

    findHeadData: (key: string) => { index: number }
    moveHead: (key: string, atIndex: number) => void
    createMouseDownHandler: (cellRef: React.RefObject<HTMLTableCellElement>, key: string, index: number) => (e: React.MouseEvent<HTMLDivElement>) => void

    setHoverHead: (key: string) => void
}

const DnDTableCell = ({ head, zIndex, dragHover, findHeadData, moveHead, createMouseDownHandler, setHoverHead }:DnDTableCellPropsType) => {

    const tableContext = React.useContext(TableContext)

    const cellRef = React.useRef<HTMLTableCellElement>(null)

    const OriginalIndex = React.useMemo(() => findHeadData(head.key).index, [head.key, findHeadData])

    const HeadCellWidth = React.useMemo(() => head.width, [head.width])

    const [{ isDragging }, drag, preview] = useDrag(
        () => ({
            type: DRAG_DROP_TYPE_HEADER,
            item: { id: head.key, OriginalIndex, ref: cellRef, }, // LINKED INDEX WITH KEY
            collect: (monitor) => {
                return {
                    isDragging: !!monitor.isDragging(), // IDENTIFY IF IS DRAGGING
                }
            },
            end: (item, monitor) => {
                const { id: droppedId, OriginalIndex: OIndex } = item // GET ITEM ID [KEY] AND INDEX

                const didDrop = monitor.didDrop() // IDENTIFY IF DROPPED

                setHoverHead('') // IF WE HAVE FINESHED DRAGGING, CLEAR HOVERED COLUMN

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
                setHoverHead(head.key) // IF WE ARE HOVERING OVER ANOTHER COLUMN, SET IT AS HOVERED
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

    const onMouseMove = (mouseMoveEvent: MouseEvent) => { console.log('mouse move: ', mouseMoveEvent?.pageX, "; isDragging: ", isDragging) }


    React.useEffect(() => { // REMOVE THE PREVIEW BEHAIVOR BY DEFAULT
        preview(getEmptyImage(), { captureDraggingState: false });
    }, [preview]);

    React.useEffect(() => {
        // // GET CELL INFORMATION
        // if (isDragging) {
        //     console.log('isDragging: ')
        //     document.body.addEventListener("mousemove", onMouseMove)
        // } else {
        //     console.log('END DRAGGING: ')
        //     document.body.removeEventListener("mousemove", onMouseMove)
        // }

        // return () => {
        //     document.body.removeEventListener("mousemove", onMouseMove);
        // };
    }, [isDragging])

    // active={tableContext.orderBy === head.key}
    //                 direction={tableContext.orderBy === head.key ? tableContext.order : 'asc'}
    //                 onClick={actionCreateSortHandler}

    const setDragDropElement = (node:HTMLDivElement):React.ReactElement | null => drag(drop(node))

    return (
        <>
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
                    whiteSspace: 'pre-wrap',
                    wordWrap: 'break-word',
                    zIndex: zIndex,
                    ...(dragHover && {
                        borderLeft: `2px solid #038C65 !important`
                    })
                }}
                className={`${tableContext.isResizing && "non-mouse-event"}`}
            >
                <TableCellLabel
                    ref={(node:HTMLDivElement) =>  head.blockDnD? null : setDragDropElement(node)}
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
        </>
    )
}

export default DnDTableCell