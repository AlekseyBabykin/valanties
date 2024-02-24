import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import md5 from "md5";

export const fetchIds = createAsyncThunk("api/fetchIds", async () => {
  const password = "Valantis";
  const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const authString = md5(`${password}_${timestamp}`);

  const response = await axios.post(
    "http://api.valantis.store:40000/",
    {
      action: "get_ids",
      // params: { offset: 0, limit: 200 },
    },
    {
      headers: {
        "X-Auth": authString,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data.result;
});

export const fetchItems = createAsyncThunk("api/fetchItems", async (ids) => {
  const password = "Valantis";
  const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const authString = md5(`${password}_${timestamp}`);

  const response = await axios.post(
    "http://api.valantis.store:40000/",
    {
      action: "get_items",
      params: { ids },
    },
    {
      headers: {
        "X-Auth": authString,
        "Content-Type": "application/json",
      },
    }
  );

  const uniqueItems = response.data.result.filter(
    (item, index, arr) => arr.findIndex((obj) => obj.id === item.id) === index
  );
  return uniqueItems;
});

export const filterItems = createAsyncThunk(
  "api/filterItems",
  async ({ product, price, brand }) => {
    const password = "Valantis";
    const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const authString = md5(`${password}_${timestamp}`);

    const response = await axios.post(
      "http://api.valantis.store:40000/",
      {
        action: "filter",
        params: { product, price, brand },
      },
      {
        headers: {
          "X-Auth": authString,
          "Content-Type": "application/json",
        },
      }
    );

    const uniqueItems = response.data.result.filter(
      (item, index, arr) => arr.findIndex((obj) => obj.id === item.id) === index
    );
    return uniqueItems;
  }
);

const apiSlice = createSlice({
  name: "api",
  initialState: {
    idMyData: [],
    items: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIds.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchIds.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.idMyData = action.payload;
      })
      .addCase(fetchIds.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchItems.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(filterItems.pending, (state) => {
        state.status = "loading";
      })
      .addCase(filterItems.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.idMyData = action.payload;
      })
      .addCase(filterItems.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default apiSlice.reducer;
