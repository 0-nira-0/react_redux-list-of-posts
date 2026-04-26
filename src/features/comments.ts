/* eslint-disable */
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getPostComments } from '../api/comments';
import { Comment } from '../types/Comment';
import { Post } from '../types/Post';
import * as commentsApi from '../api/comments';

const initialState = {
  loading: false,
  error: false,
  comments: [] as Comment[],
};

export const loadPostComments = createAsyncThunk(
  'comments/fetch',
  async (postId: Post['id']) => {
    return getPostComments(postId);
  },
);

export const deletePostComment = createAsyncThunk(
  'comments/deleteComment',
  async (comment: Comment) => {
    return commentsApi.deleteComment(comment.id);
  },
);

export const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    addComment: (state, action: PayloadAction<Comment>) => {
      state.comments.push(action.payload);
    },
    deleteComment: (state, action: PayloadAction<Comment['id']>) => {
      state.comments = state.comments.filter(
        comment => comment.id !== action.payload,
      );
    },
    setError: (state, action: PayloadAction<boolean>) => {
      state.error = action.payload;
    },
  },
  extraReducers(builder) {
    builder.addCase(loadPostComments.pending, state => {
      state.error = false;
      state.loading = true;
    });
    builder.addCase(loadPostComments.rejected, state => {
      state.error = true;
      state.loading = false;
    });
    builder.addCase(loadPostComments.fulfilled, (state, action) => {
      state.comments = action.payload;
      state.loading = false;
    });
    builder.addCase(deletePostComment.pending, (state, action) => {
      state.comments = state.comments.filter(
        comment => comment.id !== action.meta.arg.id,
      );
      state.error = false;
      state.loading = true;
    });
    builder.addCase(deletePostComment.rejected, (state, action) => {
      state.comments.push(action.meta.arg);
      state.error = true;
      state.loading = false;
    });
    builder.addCase(deletePostComment.fulfilled, state => {
      state.loading = false;
    });
  },
});
