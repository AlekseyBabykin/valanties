// apiSlice.js

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

const apiSlice = createSlice({
  name: "api",
  initialState: {
    idMyData: [],
    items: [],
    status: "idle",
    error: null,
  },
  extraReducers: {
    [fetchIds.pending]: (state) => {
      state.status = "loading";
    },
    [fetchIds.fulfilled]: (state, action) => {
      state.status = "succeeded";
      state.idMyData = action.payload;
    },
    [fetchIds.rejected]: (state, action) => {
      state.status = "failed";
      state.error = action.error.message;
    },
    [fetchItems.pending]: (state) => {
      state.status = "loading";
    },
    [fetchItems.fulfilled]: (state, action) => {
      state.status = "succeeded";
      state.items = action.payload;
    },
    [fetchItems.rejected]: (state, action) => {
      state.status = "failed";
      state.error = action.error.message;
    },
  },
});

export default apiSlice.reducer;
