import { configureStore } from '@reduxjs/toolkit';
import inventoryReducer from './inventorySlice';
import { loadState, saveState } from '../utils/localStorage';

const persistedState = loadState();

const store = configureStore({
  reducer: {
    inventory: inventoryReducer
  },
  preloadedState: persistedState,
});

store.subscribe(() => {
  saveState({
    inventory: store.getState().inventory,
  })
})
export default store;
