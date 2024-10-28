import React from 'react'

import { styled } from '@mui/system'

import { useDrop } from 'react-dnd'

import { 
    TableHead,
    TableRow,
    TableCell,
    Box
} from '@mui/material'

import TableContext from '../../../../contexts/TableContext'

import DragAndDropTableCell from './DragAndDropTableCell'

const HeadBlinkCell = styled('span', {
    shouldForwardProp: (props) => props !== "headCellPosX"
})<{ headCellPosX:number; }>(({ headCellPosX }) => ({
    position: 'absolute', 
    left: headCellPosX - 4, // Adjust for centering
    top: 0, // Adjust for centering
    width: 8, 
    height: '100%', 
    pointerEvents: 'none',
    zIndex: 1000,
    background: '#038C65',
}))

interface IChangeColumnSizeType {
    key: string
    index: number
    startWidt: number
    startPosition: number
}

interface EnhancedTableHeadPropsType {
    orderBy: string
    order: 'asc' | 'desc'

    onRequestSort: (event: React.MouseEvent<unknown>, property: string) => void

    showAction?: boolean // SHOULD SHOW ACTION COLUMN
}

const TYPE_CARD = 'CARD' // TO IDENTIFY CURRENT DRAG / DROP TYPE

const SMALLEST_CELL_SIZE = 150
const BIGGEST_CELL_SIZE = 400

const EnhancedTableHead = ({ order, orderBy, onRequestSort, showAction=false }:EnhancedTableHeadPropsType) => {

    // CONTEXT ----------------------------------------------------------------------------------
    const tableContext = React.useContext(TableContext)
    
    // USE HOOKS --------------------------------------------------------------------------------
    const tblHeadRef = React.useRef<HTMLTableSectionElement>(null)

    // DRAG AND DROP ----------------------------------------------------------------------------
    const [, drop] = useDrop(() => ({ accept: TYPE_CARD }))

    // USE STATE --------------------------------------------------------------------------------
    const [isResizing, setIsResizing] = React.useState(false)
    const [headCellPosX, setHeadCellPosX] = React.useState<number>(0)
    const [headCellPagePosX, setHeadCellPagePosX] = React.useState<number>(0)

    const [InfoColumnResize, setInfoColumnResize] = React.useState<IChangeColumnSizeType | null>(null)

    // USE MEMO ---------------------------------------------------------------------------------

    // CALLBACKS --------------------------------------------------------------------------------
    const FindHeader = React.useCallback(
        (key: string) => {
            if (tableContext == null) return { head: null, index: -1 }

            const head = tableContext.heads.filter((h) => `${h.key}` === key)[0]

            return {
                head,
                index: tableContext.heads.indexOf(head),
            }
        }, [tableContext?.heads],
    ) // FIND HEADER BY KEY
    
    // ACTIONS ----------------------------------------------------------------------------------
    const ClearHoverHeader = () => tableContext?.setHoverHead(null) 

    const MoveHeader = React.useCallback(
        (key: string, atIndex: number) => {
            const { head, index } = FindHeader(key)

            if (head == null) return
            
            tableContext?.moveHead(head, index, atIndex)

        }, [FindHeader, tableContext],
    )
    
    const createHandleMouseDown = (cellRef: React.RefObject<HTMLTableCellElement>, key: string, index: number) => {
        return (e: React.MouseEvent<HTMLDivElement>) => {

            const startPosition = e.clientX

            const startCellWidth = Math.floor(cellRef.current?.offsetWidth || 0)

            const cellRectLeft = Math.floor(cellRef.current?.getBoundingClientRect().left || 0)

            const cellLeftLimit = cellRectLeft + SMALLEST_CELL_SIZE
            const cellRightLimit = cellRectLeft + BIGGEST_CELL_SIZE

            setHeadCellPosX(startPosition - (tblHeadRef?.current?.getBoundingClientRect().left || 0))
    
            const onMouseMove = (mouseMoveEvent: MouseEvent) => {
                if (mouseMoveEvent.clientX > cellLeftLimit && mouseMoveEvent.clientX < cellRightLimit) {
                    setHeadCellPagePosX(mouseMoveEvent.pageX)
                    setHeadCellPosX(mouseMoveEvent.clientX - (tblHeadRef?.current?.getBoundingClientRect().left || 0))
                }
            }
        
            function onMouseUp() {
                document.body.removeEventListener("mousemove", onMouseMove)

                setIsResizing(false)
                setInfoColumnResize({
                    key,
                    index,
                    startWidt: Math.round(startCellWidth),
                    startPosition,
                })
            }
          
            setIsResizing(true)
            document.body.addEventListener("mousemove", onMouseMove)
            document.body.addEventListener("mouseup", onMouseUp, { once: true })
        }
    }

    // USE EFECT --------------------------------------------------------------------------------
    React.useEffect(() => {
        if (!InfoColumnResize) return

        const { key, startWidt, startPosition } = InfoColumnResize

        const movement = Math.round(headCellPagePosX) - startPosition
        const newSize = startWidt + movement

        tableContext?.updateHeadWidth(key, newSize)

        setInfoColumnResize(null)
        setHeadCellPagePosX(0)
        setHeadCellPosX(0)

    }, [InfoColumnResize, headCellPosX, tableContext])

    // ------------------------------------------------------------------------------------------

    return (
        <TableHead ref={tblHeadRef}>
            <TableRow ref={drop} sx={{ position: 'relative' }}>
                {tableContext && tableContext.displayedHeads.map((head, index) => (
                    <DragAndDropTableCell 
                        order={order}
                        orderBy={orderBy}
                        dragHover={tableContext.hoverHeadKey == head.key} 
                        hideLeftBorder={index == 0} 
                        key={head.key} 
                        head={head} 
                        findItem={FindHeader} 
                        moveItem={MoveHeader} 
                        clearHoverHeader={ClearHoverHeader}
                        onRequestSort={onRequestSort}
                        createHandleMouseDown={createHandleMouseDown}
                    />
                ))}

                {/* CREATE A NEW COLUMN IF ACTIONS IS REQUIRED */}
                {showAction && (<TableCell sx={{ transition: 'all .15s ease-in-out' }}></TableCell>)}

                {isResizing && (<HeadBlinkCell headCellPosX={headCellPosX} />)}
            </TableRow>
        </TableHead>
    )
}

export default EnhancedTableHead