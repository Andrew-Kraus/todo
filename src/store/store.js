import { configureStore } from '@reduxjs/toolkit';
import todoSlice from './todoSlice';
import todoEditSlice from './todoEditSlice';
import taskSlice from './taskSlice';
import modalsSlice from './modalsSlice';
import currentInfoSlice from './currentInfoSlice';

const store = configureStore({
    reducer: {
        todo: todoSlice,
        todoEdit: todoEditSlice,
        task: taskSlice,
        modals: modalsSlice,
        info: currentInfoSlice,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false,
    }),
});

export default store;
