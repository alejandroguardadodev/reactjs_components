import React from 'react'

import { TableContext, ITableHeaderDataType } from '../../../../contexts/TableContextProvider'

import {
    TableRow,
    TableCell,
    Skeleton
} from '@mui/material'

import MnTableBodyCell from './MnTableBodyCell'

import MnContextMenu, { IContextMenuItemType, IAxisType } from '../../../MnContextMenu'
import { IKeyValue } from '../../../../interfaces'

export interface ICellDataType {
    head: ITableHeaderDataType
    label: string
}

interface MnTableBodyRowPropsType {
    id: string
    cells: ICellDataType[]
    subMenuDataPackage: [IKeyValue[], string]
}

const MnTableBodyRow = ({ id, cells, subMenuDataPackage }:MnTableBodyRowPropsType) => {

    const tableContext = React.useContext(TableContext)

    const [mousePosition, setMousePosition] = React.useState<null | IAxisType>(null)
    const [subMenuItems] = React.useState<IContextMenuItemType[] | undefined>(tableContext.rowSubMenuItems)

    const useMenu = React.useMemo(() => Boolean(subMenuItems), [subMenuItems])
    const openSubMenu = React.useMemo(() => Boolean(mousePosition), [mousePosition])

    return (
        <>
            <TableRow
                hover
                sx={{ cursor: 'pointer' }}
                className='table-row-bottom-border'
                onContextMenu={(event) => {
                    if (!useMenu) return; // CHECK IF THE SUB MENU IS ENABLED

                    event.preventDefault() 
                    
                    if (!openSubMenu) { // SAVE THE MOUSE POSITION IF THE SUB MENU IS NOT OPEN
                        setMousePosition({
                            x: event.clientX,
                            y: event.clientY,
                        })
                    }
                }} 
            >
                {cells.map((cell, index) => tableContext.loading?
                    (
                        <TableCell key={`col-${cell.head.key}-${index}`} className='allow-border-hover' sx={{'&::before': { borderColor: `${tableContext.hoverBorderColor || tableContext.blinkColor} !Important`}}}><Skeleton animation="wave" /></TableCell>
                    ):(
                        <MnTableBodyCell 
                            key={`col-${cell.head.key}-${index}`} 
                            id={id}  
                            head={cell.head}
                            value={cell.label}
                            first={index === 0} />
                    )
                )}
            </TableRow>

            {mousePosition && useMenu && (
                <MnContextMenu 
                    open={!!mousePosition} 
                    items={subMenuItems || []} 
                    position={mousePosition} 
                    onClose={() => setMousePosition(null)} 
                    onClick={(item) => { tableContext.onClickSubMenuRow?.(item.id || -1, subMenuDataPackage) }} 
                />
            )}
        </>
    )
}

export default MnTableBodyRow