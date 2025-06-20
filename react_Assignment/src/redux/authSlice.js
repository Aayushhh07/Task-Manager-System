import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { registerUser, loginUser, getCurrentUser, getAllUsers } from '../services/api';

const token = localStorage.getItem('token');
const userFromStorage = localStorage.getItem('user');

const initialState = {
  user: userFromStorage ? JSON.parse(userFromStorage) : null,
  token: token || null,
  users: [],
  loading: false,
  error: null,
};

export const registerUserThunk = createAsyncThunk('auth/register', async (data, thunkAPI) => {
  try {
    const res = await registerUser(data);
    localStorage.setItem('token', res.token);
    localStorage.setItem('user', JSON.stringify(res));
    return res;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

export const loginUserThunk = createAsyncThunk('auth/login', async (data, thunkAPI) => {
  try {
    const res = await loginUser(data);
    localStorage.setItem('token', res.token);
    localStorage.setItem('user', JSON.stringify(res));
    return res;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

export const getMeThunk = createAsyncThunk('auth/getMe', async (_, thunkAPI) => {
  try {
    const res = await getCurrentUser();
    localStorage.setItem('user', JSON.stringify(res));
    return res;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

export const fetchUsersThunk = createAsyncThunk('auth/fetchUsers', async (_, thunkAPI) => {
  try {
    const res = await getAllUsers();
    return res;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUserThunk.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(registerUserThunk.fulfilled, (state, action) => { state.loading = false; state.user = action.payload; state.token = action.payload.token; })
      .addCase(registerUserThunk.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(loginUserThunk.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(loginUserThunk.fulfilled, (state, action) => { state.loading = false; state.user = action.payload; state.token = action.payload.token; })
      .addCase(loginUserThunk.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(getMeThunk.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(getMeThunk.fulfilled, (state, action) => { state.loading = false; state.user = action.payload; })
      .addCase(getMeThunk.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchUsersThunk.fulfilled, (state, action) => { state.users = action.payload; });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer; 