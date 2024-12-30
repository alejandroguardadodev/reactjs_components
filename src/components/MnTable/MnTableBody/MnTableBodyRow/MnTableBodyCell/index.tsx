import React from 'react'

import { useResizeDetector } from 'react-resize-detector'

import { styled } from '@mui/system'

import { 
    Stack,
    Box,
    TableCell,
    IconButton,
    Checkbox 
} from '@mui/material'

import ReadMoreIcon from '@mui/icons-material/ReadMore'

import { TableContext, ITableHeaderDataType } from '../../../../../contexts/TableContextProvider'

import MnTableBodyCellForm from '../../MnTableBodyCellForm'

const DivCellValue = styled('div', {
    shouldForwardProp: (prop) => prop !== 'cellWidth' && prop !== 'hide',
})<{ cellWidth?: number | undefined, hide?: boolean }>(({ cellWidth, hide }) => ({
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    ...(cellWidth && {
        width: `${cellWidth}px`,
        maxWidth: `${cellWidth}px`,
    }),
    ...(hide && {
        opacity: 0,
    })
}))

interface MnTableBodyCellPropsType {
    id: string
    head: ITableHeaderDataType
    value: string
    first?: boolean
}

const MnTableBodyCell = ({ id, head, value, first }:MnTableBodyCellPropsType) => {

    const cellRef = React.useRef<HTMLTableCellElement>(null)

    const [showInput, setShowInput] = React.useState(false)
    const [isThereAnyError, setIsThereAnyError] = React.useState(false)

    const tableContext = React.useContext(TableContext)

    const { ref: containerValueRef, width: containerValueWidth } = useResizeDetector()

    const CellContainerWidth = React.useMemo(() => ( (head.width || 100) - 10 ), [head.width])
    const IsInputCell = React.useMemo<boolean>(() => Boolean(head.input), [head.input])

    const actionHandleOutsideClick = (e:MouseEvent) => {
        if (!showInput) return // IF THERE IS NOT ANY CELL AS FIELD, DO NOTHING
        
        if (cellRef.current && !cellRef.current.contains(e.target as Node)) {
            setShowInput(false)
            setIsThereAnyError(false)
        }
    }

    React.useEffect(() => { // ADD EVENT LISTENER TO HANDLE OUTSIDE CLICKS
        document.addEventListener("mousedown", actionHandleOutsideClick);
        return () => {
          document.removeEventListener("mousedown", actionHandleOutsideClick);
        };
    })

    return (
        <TableCell 
            ref={cellRef}
            className='allow-border-hover'
            sx={{ 
                ...(head.width && {
                    width: `${head.width}px`
                }),
                '&::before': {
                    borderColor: `${tableContext.hoverBorderColor || tableContext.blinkColor} !Important`,
                    ...(isThereAnyError && {
                        borderColor: '#cc0000 !important',
                    })
                }
            }}
        >
            <Stack direction="row" alignItems="center" sx={{ width: `${CellContainerWidth}px` }}>

                {first && (
                    <Checkbox disableRipple size="small" sx={{ padding: 0, paddingRight: '5px' }} />
                )}

                <Box 
                    ref={containerValueRef} 
                    sx={{ 
                        flexGrow: 1, 
                        overflow: 'hidden',
                        position: 'relative',
                    }}
                    onDoubleClick={() => {
                        if (!IsInputCell) return
        
                        setShowInput(true)
                    }}
                >
                    {showInput && (
                        <MnTableBodyCellForm 
                            defaultValue={value} 
                            //type={head.input?.type || 'text'}
                            width={containerValueWidth || 100} 
                            onClose={() => { setShowInput(false); setIsThereAnyError(false); }}
                            onSubmit={(v: string) => { head.input?.onSubmit?.({ key: head.key, value: v }, id) }}
                            onErrorInput={(isErr) => { setIsThereAnyError(isErr) }}
                        />
                    )}

                    <DivCellValue cellWidth={containerValueWidth} hide={showInput}>{value}</DivCellValue>
                </Box>

                {first && (
                    <IconButton disableRipple className='MnRow-Button row-item-hover'>
                        <ReadMoreIcon />
                    </IconButton>
                )}
            </Stack>
        </TableCell>
    )
}

export default MnTableBodyCell