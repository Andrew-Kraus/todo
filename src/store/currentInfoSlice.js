import { createSlice } from '@reduxjs/toolkit'

const currentInfoSlice = createSlice({
    name: 'task',
    initialState: {
        currentSubtasks: [],
        currentFiles: [],
        currentData: [],
        currentTask: null,
        currentBoard: null,
        currentProject: '',
    },
    reducers: {
        setCurrentSubtasks: (state, action) => {
            state.currentSubtasks = action.payload
        },
        setCurrentFiles: (state, action) => {
            state.currentFiles = action.payload
        },
        setCurrentData: (state, action) => {
            state.currentData = action.payload
        },
        setCurrentTask: (state, action) => {
            state.currentTask = action.payload
        },
        setCurrentBoard: (state, action) => {
            state.currentBoard = action.payload
        },
        setCurrentProject: (state, action) => {
            state.currentProject = action.payload
        },
    }
})

export const {
    setCurrentSubtasks,
    setCurrentFiles,
    setCurrentData,
    setCurrentTask,
    setCurrentBoard,
    setCurrentProject,
} = currentInfoSlice.actions

export default currentInfoSlice.reducer