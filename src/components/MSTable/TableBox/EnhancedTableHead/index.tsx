import React from 'react'
import update from 'immutability-helper'

import { useDrop } from 'react-dnd'

import { 
    IMSTblHead 
} from '../../../../models/MSTableModel'

import { 
    TableHead,
    TableRow,
    TableCell
} from '@mui/material'

import DragAndDropTableCell from './DragAndDropTableCell'

interface EnhancedTableHeadPropsType {
    headers: IMSTblHead[] // headers: IMSTblHead[]
    hoverHead: string | null // CURRENT HOVER HEAD
    showAction?: boolean // SHOULD SHOW ACTION COLUMN
    updtateHeaders: (hs:IMSTblHead[]) => void // UPDATE HEADERS CALLBACK
    setHoverHead: (value: string | null) => void // SET CURRENT HOVER HEAD CALLBACK
}

const TYPE_CARD = 'CARD' // TO IDENTIFY CURRENT DRAG / DROP TYPE

const EnhancedTableHead = ({ headers, hoverHead, updtateHeaders, setHoverHead, showAction=false }:EnhancedTableHeadPropsType) => {

    // COPY OF THE HEADS TO MODIFY
    const [ heads, setHeads ] = React.useState<IMSTblHead[]>(headers)

    // FIND HEADER BY KEY 
    const FindHeader = React.useCallback(
        (key: string) => {
            const head = heads.filter((h) => `${h.key}` === key)[0]

            return {
                head,
                index: heads.indexOf(head),
            }
        }, [heads],
    )

    // NO HOVER HEAD
    const ClearHoverHeader = () => setHoverHead(null)

    // MOVE HEADER TO NEW INDEX 
    const MoveHeader = React.useCallback(
        (key: string, atIndex: number) => {
            const { head, index } = FindHeader(key)

            setHeads(
                update(heads, {
                    $splice: [
                        [index, 1],
                        [atIndex, 0, head],
                    ],
            }))
        }, [FindHeader, heads, setHeads],
    )

    // SET HOVER HEADER
    const HoverHeader = (key: string) => {
        setHoverHead(key)

        // setHeads(update(heads, {
        //     [index]: {
        //         dropHover: {
        //             $set: true
        //         },
        //     }
        // }))

    }

    // ACTIVATE HEADER AND DEFINE DROP / DRAG KEY
    const [, drop] = useDrop(() => ({ accept: TYPE_CARD }))

    // UPDATE ORIGINAL HEADERS EVERY TIME HEADERS DOES
    React.useEffect(() => {
        updtateHeaders(heads)
    }, [heads])

    return (
        <TableHead>
            <TableRow ref={drop}>
                {heads.map((head, index) => (
                    <DragAndDropTableCell 
                        dragHover={hoverHead == head.key} 
                        hideLeftBorder={index == 0} 
                        key={head.key} 
                        head={head} 
                        findItem={FindHeader} 
                        moveItem={MoveHeader} 
                        hoverHeader={HoverHeader} 
                        clearHoverHeader={ClearHoverHeader} 
                    />
                ))}

                {/* CREATE A NEW COLUMN IF ACTIONS IS REQUIRED */}
                {showAction && (<TableCell></TableCell>)}
            </TableRow>
        </TableHead>
    )
}

export default EnhancedTableHead