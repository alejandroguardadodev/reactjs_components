import { styled } from '@mui/system'

import Box from '@mui/material/Box'

import MSTable from '../../components/MSTable'

import { 
    IMSTblHead,
    IMSTblCell
} from '../../models/MSTableModel'

const TBL_HEADERS:IMSTblHead[] = [
    {
        key: 'title',
        label: 'Title'
    },
    {
        key: 'descr',
        label: 'Description',
        hideOnMobileDevice: true,
        hideOnTabletDevice: true,
    },
    {
        key: 'date',
        label: 'Date',
        hideOnMobileDevice: true,
    }
]

interface TBL_DATA {
    title: string,
    descr: string,
    date: string,
}

const DATA:TBL_DATA[] = [
    {
        title: 'Test 1',
        descr: 'Aloha',
        date: '02/12/2023'
    },
    {
        title: 'WGU Design',
        descr: 'Go Back to School',
        date: '12/02/2021'
    }
] 

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

const Container = styled(Box)(() => ({
    width: '100%' , 
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
}))

const HomePage = () => {
    return (
        <Container>
            <Box sx={{ width: '800px', height: '700px' }}>
                <MSTable headers={TBL_HEADERS} data={DATA} render={render} />
            </Box>
        </Container>
    )
}

export default HomePage