import React from 'react'

import { useSelector, useDispatch } from 'react-redux'

import { IMSTblCell } from '../models/MSTableModel'

import { ITestDataReducer, IData, actionUpdateSingleData, instanceOfIData } from '../reducers/testdataReducer'

import { RootState, AppDispatch } from '../store'

interface IKeyValue {
    key: string
    value: string
}

const useTestData = () => {
    const dispatch = useDispatch<AppDispatch>()

    const { data } = useSelector<RootState, ITestDataReducer>(state => state.testdata)
    
    // RENDER THE DATA TO THE TABLE
    const render = (data: IData):[IMSTblCell[], string] => [
        [
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
        ],
        `${data.id}`
    ]

    const convertToDataType = (data: any):IData | null => {
        if (instanceOfIData(data)) return data as IData


        return null
    } 

    const updateSingleData = (id: string, kvalue: IKeyValue) => dispatch(actionUpdateSingleData({ id, kvalue }))

    return {
        data,
        convertToDataType,
        renderDataOnTbl: render,
        updateSingleData
    }
}

export default useTestData