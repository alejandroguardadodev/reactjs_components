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

import useResponsive from '../../../../hooks/useResponsive'

import DragAndDropTableCell from './DragAndDropTableCell'

interface EnhancedTableHeadPropsType {
    headers: IMSTblHead[]
    hoverHead: string | null
    showAction?: boolean
    updtateHeaders: (hs:IMSTblHead[]) => void
    setHoverHead: (value: string | null) => void
}

const TYPE_CARD = 'CARD'

const EnhancedTableHead = ({ headers, hoverHead, updtateHeaders, setHoverHead, showAction=false }:EnhancedTableHeadPropsType) => {

    const [ heads, setHeads ] = React.useState<IMSTblHead[]>(headers)

    const FindHeader = React.useCallback(
        (key: string) => {
            const head = heads.filter((h) => `${h.key}` === key)[0]

            return {
                head,
                index: heads.indexOf(head),
            }
        }, [heads],
    )

    const ClearHoverHeader = () => setHoverHead(null)

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

    const [, drop] = useDrop(() => ({ accept: TYPE_CARD }))

    React.useEffect(() => {
        updtateHeaders(heads)
    }, [heads])

    return (
        <TableHead>
            <TableRow ref={drop}>
                {heads.map((head, index) => (<DragAndDropTableCell dragHover={hoverHead == head.key} hideLeftBorder={index == 0} key={head.key} head={head} findItem={FindHeader} moveItem={MoveHeader} hoverHeader={HoverHeader} clearHoverHeader={ClearHoverHeader} />))}
                <TableCell></TableCell>
            </TableRow>
        </TableHead>
    )
}

export default EnhancedTableHead