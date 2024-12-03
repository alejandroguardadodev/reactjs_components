import React from 'react'

import { useResizeDetector } from 'react-resize-detector'

import {
    TableContainer,
    Table,
    Box
} from "@mui/material"

import MTableHeader from './MTableHeader'

// Import the MTableContextProvider and the MTableContextPropsType interface from the context provider
import MTableContextProvider, { MTableContextPropsType } from "../contexts/MTableContextProvider"

interface MTablePropsType extends MTableContextPropsType {
    defaultSort?: string; // Explicitly typing the children prop
}

// Define the MTable component which receives props of type MTableContextPropsType
const MTable = ({ defaultSort = "", ...props }: MTablePropsType) => {

    const { ref: tableBoxRef, width: tableBoxWidth, height: tableBoxHeight } = useResizeDetector() 

    const minHeight = props.minHeight || null
    const maxHeight = props.maxHeight || null

    return (
        // Wrapping the MTable component inside MTableContextProvider to provide context to its children
        // The spread operator passes the props to the context provider
        <MTableContextProvider {...props} orderBy={defaultSort}>
            {/* <Box 
                
                sx={{ 
                    // height: '100%',
                    ...(minHeight && { minHeight }),
                    ...(maxHeight && { maxHeight })
                }}
            > */}
                <TableContainer ref={tableBoxRef} >
                    <Table
                        stickyHeader
                        sx={{
                            width: 'fit-content',
                            minWidth: '100px',
                            borderCollapse: 'collapse',
                            borderSpacing: '0px',
                            tableLayout: 'fixed'
                        }}
                    >
                        <MTableHeader />
                    </Table>
                </TableContainer>
            {/* </Box> */}
        </MTableContextProvider>
    )
}

// Export the MTable component as the default export
export default MTable
