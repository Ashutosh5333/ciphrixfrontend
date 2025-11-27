import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../api/axios";

export const fetchTasks = createAsyncThunk(
  "tasks/fetchTasks",
  async ({ page = 1, limit = 6 } = {}, { rejectWithValue }) => {
    try {
      const res = await axios.get("/tasks", { params: { page, limit } });

      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch tasks"
      );
    }
  }
);

// Get single task
export const fetchTaskById = createAsyncThunk(
  "tasks/fetchTaskById",
  async (editTaskId, { rejectWithValue }) => {
    try {
      const res = await axios.get(`/tasks/${editTaskId}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch task"
      );
    }
  }
);

// Create
export const createTask = createAsyncThunk(
  "tasks/createTask",
  async (body, { rejectWithValue }) => {
    try {
      const res = await axios.post("/tasks", body);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Create failed");
    }
  }
);

// Update
export const updateTask = createAsyncThunk(
  "tasks/updateTask",
  async ({ editTaskId, ...body }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`/tasks/${editTaskId}`, body);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Update failed");
    }
  }
);

// Delete
export const deleteTask = createAsyncThunk(
  "tasks/deleteTask",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`/tasks/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Delete failed");
    }
  }
);

const initialState = {
  list: [],
  pagination: null,
  currentTask: null,
  loading: false,
  error: null,
};

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    clearCurrentTask(state) {
      state.currentTask = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.tasks || [];
        state.pagination = action.payload.pagination || null;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchTaskById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTaskById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTask = action.payload;
      })
      .addCase(fetchTaskById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createTask.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.list = state.list.map((t) =>
          t._id === action.payload._id ? action.payload : t
        );
        if (state.currentTask && state.currentTask._id === action.payload._id)
          state.currentTask = action.payload;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.list = state.list.filter((t) => t._id !== action.payload);
      });
  },
});

export const { clearCurrentTask } = taskSlice.actions;
export default taskSlice.reducer;
