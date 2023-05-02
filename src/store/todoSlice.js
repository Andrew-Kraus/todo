import { createSlice } from '@reduxjs/toolkit'

const todoSlice = createSlice({
  name: 'todo',
  initialState: {
    todoName: '',
    desc: '',
    endDate: '',
    priority: '',
  },
  reducers: {
    setTodoName: (state, action) => {
      state.todoName = action.payload
    },
    setDesc: (state, action) => {
        state.desc = action.payload
    },
    setEndDate: (state, action) => {
        state.endDate = action.payload
    },
    setPriority: (state, action) => {
        state.priority = action.payload
    },
}
})

export const {
setTodoName,
setDesc,
setEndDate,
setPriority,
} = todoSlice.actions

export default todoSlice.reducer