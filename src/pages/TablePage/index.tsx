import { styled } from '@mui/system'

import { 
    Container,
    Box
} from "@mui/material"

import MTable from "../../components/gui/MTable"
import { MTblHeaderDataType } from '../../components/gui/contexts/MTableContextProvider'

const TableContainer = styled(Box)(() => ({
  padding: '5px',
  background: 'white',
  borderRadius: '5px',
  width: '100%',
  maxWidth: '1000px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  border: '1px solid #707173',
  boxShadow: '0px 0px 16px -5px rgba(0,0,0,0.75)',
}))

const TablePage = () => {

  const headerData: MTblHeaderDataType[] = [
    {
      key: "title",
      label: "Title",
      blockDnD: true,
    },
    {
      key: "descr",
      label: "Description",
    },
    {
      key: "date",
      label: "Data",
    }  
  ]

  return (
    <Container
        sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            paddingTop: "20px"
        }}
    >
      <TableContainer>
        <MTable 
          header={headerData}
          defaultSort='title'
        />
      </TableContainer>
    </Container>
  )
}

export default TablePage