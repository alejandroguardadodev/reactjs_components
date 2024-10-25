import React from 'react'

import { styled } from '@mui/system'

import { 
    IMSTblKeyInputType 
} from '../../../../../models/MSTableModel'

import MSCellFormValue from './MSCellFormValue'

import TableContext from '../../../../../contexts/TableContext'

const DivCell = styled('div', {
    shouldForwardProp: (prop) => prop !== 'cellWidth',
})<{ cellWidth?: number | undefined }>(({ cellWidth }) => ({
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    ...(cellWidth && {
        width: `${cellWidth}px`,
        maxWidth: `${cellWidth}px`,
    })
}))

interface MSCellValuePropsType {
    cellKey: string
    value: string
    showInputCell: boolean
    inputCell: null | IMSTblKeyInputType
    inputCellWidth?: number
    containerXLimit?: number
    cellXpos?: number
    rowId?: string,
    onClose?: () => void
}

const MSCellValue = ({ cellKey, value, showInputCell, inputCell, onClose, inputCellWidth=0, containerXLimit=0, cellXpos=0, rowId="" }:MSCellValuePropsType) => {

    const tableContext = React.useContext(TableContext)

    const useCellAsInput = React.useMemo(() => Boolean(inputCell), [inputCell])

    const cellWidth = React.useMemo<number | undefined>(() => {
        if (tableContext?.heads) {
            const head = tableContext.heads.find((head) => head.key === cellKey)
            
            if (head) return head.size
        }

        return undefined
    }, [tableContext?.heads])
    
    if (showInputCell && useCellAsInput) return (<>
        <MSCellFormValue 
            id={inputCell?.key || ""}
            rowId={rowId}
            defaultValue={value} 
            type={inputCell?.inputType || 'text'} 
            width={Math.max(150, inputCellWidth)}
            cellXpos={cellXpos}
            containerXLimit={containerXLimit}
            onSubmit={inputCell?.onSubmit}
            onClose={onClose}
        />
        <DivCell cellWidth={cellWidth} >{value}</DivCell>
    </>)

    return <DivCell cellWidth={cellWidth} >{value}</DivCell>
}

export default MSCellValue