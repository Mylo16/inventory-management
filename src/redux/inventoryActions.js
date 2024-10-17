// src/actions/inventoryActions.js

export const ADD_PURCHASE = 'ADD_PURCHASE';
export const ADD_DISTRIBUTION = 'ADD_DISTRIBUTION';
export const UPDATE_INVENTORY = 'UPDATE_INVENTORY';

export const addPurchase = (purchase) => ({
  type: ADD_PURCHASE,
  payload: purchase,
});

export const addDistribution = (distribution) => ({
  type: ADD_DISTRIBUTION,
  payload: distribution,
});

export const updateInventory = (item) => ({
  type: UPDATE_INVENTORY,
  payload: item,
});
