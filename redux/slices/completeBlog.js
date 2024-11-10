import {
  createSlice,
  createSelector,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";

import { pick, asyncThunkError } from "@/utils";
import { contentApi, blogApi } from "@/api";
import {
  BLOG_HEADLINE,
  BLOG_WRITING,
  BLOG_TOPIC,
  LONG_BLOG,
  SHORT_BLOG,
} from "@/appconstants";

export const postBlogContents = createAsyncThunk(
  "completeBlog/postCompleteBlogContentsFetching",
  async ({ data, task }, { rejectWithValue }) => {
    try {
      const response = await contentApi.postGenerateContents({ data, task });
      return { data: response.data, status: response.status };
    } catch (error) {
      return asyncThunkError(error, rejectWithValue);
    }
  }
);

export const postEditorToolsContent = createAsyncThunk(
  "completeBlog/postCompleteEditorToolsContentFetching",
  async ({ data, task }, { rejectWithValue }) => {
    try {
      const response = await contentApi.postGenerateContents({ data, task });
      return { data: response.data, status: response.status };
    } catch (error) {
      return asyncThunkError(error, rejectWithValue);
    }
  }
);

export const createBlog = createAsyncThunk(
  "completeBlog/createBlogFetching",
  async ({ data }, { rejectWithValue }) => {
    try {
      const response = await blogApi.createBlog({ data });
      return { data: response.data, status: response.status };
    } catch (error) {
      return asyncThunkError(error, rejectWithValue);
    }
  }
);

export const getBlog = createAsyncThunk(
  "completeBlog/getBlogFetching",
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await blogApi.getBlog({ id });
      return { data: response.data, status: response.status };
    } catch (error) {
      return asyncThunkError(error, rejectWithValue);
    }
  }
);

export const updateBlog = createAsyncThunk(
  "completeBlog/updateBlogFetching",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await blogApi.updateBlog({ id, data });
      return { data: response.data, status: response.status };
    } catch (error) {
      return asyncThunkError(error, rejectWithValue);
    }
  }
);

const initialState = {
  loading: "idle",
  currenttask: BLOG_HEADLINE,
  currentid: "",
  headline: {
    input: "",
    items: [],
  },
  about: {
    input: "",
    items: [],
  },
  complete: {
    input: "",
    items: [],
    success: false,
  },
  content: {
    loading: "idle",
    item: "",
    items: [],
    error: null,
  },
  editor: {
    currenttask: BLOG_TOPIC,
    range: { index: 0, length: 0 },
    selected: null,
    value: [],
  },
  selectedinput: {},
  error: null,
};

const completeBlog = createSlice({
  name: "completeBlog",
  initialState,
  reducers: {
    resetCompleteBlog: () => initialState,
    setEditorDefault: (state, action) => {
      const { headline, about, body, currentid } = action.payload;
      state.headline.input = headline;
      state.about.input = about;
      state.editor.value = body;
      state.currentid = currentid;
    },
    setCurrentTask: (state, action) => {
      state.currenttask = action.payload;
    },
    setEditor: (state, action) => {
      const payload = pick(action.payload, [
        "range",
        "selected",
        "value",
        "currenttask",
      ]);
      state.editor = { ...state.editor, ...payload };
    },
    setBlogHeadline: (state, action) => {
      const payload = pick(action.payload, ["input", "items"]);
      state.headline = { ...state.headline, ...payload };
    },
    setBlogAbout: (state, action) => {
      const payload = pick(action.payload, ["input", "items"]);
      state.about = { ...state.about, ...payload };
    },
    setBlogComplete: (state, action) => {
      const payload = pick(action.payload, ["input", "items"]);
      state.complete = { ...state.complete, ...payload };
    },
    setBlogContentItem: (state, action) => {
      state.content.item = action.payload;
    },
    setBlogContent: (state, action) => {
      const payload = pick(action.payload, ["item", "items"]);
      state.content = { ...state.content, ...payload };
    },
    setSelectedInput: (state, action) => {
      state.selectedinput = action.payload;
    },
  },
  extraReducers: {
    [HYDRATE]: (state, { payload }) => ({
      ...state,
      ...payload.complateBlog,
    }),

    [postBlogContents.pending]: (state, action) => {
      if (state.loading === "idle") {
        state.loading = "pending";
        state.error = null;
      }
    },
    [postBlogContents.fulfilled]: (state, action) => {
      if (state.loading === "pending") {
        const task = action.payload.data?.task;
        const generatedTexts = action.payload.data?.generatedTexts;
        const generatedBlog = action.payload.data?.generatedBlog;
        const headline = action.payload.data?.headline;
        state.loading = "idle";

        switch (task) {
          case BLOG_HEADLINE:
            state.headline.items = generatedTexts;
            state.currenttask = BLOG_WRITING;
            break;
          case BLOG_WRITING:
            state.complete.items = generatedBlog;
            state.headline.input = headline;
            state.complete.success = true;
            break;
          case LONG_BLOG:
            state.complete.items = generatedTexts[0];
            break;
          case SHORT_BLOG:
            state.complete.items = generatedTexts[0];
            state.complete.success = true;
            break;
          default:
            state.error = action.payload.data;
            break;
        }
      }
    },
    [postBlogContents.rejected]: (state, action) => {
      if (state.loading === "pending") {
        state.loading = "idle";
        state.error = action.payload.data;
      }
    },

    [postEditorToolsContent.pending]: (state, action) => {
      if (state.content.loading === "idle") {
        state.content.loading = "pending";
        state.content.error = null;
      }
    },
    [postEditorToolsContent.fulfilled]: (state, action) => {
      if (state.content.loading === "pending") {
        // const text = action.payload.data?.generatedTexts[0];
        state.content.loading = "idle";
        // state.content.item = `\n${text}`;
        state.content.items = action.payload.data?.generatedTexts;
      }
    },
    [postEditorToolsContent.rejected]: (state, action) => {
      if (state.content.loading === "pending") {
        state.content.loading = "idle";
        state.content.error = action.payload.data;
      }
    },
  },
});

export const {
  resetCompleteBlog,
  setEditorDefault,
  setCurrentTask,
  setEditor,
  setBlogHeadline,
  setBlogAbout,
  setBlogComplete,
  setBlogContentItem,
  setBlogContent,
  setSelectedInput,
} = completeBlog.actions;

export const selectors = {
  getCompleteBlogContent: createSelector(
    (state) => state.completeBlog,
    (completeBlog) => completeBlog
  ),

  getEditor: () =>
    createSelector([selectors.getCompleteBlogContent], ({ editor }) => {
      return editor;
    }),
};

export default completeBlog.reducer;
