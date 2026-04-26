/* eslint-disable */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { User } from '../types/User';
import { RootState } from '../app/store';
import { getUsers } from '../api/users';

const initialState = {
  loading: false,
  error: false,
  users: [] as User[],
};

export const loadUsers = createAsyncThunk('users/fetch', async () => {
  return getUsers();
});

export const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(loadUsers.pending, state => {
      state.error = false;
      state.loading = true;
    });
    builder.addCase(loadUsers.rejected, state => {
      state.error = true;
      state.loading = false;
    });
    builder.addCase(loadUsers.fulfilled, (state, action) => {
      state.users = action.payload;
      state.loading = false;
    });
  },
});

export const getUsersFromStore = (store: RootState) => store.users.users;
