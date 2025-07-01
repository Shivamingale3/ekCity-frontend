import { configureStore } from "@reduxjs/toolkit";
import {
  useDispatch,
  useSelector,
  type TypedUseSelectorHook,
} from "react-redux";
// import authReducer from "./../slices/authSlice";
// import onboardingReducer from "./../slices/onboardingSlice";
import rootReducer from "./../redux/slices/rootSlice";
import feedReducer from "./../redux/slices/feedSlice";
import userReducer from "./../redux/slices/userSlice";
// import workspaceReducer from "./../slices/workspaceSlice";

export const store = configureStore({
  reducer: {
    root: rootReducer,
    feed: feedReducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Typed hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
