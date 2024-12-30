import React from 'react'

import { styled } from '@mui/system'

import { useResizeDetector } from 'react-resize-detector'
import { TableContext } from '../../../../contexts/TableContextProvider'

import MnTableBodyCellForm from '../MnTableBodyCellForm'

import {
    Box,
    TableRow,
    TableCell,
    Button 
} from "@mui/material"

import AddIcon from '@mui/icons-material/Add'

const NewActionButton = styled(Button)(() => ({
    padding: 0,
    paddingLeft: '0.5rem',
    background: 'transparent !important',
    textTransform: 'capitalize',
    color: 'rgba(0,0,0,.8)',
    '& svg': {
        fontSize: '1.1rem',
        color: 'black'
    },
}))

interface MnTableBodyAddRowPropsType {
    colSpan: number
    label: string
    //inputType: 'text' | 'date'
    onSubmit: (value: string) => void
}

const MnTableBodyAddRow = ({colSpan, label, onSubmit}: MnTableBodyAddRowPropsType) => {

    const { ref: tableCellRef, width: tableCellWidth } = useResizeDetector()

    const [showInput, setShowInput] = React.useState(false)

    const tableContext = React.useContext(TableContext)

    const inputCellWidth = React.useMemo(() => ( (tableCellWidth || 100) - 10 ), [tableCellWidth])

    const actionHandleOutsideClick = (e:MouseEvent) => {
        if (!showInput) return // IF THERE IS NOT ANY CELL AS FIELD, DO NOTHING
        
        if (tableCellRef.current && !tableCellRef.current.contains(e.target as Node)) setShowInput(false)
    }

    React.useEffect(() => { // ADD EVENT LISTENER TO HANDLE OUTSIDE CLICKS
        document.addEventListener("mousedown", actionHandleOutsideClick);
        return () => {
          document.removeEventListener("mousedown", actionHandleOutsideClick);
        };
    })


    return (
        <TableRow>
            <TableCell 
                ref={tableCellRef}
                colSpan={colSpan} 
                className='allow-border-hover'
                sx={{
                    position: 'relative',
                    '&::before': {
                        borderColor: `${tableContext.hoverBorderColor || tableContext.blinkColor} !Important`,
                    }
                }}
            >
                <Box sx={{ padding: 0, position: 'relative' }}>
                    {showInput && (
                        <MnTableBodyCellForm 
                            defaultValue="" 
                            //type={inputType}
                            width={inputCellWidth || 100} 
                            onClose={() => { setShowInput(false) }}
                            onSubmit={(v: string) => { onSubmit(v) }}
                        />
                    )}

                    <NewActionButton 
                        disableRipple
                        startIcon={<AddIcon />}
                        disabled={showInput}
                        onClick={() => setShowInput(true)}
                        sx={{
                            ...(showInput && {
                                opacity: 0   
                            })
                        }}
                    >
                        {label}
                    </NewActionButton>
                </Box>
            </TableCell>
        </TableRow>
    )
}

export default MnTableBodyAddRow