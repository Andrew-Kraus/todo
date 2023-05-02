import { createSlice } from '@reduxjs/toolkit'

const modalsSlice = createSlice({
    name: 'todoEdit',
    initialState: {
        modalCreate: false,
        modalTask: false,
        modalEdit: false,
    },
    reducers: {
        setModalCreate: (state, action) => {
            state.modalCreate = action.payload
        },
        setModalTask: (state, action) => {
            state.modalTask = action.payload
        },
        setModalEdit: (state, action) => {
            state.modalEdit = action.payload
        },
    }
})

export const {
    setModalCreate,
    setModalTask,
    setModalEdit,
} = modalsSlice.actions

export default modalsSlice.reducer