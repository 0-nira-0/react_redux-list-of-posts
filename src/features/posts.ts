/* eslint-disable */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getUserPosts } from '../api/posts';
import { Post } from '../types/Post';
import { User } from '../types/User';

const initialState = {
  loading: false,
  error: false,
  posts: [] as Post[],
};

export const loadUserPosts = createAsyncThunk(
  'posts/fetch',
  async (userId: User['id']) => {
    return getUserPosts(userId);
  },
);

export const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    clearPosts: state => {
      state.posts = [];
    },
  },
  extraReducers(builder) {
    builder.addCase(loadUserPosts.pending, state => {
      state.error = false;
      state.loading = true;
    });
    builder.addCase(loadUserPosts.rejected, state => {
      state.error = true;
      state.loading = false;
    });
    builder.addCase(loadUserPosts.fulfilled, (state, action) => {
      state.posts = action.payload;
      state.loading = false;
    });
  },
});

export const { clearPosts } = postsSlice.actions;
