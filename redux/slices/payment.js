import {
  createSlice,
  createAsyncThunk,
  createSelector,
} from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";

import { paymentApi } from "@/api";
import preprice from "@/data/preprice";
import asyncThunkError from "@/utils/asyncThunkError";

export const postCustomerPortal = createAsyncThunk(
  "payment/postCustomerPortalFetching",
  async (_, { rejectWithValue }) => {
    try {
      const response = await paymentApi.postCustomerPortal();
      return { data: response.data, status: response.status };
    } catch (error) {
      return asyncThunkError(error, rejectWithValue);
    }
  }
);

export const getPriceList = createAsyncThunk(
  "payment/getPriceListFetching",
  async (_, { rejectWithValue }) => {
    try {
      const response = await paymentApi.getPriceList();
      return { data: response.data, status: response.status };
    } catch (error) {
      return asyncThunkError(error, rejectWithValue);
    }
  }
);

export const getSubscriptions = createAsyncThunk(
  "payment/getSubscriptionsFetching",
  async ({ status }, { rejectWithValue }) => {
    try {
      const response = await paymentApi.getSubscriptions({ status });
      return { data: response.data, status: response.status };
    } catch (error) {
      return asyncThunkError(error, rejectWithValue);
    }
  }
);

export const getSubscriptionsMe = createAsyncThunk(
  "payment/getSubscriptionsMeFetching",
  async (_, { rejectWithValue }) => {
    try {
      const response = await paymentApi.getSubscriptionsMe();
      return { data: response.data, status: response.status };
    } catch (error) {
      return asyncThunkError(error, rejectWithValue);
    }
  }
);

export const postUpdateSubscriptionPlan = createAsyncThunk(
  "payment/postUpdateSubscriptionPlanFetching",
  async ({ data }, { rejectWithValue }) => {
    try {
      const response = await paymentApi.postUpdateSubscriptionPlan({ data });
      return { data: response.data, status: response.status };
    } catch (error) {
      return asyncThunkError(error, rejectWithValue);
    }
  }
);

export const postCreateCustomer = createAsyncThunk(
  "payment/postCreateCustomerFetching",
  async (_, { rejectWithValue }) => {
    try {
      const response = await paymentApi.postCreateCustomer();
      return { data: response.data, status: response.status };
    } catch (error) {
      return asyncThunkError(error, rejectWithValue);
    }
  }
);

export const postCreateCheckoutSession = createAsyncThunk(
  "payment/postCreateCheckoutSessionFetching",
  async ({ data }, { rejectWithValue }) => {
    try {
      const response = await paymentApi.postCreateCheckoutSession({ data });
      return { data: response.data, status: response.status };
    } catch (error) {
      return asyncThunkError(error, rejectWithValue);
    }
  }
);

export const getCheckoutSession = createAsyncThunk(
  "payment/getCheckoutSessionFetching",
  async ({ sessionId }, { rejectWithValue }) => {
    try {
      const response = await paymentApi.getCheckoutSession({ sessionId });
      return { data: response.data, status: response.status };
    } catch (error) {
      return asyncThunkError(error, rejectWithValue);
    }
  }
);

export const postCreateSubscription = createAsyncThunk(
  "payment/postCreateSubscriptionFetching",
  async ({ data }, { rejectWithValue }) => {
    try {
      const response = await paymentApi.postCreateSubscription({ data });
      return { data: response.data, status: response.status };
    } catch (error) {
      return asyncThunkError(error, rejectWithValue);
    }
  }
);

export const postTrialEndInstantly = createAsyncThunk(
  "payment/postTrialEndInstantlyFetching",
  async (_, { rejectWithValue }) => {
    try {
      const response = await paymentApi.postTrialEndInstantly();
      return { data: response.data, status: response.status };
    } catch (error) {
      return asyncThunkError(error, rejectWithValue);
    }
  }
);

const initialState = {
  payment: { loading: "idle", items: [], error: null },
  price: { loading: "idle", items: [...preprice], error: null },
  customer: { loading: "idle", id: null, error: null },
  subscription: { loading: "idle", items: [], error: null },
  checkout: { loading: "idle", session: {}, error: null },
  modalpricing: { current: null },
  trail: {
    loading: "idle",
    data: {
      isSuccess: false,
    },
    error: null,
  },
};

const validArray = (arr) => {
  return Array.isArray(arr) ? arr : [];
};

const payment = createSlice({
  name: "payment",
  initialState,
  reducers: {
    resetPaymentState: () => {
      return initialState;
    },
    setCurrentModalPrice: (state, action) => {
      state.modalpricing.current = action.payload;
    },
    setCurrentSubscriptionWords: (state, action) => {
      // console.log(action.payload);
      // state.payment.items[1].words = 5;
    },
  },
  extraReducers: {
    [HYDRATE]: (state, { payload }) => ({
      ...state,
      ...payload.payment,
    }),
    [getPriceList.pending]: (state, action) => {
      if (state.price.loading === "idle") {
        state.price.loading = "pending";
        state.price.error = null;
      }
    },
    [getPriceList.fulfilled]: (state, action) => {
      if (state.price.loading === "pending") {
        state.price.loading = "idle";
        state.price.items = action.payload.data.prices;
      }
    },
    [getPriceList.rejected]: (state, action) => {
      if (state.price.loading === "pending") {
        state.price.loading = "idle";
        state.price.error = action.payload.data;
      }
    },

    [getSubscriptions.pending]: (state, action) => {
      if (state.subscription.loading === "idle") {
        state.subscription.loading = "pending";
        state.subscription.error = null;
      }
    },
    [getSubscriptions.fulfilled]: (state, action) => {
      if (state.subscription.loading === "pending") {
        state.subscription.loading = "idle";
        state.subscription.items = action.payload.data.subscriptions;
      }
    },
    [getSubscriptions.rejected]: (state, action) => {
      if (state.subscription.loading === "pending") {
        state.subscription.loading = "idle";
        state.subscription.error = action.payload.data;
      }
    },

    [getSubscriptionsMe.pending]: (state, action) => {
      if (state.payment.loading === "idle") {
        state.payment.loading = "pending";
        state.payment.error = null;
      }
    },
    [getSubscriptionsMe.fulfilled]: (state, action) => {
      if (state.payment.loading === "pending") {
        state.payment.loading = "idle";
        state.payment.items = action.payload.data.subscriptions;
      }
    },
    [getSubscriptionsMe.rejected]: (state, action) => {
      if (state.payment.loading === "pending") {
        state.payment.loading = "idle";
        state.payment.error = action.payload.data;
      }
    },

    [postUpdateSubscriptionPlan.pending]: (state, action) => {
      if (state.subscription.loading === "idle") {
        state.subscription.loading = "pending";
        state.subscription.error = null;
      }
    },
    [postUpdateSubscriptionPlan.fulfilled]: (state, action) => {
      if (state.subscription.loading === "pending") {
        state.subscription.loading = "idle";
        const subscription = action.payload.data.subscription;
        const subsIndex = state.subscription.items.findIndex(
          (item) => item.id === subscription.id
        );
        if (subsIndex >= 0) {
          state.subscription.items[subsIndex] = subscription;
        }
      }
    },
    [postUpdateSubscriptionPlan.rejected]: (state, action) => {
      if (state.subscription.loading === "pending") {
        state.subscription.loading = "idle";
        state.subscription.error = action.payload.data;
      }
    },

    [postCreateCustomer.pending]: (state, action) => {
      if (state.customer.loading === "idle") {
        state.customer.loading = "pending";
        state.customer.error = null;
      }
    },
    [postCreateCustomer.fulfilled]: (state, action) => {
      if (state.customer.loading === "pending") {
        state.customer.loading = "idle";
        state.customer.id = action?.payload?.data?.customer?.customerStripeId;
      }
    },
    [postCreateCustomer.rejected]: (state, action) => {
      if (state.customer.loading === "pending") {
        state.customer.loading = "idle";
        state.customer.error = action.payload.data;
      }
    },
    [postCreateCheckoutSession.pending]: (state, action) => {
      if (state.checkout.loading === "idle") {
        state.checkout.loading = "pending";
        state.checkout.error = null;
      }
    },
    [postCreateCheckoutSession.fulfilled]: (state, action) => {
      if (state.checkout.loading === "pending") {
        state.checkout.loading = "idle";
      }
    },
    [postCreateCheckoutSession.rejected]: (state, action) => {
      if (state.checkout.loading === "pending") {
        state.checkout.loading = "idle";
        state.checkout.error = action.payload.data;
      }
    },

    [getCheckoutSession.pending]: (state, action) => {
      if (state.checkout.loading === "idle") {
        state.checkout.loading = "pending";
        state.checkout.error = null;
      }
    },
    [getCheckoutSession.fulfilled]: (state, action) => {
      if (state.checkout.loading === "pending") {
        state.checkout.loading = "idle";
        state.checkout.session = action.payload.data.session;
      }
    },
    [getCheckoutSession.rejected]: (state, action) => {
      if (state.checkout.loading === "pending") {
        state.checkout.loading = "idle";
        state.checkout.error = action.payload.data;
      }
    },
    [postCreateSubscription.pending]: (state, action) => {
      if (state.subscription.loading === "idle") {
        state.subscription.loading = "pending";
        state.subscription.error = null;
      }
    },
    [postCreateSubscription.fulfilled]: (state, action) => {
      if (state.subscription.loading === "pending") {
        state.subscription.loading = "idle";
      }
    },
    [postCreateSubscription.rejected]: (state, action) => {
      if (state.subscription.loading === "pending") {
        state.subscription.loading = "idle";
        state.subscription.error = action.payload.data;
      }
    },

    [postCustomerPortal.pending]: (state, action) => {
      if (state.customer.loading === "idle") {
        state.customer.loading = "pending";
        state.customer.error = null;
      }
    },
    [postCustomerPortal.fulfilled]: (state, action) => {
      if (state.customer.loading === "pending") {
        state.customer.loading = "idle";
      }
    },
    [postCustomerPortal.rejected]: (state, action) => {
      if (state.customer.loading === "pending") {
        state.customer.loading = "idle";
        state.customer.error = action.payload.data;
      }
    },

    [postTrialEndInstantly.pending]: (state, action) => {
      if (state.trail.loading === "idle") {
        state.trail.loading = "pending";
        state.trail.error = null;
      }
    },
    [postTrialEndInstantly.fulfilled]: (state, action) => {
      if (state.trail.loading === "pending") {
        state.trail.loading = "idle";
        state.trail.data.isSuccess = true;
      }
    },
    [postTrialEndInstantly.rejected]: (state, action) => {
      if (state.trail.loading === "pending") {
        state.trail.loading = "idle";
        state.trail.error = action.payload.data;
      }
    },
  },
});

export const {
  resetPaymentState,
  setCurrentModalPrice,
  setCurrentSubscriptionWords,
} = payment.actions;

export const selectors = {
  getPayment: createSelector(
    (state) => state.payment,
    (data) => {
      return {
        ...data,
        payment: { ...data.payment, items: validArray(data.payment.items) },
        subscription: {
          ...data.subscription,
          items: validArray(data.subscription.items),
        },
        price: { ...data.price, items: validArray(data.price.items) },
      };
    }
  ),
  getPriceList: (interval_count = 1) =>
    createSelector(
      (state) => state.payment.price,
      (price) => {
        const { loading, items, error } = price;

        const filterPrice = items.filter(
          (item) =>
            item?.recurring?.interval === "month" &&
            item?.recurring?.interval_count === interval_count
        );

        const sortedPrice = filterPrice
          .slice()
          .sort((a, b) => (a.unit_amount > b.unit_amount ? 1 : -1));

        return { loading, items: sortedPrice, error };
      }
    ),

  getCustomer: createSelector(
    (state) => state.payment.customer,
    (customer) => customer
  ),
  getSubscription: createSelector(
    (state) => state.payment.subscription,
    (subscription) => {
      const items = validArray(subscription.items);
      return { ...subscription, items };
    }
  ),
  getCheckout: createSelector(
    (state) => state.payment.checkout,
    (checkout) => checkout
  ),
  getModalPricing: createSelector(
    (state) => state.payment.modalpricing,
    (modalpricing) => modalpricing
  ),
  getTrail: createSelector(
    (state) => state.payment.trail,
    (trail) => trail
  ),
};

export default payment.reducer;
