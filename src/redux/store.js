import { configureStore } from '@reduxjs/toolkit';
import inventoryReducer from './inventorySlice';
import { loadState, saveState } from '../utils/localStorage';
import reportReducer from './reportSlice';

const persistedState = loadState();

const store = configureStore({
  reducer: {
    inventory: inventoryReducer,
    report: reportReducer,
  },
  preloadedState: persistedState,
});

store.subscribe(() => {
  saveState({
    inventory: store.getState().inventory,
    report: store.getState().report,
  })
})
export default store;
