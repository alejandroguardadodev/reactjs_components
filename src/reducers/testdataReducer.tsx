import { PayloadAction, createSlice } from '@reduxjs/toolkit'

interface IKeyValue {
    key: string
    value: string
}

// INTERFACE TO IDENTIFY THE TYPE OF DATA ACCEPTED BY THE TABLE
export interface IData {
    id: number,
    title: string,
    descr: string,
    date: string,
}

export interface ITestDataReducer {
    data: IData[];
}

export interface PayloadActionUpdateSingleDataType {
    id: string,
    kvalue: IKeyValue
}

export function instanceOfIData(object: any): object is IData {
    return 'title' in object && 'descr' in object && 'date' in object && 'id' in object;
}


const initialStates:ITestDataReducer = {
    // HOLD THE DATA THAT WILL BE USED TO RENDER THE TABLE
    data: [
        {
            id: 0,
            title: 'Test 1',
            descr: 'Aloha',
            date: '02/12/2023'
        },
        {
            id: 1,
            title: 'WGU Design',
            descr: 'Go Back to School',
            date: '12/02/2021'
        }
    ] ,
}

const TestDataSlice = createSlice({
    name: 'page',
    initialState: initialStates,
    reducers: {
        actionUpdateSingleData(state, action:PayloadAction<PayloadActionUpdateSingleDataType>) {

            const { id, kvalue } = action.payload

            return {
                ...state,
                data: state.data.map((d) => {
                    if (d.id === parseInt(id)) {
                        return {
                            ...d,
                            [kvalue.key]: kvalue.value
                        }
                    } else 
                        return d
                })
            }
        }
    }
})

export const { actionUpdateSingleData } = TestDataSlice.actions

export default TestDataSlice.reducer