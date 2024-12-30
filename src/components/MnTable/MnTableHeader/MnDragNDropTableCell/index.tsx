import React from 'react'

import { styled } from '@mui/system'

import { ITableHeaderDataType, TableContext } from '../../../../contexts/TableContextProvider'

import { DRAG_DROP_TYPE_TABLE_COLUMN_HEAD } from '../../../../constants'

import { useDrag, useDrop } from 'react-dnd'
import { getEmptyImage } from 'react-dnd-html5-backend'

import {
    Stack,
    IconButton,
    TableCell,
    Skeleton
} from '@mui/material'

import MnResizeBlink from './MnResizeBlink'
import MnContextMenu, { IAxisType, IContextMenuItemType } from '../../../MnContextMenu'

import MoreVertIcon from '@mui/icons-material/MoreVert'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import LastPageIcon from '@mui/icons-material/LastPage'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'

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
    label: string
    ref: any
}

interface MnDragNDropTableCellPropsType {
    head: ITableHeaderDataType
    zIndex: number
    dragHover: boolean
    last: boolean
    showLastBorder: boolean

    findHeadData: (key: string) => { index: number }
    moveHead: (key: string, atIndex: number) => void
    createMouseDownHandler: (cellRef: React.RefObject<HTMLTableCellElement>, head: ITableHeaderDataType, index: number) => (e: React.MouseEvent<HTMLDivElement>) => void

    setHoverHead: (key: string) => void
}

const MENU_ITEMS:IContextMenuItemType[] = [
    {
        id: 1,
        title: 'Sort ascending',
        icon: <ArrowUpwardIcon />
    },
    {
        id: 2,
        title: 'Sort descending',
        icon: <ArrowDownwardIcon />
    }
]

const MnDragNDropTableCell = ({ head, zIndex, dragHover, last, showLastBorder, findHeadData, moveHead, createMouseDownHandler, setHoverHead }:MnDragNDropTableCellPropsType) => {

    const tableContext = React.useContext(TableContext)

    const cellRef = React.useRef<HTMLTableCellElement>(null)

    const [mousePosition, setMousePosition] = React.useState<null | IAxisType>(null)
    const [subMenuItems, setSubMenuItems] = React.useState<IContextMenuItemType[]>(MENU_ITEMS)

    const OriginalIndex = React.useMemo(() => findHeadData(head.key).index, [head.key, findHeadData])

    const HeadCellWidth = React.useMemo(() => head.width, [head.width])

    const [{ isDragging }, drag, preview] = useDrag(
        () => ({
            type: DRAG_DROP_TYPE_TABLE_COLUMN_HEAD,
            item: { id: head.key, OriginalIndex, ref: cellRef, label: head.label }, // LINKED INDEX WITH KEY
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
            accept: DRAG_DROP_TYPE_TABLE_COLUMN_HEAD,
          
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

    const requestColumnSort = (opt: number) => { tableContext.requestSort?.(head.key, (opt === 1 ? 'asc' : 'desc')); }

    const handleSubMenuClick = (opt: number) => {
        switch (opt) {
            case 1: 
                case 2: 
                    requestColumnSort(opt); 
            break;
            case 3:
                if (!last && !head.blockDnD) moveHead(head.key, OriginalIndex + 1)
                break;
            case 4:
                if (!head.blockHide) tableContext.hideColumn?.(head.key)
                break;
        }
    }


    React.useEffect(() => { // REMOVE THE PREVIEW BEHAIVOR BY DEFAULT
        preview(getEmptyImage(), { captureDraggingState: false });
    }, [preview])

    React.useEffect(() => {

        const items = [
            ...MENU_ITEMS,
        ]

        if (!last && !head.blockDnD) {
            items.push({
                divider: true
            },{
                id: 3,
                title: 'Move Right',
                icon: <LastPageIcon />,
            })
        }

        if (!head.blockHide) {
            items.push({
                divider: true
            },{
                id: 4,
                title: 'Hide',
                icon: <VisibilityOffIcon />,
            })
        }

        setSubMenuItems(items)
    },[last, head])

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

    const handleOpenSubMenu = (e: React.MouseEvent<HTMLButtonElement>) => {
        setMousePosition({ x: e.clientX, y: e.clientY });
    }

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
                className={`${tableContext.isResizing && "non-mouse-event"} ${showLastBorder && "last-border"}`}
            >
                {tableContext.loading? (<Skeleton animation="wave" />) : (<>
                    <TableCellLabel
                        ref={(node:HTMLDivElement) =>  head.blockDnD? null : setDragDropElement(node)}
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        {head.label}

                        <IconButton className='MBtn-submenu' aria-label="show_sub_menu" disableRipple onClick={handleOpenSubMenu}>
                            <MoreVertIcon />
                        </IconButton>
                    </TableCellLabel>

                    <MnResizeBlink onMouseDown={createMouseDownHandler(cellRef, head, OriginalIndex)} />
                </>)}

                {mousePosition && (<MnContextMenu open={!!mousePosition} items={subMenuItems} position={mousePosition} onClose={() => setMousePosition(null)} onClick={(item) => { handleSubMenuClick(item.id || -1) }} />)}
            </TableCell>
        </>
    )
}

export default MnDragNDropTableCell