import { styled } from '@mui/system'

import { 
    Box,
    IconButton,
} from '@mui/material'

import StarBorderIcon from '@mui/icons-material/StarBorder'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'

import MSTable from '../../components/MSTable'

import { 
    IMSTblHead,
    IMSTblCell,
    IMSTableHeadInputType
} from '../../models/MSTableModel'

// MAIN STYLES FOR THE PAGE CONTAINER 
const Container = styled(Box)(() => ({
    width: '100%' , 
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
}))

// HOLD THE HEADERS FOR A TABLE. IT IS USED TO IDENTITY CERTAIN ASPECTS OF THE TABLE COLUMNS/CELLS
const TBL_HEADERS:IMSTblHead[] = [
    {
        key: 'title', // UNIQUE KEY FOR THE COLUMN [ IT IS USED TO IDENTIFY EVERY CELL ]
        label: 'Title', // LABEL FOR THE COLUMN
        // TO IDENTIFY THE USE OF AN INPUT FIELD IN THE CELL ------
        inputType: IMSTableHeadInputType.TEXT,
        onSubmit: (data:unknown) => {
            alert(`Data: ${data}`)
        } 
        // --------------------------------------------------------
    },
    {
        key: 'descr',
        label: 'Description',
        // IMPLEMENT A RESPONSIVE SYSTEM ON EVERY COLUMN ----------
        hideOnMobileDevice: true,
        hideOnTabletDevice: true,
        // --------------------------------------------------------
    },
    {
        key: 'date',
        label: 'Date',
        hideOnMobileDevice: true,
    }
]

// INTERFACE TO IDENTIFY THE TYPE OF DATA ACCEPTED BY THE TABLE
interface TBL_DATA {
    title: string,
    descr: string,
    date: string,
}

// HOLD THE DATA THAT WILL BE USED TO RENDER THE TABLE
const DATA:TBL_DATA[] = [
    {
        title: 'Test 1', // THEY KEY SHOULD BE THE SAME AS THE KEY IN THE TBL_HEADERS KEY PROPERTY
        descr: 'Aloha',
        date: '02/12/2023'
    },
    {
        title: 'WGU Design',
        descr: 'Go Back to School',
        date: '12/02/2021'
    }
] 

// RENDER THE DATA TO THE TABLE
const render = (data: TBL_DATA):IMSTblCell[] => [
    {
        key: 'title',
        value: data.title,
    },
    {
        key: 'descr',
        value: data.descr,
    },
    {
        key: 'date',
        value: data.date,
    }
]

// USED TO CREATE A SUB MENU FOR EVEY MENU ITEM
const SUBMENU_ITEMS = [
    {
        title: 'Start',
        icon: <StarBorderIcon />
    }
]

const HomePage = () => {
    return (
        <Container>
            <Box sx={{ width: '800px', height: '700px' }}>
                <MSTable 
                    headers={TBL_HEADERS} 
                    data={DATA} 
                    render={render} 
                    actionSection={(data: any) => {
                        const d = data as TBL_DATA

                        return <IconButton disableRipple onClick={() => { alert(d.title) }}><ArrowForwardIosIcon sx={{ fontSize: '.7rem' }} /></IconButton>
                    }}
                    submenuItems={SUBMENU_ITEMS}
                />
            </Box>
        </Container>
    )
}

export default HomePage