import React from 'react'

import useResponsive from '../../../hooks/useResponsive'

import { TableContext, INewElementInputFormType } from '../../../contexts/TableContextProvider'

import {
    TableBody,
} from "@mui/material"

import MnTableBodyRow, { ICellDataType } from "./MnTableBodyRow"
import MnTableBodyAddRow from './MnTableBodyAddRow'

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    if ((b[orderBy] || "") < (a[orderBy] || "")) return -1;
    if ((b[orderBy] || "") > (a[orderBy] || "")) return 1;
    
    return 0;
}

function getComparator<Key extends keyof any>(order: "asc" | "desc", orderBy: Key): ( a: { [key in Key]: number | string }, b: { [key in Key]: number | string } ) => number {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
}

const MnTableBody = () => {

    const { checkDownBreakpoint, screenSize } = useResponsive()

    const tableContext = React.useContext(TableContext)

    const visibleColumns = React.useMemo(() => tableContext.header.filter((h) => (!h.responsiveHide || !checkDownBreakpoint(h.responsiveHide)) && !h.hide), [tableContext.header, screenSize])

    const newElementInput =  React.useMemo<INewElementInputFormType | undefined>(() => tableContext.newElementForm, [tableContext.newElementForm])

    const VisibleRows = React.useMemo(
        () => {
            return [...tableContext.rows].sort(getComparator(tableContext.order || "asc", tableContext.orderBy || ""))

        }, [tableContext.rows, tableContext.order, tableContext.orderBy],
    )

    return (
        <TableBody>
            {newElementInput && (<MnTableBodyAddRow 
                label={newElementInput.label} 
                onSubmit={newElementInput.onSubmit} 
                //inputType={newElementInput.type} 
                colSpan={visibleColumns.length} />)}

            {VisibleRows.map((r, index) => {

                const [row, id] = tableContext.render(r)

                const cells:ICellDataType[] = visibleColumns.map((head) => {
                    const label = (row.find(cell => cell.key === head.key) || { key: "", value: "" }).value

                    return {
                        head: head,
                        label: label,
                    }
                })
                
                return (<MnTableBodyRow id={id} cells={cells} key={index} subMenuDataPackage={[row, id]} />)
            })}
        </TableBody>
    )
}

export default MnTableBody