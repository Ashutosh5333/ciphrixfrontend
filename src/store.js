import { configureStore } from '@reduxjs/toolkit';
import taskReducer from './features/tasks/taskSlice';
import authReducer from "./features/auth/authSlice"
import uiReducer from "./features/ui/uiSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tasks: taskReducer,
    ui: uiReducer,  
  },
});
