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
    backgroundColor: 'red',
    pointerEvents: 'none',
    zIndex: 1000,
}))

interface EnhancedTableHeadPropsType {
    orderBy: string
    order: 'asc' | 'desc'

    onRequestSort: (event: React.MouseEvent<unknown>, property: string) => void

    showAction?: boolean // SHOULD SHOW ACTION COLUMN
}

const TYPE_CARD = 'CARD' // TO IDENTIFY CURRENT DRAG / DROP TYPE

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
    
    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {

        setHeadCellPosX(e.clientX - (tblHeadRef?.current?.getBoundingClientRect().left || 0))

        const onMouseMove = (mouseMoveEvent: MouseEvent) => {
            setHeadCellPosX(mouseMoveEvent.clientX - (tblHeadRef?.current?.getBoundingClientRect().left || 0))
        }
    
        function onMouseUp() {
            document.body.removeEventListener("mousemove", onMouseMove)
            
            setIsResizing(false)
        }
      
        setIsResizing(true)
        document.body.addEventListener("mousemove", onMouseMove)
        document.body.addEventListener("mouseup", onMouseUp, { once: true })
    }

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
                        handleMouseDown={handleMouseDown}
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