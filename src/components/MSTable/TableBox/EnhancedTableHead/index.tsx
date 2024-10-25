import React from 'react'

import { useDrop } from 'react-dnd'

import { 
    TableHead,
    TableRow,
    TableCell
} from '@mui/material'

import TableContext from '../../../../contexts/TableContext'

import DragAndDropTableCell from './DragAndDropTableCell'

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
    
    // DRAG AND DROP ----------------------------------------------------------------------------
    const [, drop] = useDrop(() => ({ accept: TYPE_CARD }))

    // USE STATE --------------------------------------------------------------------------------

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
    
    // ------------------------------------------------------------------------------------------

    return (
        <TableHead>
            <TableRow ref={drop}>
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
                    />
                ))}

                {/* CREATE A NEW COLUMN IF ACTIONS IS REQUIRED */}
                {showAction && (<TableCell></TableCell>)}
            </TableRow>
        </TableHead>
    )
}

export default EnhancedTableHead