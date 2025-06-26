import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { rootInitialStates } from "../states/rootStates";

const rootSlice = createSlice({
  name: "root",
  initialState: rootInitialStates,
  reducers: {
    setLoading: (_state, _action: PayloadAction<boolean>) => {
      _state.loading = _action.payload;
    },
  },
  extraReducers: (_builder) => {
    // builder
    //   .addCase(createUser.pending, (_state) => {})
    //   .addCase(createUser.fulfilled, (_state, _action) => {})
    //   .addCase(createUser.rejected, (_state, _action) => {});
  },
});

export const { setLoading } = rootSlice.actions;
export default rootSlice.reducer;
