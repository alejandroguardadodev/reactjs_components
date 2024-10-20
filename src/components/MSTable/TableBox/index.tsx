import React from "react"

import { 
    IMSTblHead,
    IMSTblCell
} from "../../../models/MSTableModel"

import { 
    TableContainer,
    Table,
    TableBody
} from "@mui/material"

import MSRow from "./EnhancedTableHead/MSRow"
import EnhancedTableHead from "./EnhancedTableHead"

import useResponsive from "../../../hooks/useResponsive"

interface TableBoxPropsType {
    rowHeight: number;
    headers: IMSTblHead[];
    data: any[],
    render: (row:any) => IMSTblCell[]
    containerWidth?: number;
    containerHeight?: number;
}

const TableBox = ({ headers, data, render, containerWidth=0, containerHeight=0, rowHeight }:TableBoxPropsType) => {

    const { isDesktop, isTablet, isMobile } = useResponsive()

    const [ heads, setHeads ] = React.useState<IMSTblHead[]>(headers)
    const [ hoverHead, setHoverHead ] = React.useState<string | null>(null)

    // GET THE CURRENT SIZE OF THE TABLE CONTAINER
    const width = React.useMemo(() => Math.floor(containerWidth), [containerWidth])
    const height = React.useMemo(() => Math.floor(containerHeight), [containerHeight])

    // GET ROW INFO
    const numberOfRows = React.useMemo(() => Math.floor(height / rowHeight), [height, rowHeight])

    const updtateHeaders = (hs:IMSTblHead[]) => setHeads(hs)

    const ShowColumn = React.useCallback((header:IMSTblHead) => {
        console.log(header.key, '|', isMobile)
        if (isMobile && header.hideOnMobileDevice) return false
        else if (isTablet && header.hideOnTabletDevice) return false
        else if (isDesktop && header.hideOnDesktopDevice) return false
        
        return true
    }, [isDesktop, isTablet, isMobile])

    const displayedHeads = React.useMemo(() => heads.filter((h) => ShowColumn(h)), [ShowColumn, heads])

    const orderCellsByHeader = (cells:IMSTblCell[]) => (
        displayedHeads.map((h) => {
            const c = cells.find(c => c.key == h.key)

            if (c) return c
        })
    )

    const defineHoverHeader = (value: string | null) => setHoverHead(value)

    return (
        <TableContainer>
            <Table
                size="medium"
                stickyHeader
            >
                <EnhancedTableHead headers={displayedHeads} hoverHead={hoverHead} updtateHeaders={updtateHeaders} setHoverHead={defineHoverHeader} />
                <TableBody>
                    {data && data.map((row, index) => {
                        const _row = orderCellsByHeader(render(row))

                        return <MSRow
                            key={`row-${index}`} 
                            data={_row}
                            hoverHead={hoverHead}
                        />
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default TableBox