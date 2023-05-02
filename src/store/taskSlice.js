import { createSlice } from '@reduxjs/toolkit'

const taskSlice = createSlice({
  name: 'task',
  initialState: {
    uploadedFile: null,
    comments: [],
    subtaskInput: '',
    searchInput: '',
  },
  reducers: {
    setUploadedFile: (state, action) => {
      state.uploadedFile = action.payload
    },
    setComments: (state, action) => {
      state.comments = action.payload
    },
    setSubtaskInput: (state, action) => {
      state.subtaskInput = action.payload
    },
    setSearchInput: (state, action) => {
      state.searchInput = action.payload
    },
  }
})

export const {
  setUploadedFile,
  setComments,
  setSubtaskInput,
  setSearchInput,
} = taskSlice.actions

export default taskSlice.reducer