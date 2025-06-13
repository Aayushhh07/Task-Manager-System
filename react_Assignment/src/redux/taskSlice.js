import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../services/api';

const initialState = {
  tasks: [],
  task: null,
  loading: false,
  error: null,
};

// Fetch all tasks
export const fetchTasks = createAsyncThunk(
  'tasks/fetchAll',
  async (_, thunkAPI) => {
    try {
      const res = await API.get('/tasks');
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to fetch tasks');
    }
  }
);

// Fetch single task
export const fetchTaskById = createAsyncThunk(
  'tasks/fetchById',
  async (id, thunkAPI) => {
    try {
      const res = await API.get(`/tasks/${id}`);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data.message);
    }
  }
);

// Create task
export const createTask = createAsyncThunk(
  'tasks/create',
  async (formData, thunkAPI) => {
    try {
      const res = await API.post('/tasks', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to create task');
    }
  }
);

// Delete task
export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (taskId, thunkAPI) => {
    try {
      await API.delete(`/tasks/${taskId}`);
      return taskId;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Delete failed');
    }
  }
);

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Tasks
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
        state.error = null;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Task
      .addCase(createTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks.unshift(action.payload); // Add new task at the beginning
        state.error = null;
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Task
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter(task => task._id !== action.payload);
        state.error = null;
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearError } = taskSlice.actions;
export default taskSlice.reducer;
// ✅ No export block at the bottom — everything is already exported above
