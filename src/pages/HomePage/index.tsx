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
    IMSTableHeadInputType
} from '../../models/MSTableModel'

import useTestData from '../../hooks/useTestData'

interface IKeyValue {
    key: string
    value: string
}

// MAIN STYLES FOR THE PAGE CONTAINER 
const Container = styled(Box)(() => ({
    width: '100%' , 
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
}))

// USED TO CREATE A SUB MENU FOR EVEY MENU ITEM
const SUBMENU_ITEMS = [
    {
        title: 'Start',
        icon: <StarBorderIcon />
    }
]

const HomePage = () => {

    // GET THE TEST DATA FROM THE HOOK AND THE FUNCTION TO RENDER THE DATA ON THE TABLE
    const { data, renderDataOnTbl, updateSingleData, convertToDataType } = useTestData()

    // HOLD THE HEADERS FOR A TABLE. IT IS USED TO IDENTITY CERTAIN ASPECTS OF THE TABLE COLUMNS/CELLS
    const TBL_HEADERS:IMSTblHead[] = [
        {
            key: 'title', // UNIQUE KEY FOR THE COLUMN [ IT IS USED TO IDENTIFY EVERY CELL ]
            label: 'Title', // LABEL FOR THE COLUMN
            // TO IDENTIFY THE USE OF AN INPUT FIELD IN THE CELL ------
            inputType: IMSTableHeadInputType.TEXT,
            onSubmit: (data:IKeyValue, id?:string) => {
                if (id) updateSingleData(id, data)
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

    return (
        <Container>
            <Box sx={{ width: '800px', height: '700px' }}>
                <MSTable 
                    headers={TBL_HEADERS} 
                    data={data} 
                    render={renderDataOnTbl} 
                    actionSection={(data: any) => {
                        const d = convertToDataType(data)

                        if (d) return <IconButton disableRipple onClick={() => { alert(`id: ${d.id}; title: ${d.title}`) }}><ArrowForwardIosIcon sx={{ fontSize: '.7rem' }} /></IconButton>
                    }}
                    submenuItems={SUBMENU_ITEMS}
                />
            </Box>
        </Container>
    )
}

export default HomePage