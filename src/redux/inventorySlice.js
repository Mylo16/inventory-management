import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  balance: null,
};

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    getBalance: (state, action) => {
      state.balance = action.payload;
    }  
  },
});

export const { getBalance } = inventorySlice.actions;

export default inventorySlice.reducer;


// src/reducers/inventoryReducer.js

import { ADD_PURCHASE, ADD_DISTRIBUTION, UPDATE_INVENTORY } from '../actions/inventoryActions';

const initialState = {
  purchases: [],
  distributions: [],
};

const inventoryReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_PURCHASE:
      return {
        ...state,
        purchases: [...state.purchases, action.payload],
      };
      
    case ADD_DISTRIBUTION:
      const newDistribution = action.payload;
      // Update total items and remaining items logic
      const updatedPurchases = state.purchases.map(purchase => {
        if (purchase.name === newDistribution.itemName) {
          return {
            ...purchase,
            remainingItems: purchase.remainingItems - newDistribution.itemsReceived,
          };
        }
        return purchase;
      });

      return {
        ...state,
        purchases: updatedPurchases,
        distributions: [...state.distributions, newDistribution],
      };

    case UPDATE_INVENTORY:
      // Logic to update inventory based on the item
      return state; // Update based on your requirements

    default:
      return state;
  }
};

export default inventoryReducer;
