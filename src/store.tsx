import { configureStore } from '@reduxjs/toolkit'

import testdataReducer from './reducers/testdataReducer'

const store = configureStore({
    reducer: {
        testdata: testdataReducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store