import {
    TableContainer,
    Table,
} from "@mui/material"

import TableContextProvider, { TableContextPropsType } from "../../contexts/TableContextProvider"

import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import MnTableHeader from "./MnTableHeader"
import MnTableBody from "./MnTableBody"

interface MnTablePropsType extends TableContextPropsType {
    defaultSort?: string; // Explicitly typing the children prop
}

const MnTable = ({ defaultSort = "", ...props }: MnTablePropsType) => {

    // React.useEffect(() => {console.log(props.rows)}, [props.rows])

    return (
        <DndProvider backend={HTML5Backend}>
            <TableContextProvider key="" {...props} orderBy={defaultSort}>
                <TableContainer>
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
                        <MnTableHeader />
                        <MnTableBody />
                    </Table>
                </TableContainer>
            </TableContextProvider>
        </DndProvider>
    )
}

export default MnTable