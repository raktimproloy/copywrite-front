import {
  createSlice,
  createSelector,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";

import { uiApi } from "@/api";
import { asyncThunkError, pick } from "@/utils";

export const getNotice = createAsyncThunk(
  "ui/getNoticeFetching",
  async (_, { rejectWithValue }) => {
    try {
      const response = await uiApi.getNotice();
      return { data: response.data, status: response.status };
    } catch (error) {
      return asyncThunkError(error, rejectWithValue);
    }
  }
);

export const updateNotice = createAsyncThunk(
  "ui/updateNoticeFetching",
  async ({ data }, { rejectWithValue }) => {
    try {
      const response = await uiApi.updateNotice({ data });
      return { data: response.data, status: response.status };
    } catch (error) {
      return asyncThunkError(error, rejectWithValue);
    }
  }
);

const initialState = {
  sideBar: {
    bookmark: false,
  },

  modal: {
    update: {
      password: false,
      email: false,
      name: false,
    },
    blogs: {
      delete: false,
      reset: false,
    },
    subscriber: {
      isOpen: false,
      block: false,
      message: null,
    },
    taskaccess: {
      isOpen: false,
      message: null,
    },
    subscriptions: {
      cancel: false,
      trailEnd: false,
    },
    auth: {
      signin: false,
    },
  },

  landingBanner: {
    items: [
      {
        id: 1,
        loading: "idle",
        input: [],
        output: [],
      },
    ],
  },

  contentSidebar: {
    open: false,
  },
  headerSize: {
    topBarHeigth: 0,
    navBarHeigth: 0,
    showTopBar: true,
  },
  headerElementSize: {
    noticeHeight: 0,
    navHeight: 0,
    showNoticeBar: false,
  },
  redirectPath: null,
  notice: {
    loading: "idle",
    data: { active: false },
    isLoaded: false,
    error: null,
  },
};

const ui = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleBookmarkSidebar: (state, action) => {
      state.sideBar.bookmark = !state.sideBar.bookmark;
    },
    falseBookmarkSidebar: (state, action) => {
      state.sideBar.bookmark = false;
    },
    trueBookmarkSidebar: (state, action) => {
      state.sideBar.bookmark = true;
    },
    setUpdatePasswordModal: (state, action) => {
      state.modal.update.password = action.payload;
    },
    setUpdateEmailModal: (state, action) => {
      state.modal.update.email = action.payload;
    },
    setUpdateNameModal: (state, action) => {
      state.modal.update.name = action.payload;
    },
    setBlogDeleteModal: (state, action) => {
      state.modal.blogs.delete = action.payload;
    },
    setBlogResetModal: (state, action) => {
      state.modal.blogs.reset = action.payload;
    },
    setSubscriberUsageModal: (state, action) => {
      state.modal.subscriber.isOpen = action.payload.isOpen;
      state.modal.subscriber.block = action.payload.block;
      if (action.payload.isOpen === true) {
        state.modal.subscriber.message = action.payload.message;
      } else {
        state.modal.subscriber.message = null;
      }
    },
    setAccessTask: (state, action) => {
      state.modal.taskaccess = action.payload;
    },
    setSigninModal: (state, action) => {
      state.modal.auth.signin = action.payload;
    },
    setContentSidebar: (state, action) => {
      const bool = action.payload;
      if (bool.toString()) {
        state.contentSidebar.open = bool;
      } else {
        state.contentSidebar.open = !state.contentSidebar.open;
      }
    },
    setTopBarHeigth: (state, action) => {
      state.headerSize.topBarHeigth = action.payload;
    },
    setNavBarHeigth: (state, action) => {
      state.headerSize.navBarHeigth = action.payload;
    },
    setTopBarStatus: (state, action) => {
      state.headerSize.showTopBar = action.payload;
    },
    setRedirectPath: (state, action) => {
      state.redirectPath = action.payload;
    },
    setSubscriptionsCancelModal: (state, action) => {
      state.modal.subscriptions.cancel = action.payload;
    },
    setSubscriptionsTrailEndModal: (state, action) => {
      state.modal.subscriptions.trailEnd = action.payload;
    },
    setHeaderElementSize: (state, action) => {
      const payload = pick(action.payload, [
        "noticeHeight",
        "navHeight",
        "showNoticeBar",
      ]);
      state.headerElementSize = { ...state.headerElementSize, ...payload };
    },
  },
  extraReducers: {
    [HYDRATE]: (state, { payload }) => ({
      ...state,
      ...payload.ui,
    }),

    [getNotice.pending]: (state, action) => {
      if (state.notice.loading === "idle") {
        state.notice.loading = "pending";
        state.notice.error = null;
      }
    },
    [getNotice.fulfilled]: (state, action) => {
      if (state.notice.loading === "pending") {
        state.notice.loading = "idle";
        state.notice.isLoaded = true;
        state.notice.data = action.payload.data.notice;
      }
    },
    [getNotice.rejected]: (state, action) => {
      if (state.notice.loading === "pending") {
        state.notice.loading = "idle";
        state.notice.error = action.payload.data;
      }
    },

    [updateNotice.pending]: (state, action) => {
      if (state.notice.loading === "idle") {
        state.notice.loading = "pending";
        state.notice.error = null;
      }
    },
    [updateNotice.fulfilled]: (state, action) => {
      if (state.notice.loading === "pending") {
        state.notice.loading = "idle";
        state.notice.isLoaded = true;
        state.notice.data = action.payload.data.notice;
      }
    },
    [updateNotice.rejected]: (state, action) => {
      if (state.notice.loading === "pending") {
        state.notice.loading = "idle";
        state.notice.error = action.payload.data;
      }
    },
  },
});

export const {
  toggleBookmarkSidebar,
  falseBookmarkSidebar,
  trueBookmarkSidebar,
  setUpdatePasswordModal,
  setUpdateEmailModal,
  setUpdateNameModal,
  setBlogDeleteModal,
  setBlogResetModal,
  setSubscriberUsageModal,
  setAccessTask,
  setSigninModal,
  setContentSidebar,
  setTopBarHeigth,
  setNavBarHeigth,
  setTopBarStatus,
  setRedirectPath,
  setSubscriptionsCancelModal,
  setSubscriptionsTrailEndModal,
  setHeaderElementSize,
} = ui.actions;

export const selectors = {
  getUI: createSelector(
    (state) => state.ui,
    (data) => data
  ),
  getSidebar: createSelector(
    (state) => state.ui.sideBar,
    (data) => data
  ),
  getModal: createSelector(
    (state) => state.ui.modal,
    (modal) => modal
  ),
  getContentSidebar: createSelector(
    (state) => state.ui.contentSidebar,
    (contentSidebar) => contentSidebar
  ),
  getHeaderSize: createSelector(
    (state) => state.ui.headerSize,
    (headerSize) => headerSize
  ),
  getHeaderElementSize: createSelector(
    (state) => state.ui.headerElementSize,
    (headerElementSize) => headerElementSize
  ),
  getRedirectPath: createSelector(
    (state) => state.ui.redirectPath,
    (redirectPath) => redirectPath
  ),
  getNotice: createSelector(
    (state) => state.ui.notice,
    (notice) => notice
  ),
};

export default ui.reducer;
