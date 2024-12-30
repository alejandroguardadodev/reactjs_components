import React from 'react'
import update from 'immutability-helper'
import { toast } from 'react-toastify'

import { styled } from '@mui/system'

import { 
    Container,
    Box
} from "@mui/material"

import MnTable from '../../components/MnTable'

import { ITableHeaderDataType } from '../../contexts/TableContextProvider'

import { IContextMenuItemType } from '../../components/MnContextMenu'

import { IKeyValue } from '../../interfaces'

import DeleteIcon from '@mui/icons-material/Delete'

import Swal from 'sweetalert2'

interface IData {
  id: number
  title: string
  descr: string
  date: string
}

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

const TABLESUBMENUITEM:IContextMenuItemType[] = [
  {
      id: 1,
      title: 'Delete Task',
      icon: <DeleteIcon />
  },
]

const Tablev2Page = () => {

  const [data, setData] = React.useState([
    {
        "id": 1,
        "title": "Project Report Completion",
        "date": "10/30/2023"
    },
    {
      "id": 2,
      "title": "Team Meeting Schedule",
      "descr": "Schedule team meeting",
      "date": "11/02/2023"
    },
    {
        "id": 3,
        "title": "Budget Proposal Review",
        "descr": "Review budget proposals",
        "date": "11/05/2023"
    },
    {
        "id": 4,
        "title": "Client Follow-Up Emails",
        "descr": "Send client follow-up emails",
        "date": "11/07/2023"
    },
    {
        "id": 5,
        "title": "Project Timeline Update",
        "descr": "Update project timeline",
        "date": "11/10/2023"
    },
    {
        "id": 6,
        "title": "User Testing Conduct",
        "descr": "Conduct user testing",
    },
    {
        "id": 7,
        "title": "Stakeholder Presentation Preparation",
    },
])

const headerData: ITableHeaderDataType[] = [
    {
        key: "title",
        label: "Title",
        minWidth: 300,
        maxWidth: 600,
        blockDnD: true,
        blockHide: true,
        input: {
            type: 'text',
            onSubmit(keyvalue, id) {
            setData((data) => update(data, {
                [data.findIndex((row) => `${row.id}` === id)]: {
                [keyvalue.key]: {
                    $set: keyvalue.value
                }
                }
            }))
            },
        }
    },
    {
        key: "descr",
        label: "Description",
        responsiveHide: 'md',
        minWidth: 300,
        maxWidth: 500,
    },
    {
        key: "date",
        label: "Due Date",
        responsiveHide: 'sm'
    }  
  ]

  const render = (data: IData):[IKeyValue[], string] => {
    return [Object.keys(data).map((key) => {
      return {
        key: key,
        value: `${data[key as keyof IData]}`,
      }
    }), `${data.id}`]
  }

  const onSubmitNewTitle = (value: string) => {
    setData((data) => update(data, {
      $push: [{ id: data.length + 1, title: value, descr: '', date: ''}]
    }))
  }

  const onSubmitRowSubMenuItem = (opt: number, data?: [IKeyValue[], string]) => {
    if (opt !== 1 || !data) return

    const [row, id] = data

    const title = row.find((keyvalue) => keyvalue.key === 'title')?.value || "N/A"

    Swal.fire({
      title: "Do you want to delete the following task?",
      text: title,
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: "Delete",
      denyButtonText: `Cancel`
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {

        setData((data) => update(data, {
          $splice: [[data.findIndex((r) => `${r.id}` === id),1]]
        }))

        toast.success('Task deleted successfully', {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
          
      } else if (result.isDenied) {
        Swal.fire("Changes are not saved", "", "info");
      }
    });    
  }

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
        <MnTable 
          header={headerData}
          defaultSort='title'
          blinkColor='#D9984A'
          dndDragColor="#fafafa"
          dndDragClass='DnDDragPreview'
          hoverBorderColor='black'
          allowdAddColumn={false}
          render={render}
          rows={data}
          newElementForm={{
            type: 'text',
            key: 'title',
            label: 'New Task...',
            onSubmit: onSubmitNewTitle,
          }}
          rowSubMenuItems={TABLESUBMENUITEM}
          onClickSubMenuRow={onSubmitRowSubMenuItem}
        />
      </TableContainer>
    </Container>
  )
}

export default Tablev2Page