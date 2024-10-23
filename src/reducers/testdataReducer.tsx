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
            "id": 1,
            "title": "Project Report Completion",
            "descr": "Complete project report",
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
            "date": "11/12/2023"
        },
        {
            "id": 7,
            "title": "Stakeholder Presentation Preparation",
            "descr": "Prepare presentation for stakeholders",
            "date": "11/15/2023"
        },
        {
            "id": 8,
            "title": "Marketing Strategy Finalization",
            "descr": "Finalize marketing strategy",
            "date": "11/18/2023"
        },
        {
            "id": 9,
            "title": "Blog Post Content Drafting",
            "descr": "Draft content for blog post",
            "date": "11/20/2023"
        },
        {
            "id": 10,
            "title": "Team-Building Event Organization",
            "descr": "Organize team-building event",
            "date": "11/22/2023"
        },
        {
            "id": 11,
            "title": "Survey Results Analysis",
            "descr": "Analyze survey results",
            "date": "11/25/2023"
        },
        {
            "id": 12,
            "title": "End-of-Year Review Planning",
            "descr": "Plan end-of-year review",
            "date": "11/28/2023"
        },
        {
            "id": 13,
            "title": "Website Content Update",
            "descr": "Update website content",
            "date": "12/01/2023"
        },
        {
            "id": 14,
            "title": "Performance Review Conduct",
            "descr": "Conduct performance reviews",
            "date": "12/05/2023"
        },
        {
            "id": 15,
            "title": "New Product Launch",
            "descr": "Launch new product",
            "date": "12/10/2023"
        },
        {
            "id": 16,
            "title": "Team KPIs Review",
            "descr": "Review team KPIs",
            "date": "12/12/2023"
        },
        {
            "id": 17,
            "title": "Social Media Calendar Creation",
            "descr": "Create social media calendar",
            "date": "12/15/2023"
        },
        {
            "id": 18,
            "title": "Industry Conference Networking",
            "descr": "Network at industry conference",
            "date": "12/20/2023"
        },
        {
            "id": 19,
            "title": "Annual Performance Report Compilation",
            "descr": "Compile annual performance report",
            "date": "12/25/2023"
        },
        {
            "id": 20,
            "title": "Next Quarter Goals Setting",
            "descr": "Set goals for the next quarter",
            "date": "12/30/2023"
        }
    ],
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