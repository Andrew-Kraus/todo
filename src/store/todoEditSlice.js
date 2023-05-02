import { createSlice } from '@reduxjs/toolkit'

const todoEditSlice = createSlice({
  name: 'todoEdit',
  initialState: {
    editTodoName: '',
    editDesc: '',
    editEndDate: '',
    editPriority: '',
  },
  reducers: {
    setEditTodoName: (state, action) => {
      state.editTodoName = action.payload
    },
    setEditDesc: (state, action) => {
      state.editDesc = action.payload
    },
    setEditEndDate: (state, action) => {
      state.editEndDate = action.payload
    },
    setEditPriority: (state, action) => {
      state.editPriority = action.payload
    },
  }
})

export const {
  setEditTodoName,
  setEditDesc,
  setEditEndDate,
  setEditPriority,
} = todoEditSlice.actions

export default todoEditSlice.reducer