import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getTasks, createTask, updateTask, deleteTask, getTaskStats } from '../services/api';

const initialState = {
  tasks: [],
  stats: { total: 0, completed: 0, pending: 0 },
  loading: false,
  error: null,
};

export const fetchTasksThunk = createAsyncThunk('tasks/fetch', async (params, thunkAPI) => {
  try {
    const res = await getTasks(params);
    return res;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

export const createTaskThunk = createAsyncThunk('tasks/create', async (data, thunkAPI) => {
  try {
    const res = await createTask(data, data.attachments || []);
    return res;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

export const updateTaskThunk = createAsyncThunk('tasks/update', async ({ id, data }, thunkAPI) => {
  try {
    const res = await updateTask(id, data, data.attachments || []);
    return res;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

export const deleteTaskThunk = createAsyncThunk('tasks/delete', async (id, thunkAPI) => {
  try {
    await deleteTask(id);
    return id;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

export const fetchStatsThunk = createAsyncThunk('tasks/stats', async (_, thunkAPI) => {
  try {
    const res = await getTaskStats();
    return res;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasksThunk.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchTasksThunk.fulfilled, (state, action) => { state.loading = false; state.tasks = action.payload; })
      .addCase(fetchTasksThunk.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(createTaskThunk.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(createTaskThunk.fulfilled, (state, action) => { state.loading = false; state.tasks.unshift(action.payload); })
      .addCase(createTaskThunk.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(updateTaskThunk.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(updateTaskThunk.fulfilled, (state, action) => { state.loading = false; state.tasks = state.tasks.map(t => t._id === action.payload._id ? action.payload : t); })
      .addCase(updateTaskThunk.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(deleteTaskThunk.fulfilled, (state, action) => { state.tasks = state.tasks.filter(t => t._id !== action.payload); })
      .addCase(fetchStatsThunk.fulfilled, (state, action) => { state.stats = action.payload; });
  },
});

export default taskSlice.reducer; 
 