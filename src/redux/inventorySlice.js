import { createSlice } from '@reduxjs/toolkit';
import { sortDistributionData, sortInventory } from '../utils/localStorage';

const initialState = {
  purchases: [],
  distributions: [],
  sections: [
    {value: 'Service Support', label: 'Service'},
    {value: 'Technical Support', label: 'Technical'},
    {value: 'Instructional Support', label: 'Instructional'},
    {value: 'Administration Support', label: 'Administration'},
  ],
  inventories: [
    {value: 'T-Roll', label: 'T-Roll'},
    {value: 'Water', label: 'Water'},
    {value: 'A4 Sheet', label: 'A4 Sheet'},
  ],
  inventoriesAtDistribution: [],
  inventoryUpdate: [],
};

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    addInventory: (state, action) => {
      state.inventories = [...state.inventories, action.payload];
    },

    addPurchase: (state, action) => {
      const { newItem } = action.payload;
      const existingItemIndex = state.purchases.findIndex(item => item.name === newItem.name);
      if (existingItemIndex !== -1) {
      const updatedPurchases = state.purchases.map((purchaseItem) => {
        if (purchaseItem.name === newItem.name) {
          state.inventoryUpdate = [];
          let updatedPurchaseItem = {
            ...purchaseItem,
            reorderLevel: newItem.reorderLevel,
            itemsBought: Number(purchaseItem.balance) + Number(newItem.itemsBought),
            itemBoughtDate: new Date().toISOString(),
            balance: Number(purchaseItem.balance) + Number(newItem.itemsBought)
          };
          state.inventoryUpdate = [...state.inventoryUpdate, updatedPurchaseItem];
          return updatedPurchaseItem;
        }
        return purchaseItem;
      })
      state.purchases = sortInventory(updatedPurchases);
      } else {
        const updatedPurchases = [
          ...state.purchases,
          { ...newItem, id: state.purchases.length + 1, itemBoughtDate: new Date().toISOString() },
        ];
        state.purchases = sortInventory(updatedPurchases);
        state.inventoriesAtDistribution = [...state.inventoriesAtDistribution, {value: newItem.name, label: newItem.name}];
      }
    },
    addDistribution: (state, action) => {
      const { newDistributionItem } = action.payload;
      const existingDistributionItemIndex = state.distributions.findIndex(item => item.itemName === newDistributionItem.itemName);
      const existingPurchaseItemIndex = state.purchases.findIndex(item => item.name === newDistributionItem.itemName);

      let updatedDistributionItem = {};
      if(existingDistributionItemIndex !== -1 && state.inventoryUpdate.length === 0) {
        updatedDistributionItem = {
          ...newDistributionItem,
          receipts: state.distributions[existingDistributionItemIndex].balance,
          balance: Number(state.distributions[existingDistributionItemIndex].balance) - Number(newDistributionItem.issues),
          itemUseDate: new Date().toISOString()
        }

      } else if (existingDistributionItemIndex !== -1 && state.inventoryUpdate.length === 1) {
        updatedDistributionItem = {
          ...newDistributionItem,
          receipts: state.inventoryUpdate[0].itemsBought,
          balance: Number(state.inventoryUpdate[0].itemsBought) - Number(newDistributionItem.issues),
          itemUseDate: new Date().toISOString()
        }
        state.inventoryUpdate = [];

      } else if (existingDistributionItemIndex === -1 && state.inventoryUpdate.length === 1) {
        updatedDistributionItem = {
          ...newDistributionItem,
          receipts: state.inventoryUpdate[0].itemsBought,
          balance: Number(state.inventoryUpdate[0].itemsBought) - Number(newDistributionItem.issues),
          itemUseDate: new Date().toISOString()
        }
        state.inventoryUpdate = [];

      } else if (existingDistributionItemIndex === -1 && state.inventoryUpdate.length === 0) {
        const receipts = state.purchases[existingPurchaseItemIndex].itemsBought;
        updatedDistributionItem = {
          ...newDistributionItem,
          receipts,
          balance: receipts - Number(newDistributionItem.issues),
          id: state.distributions.length + 1,
          itemUseDate: new Date().toISOString()
        }
      }
      // Update total items and remaining items logic
      const updatedPurchases = state.purchases.map(purchase => {
        if (purchase.name === newDistributionItem.itemName) {
          return {
            ...purchase,
            balance: Number(purchase.balance) - Number(newDistributionItem.issues),
          };
        }
        return purchase;
      });

      state.purchases = sortInventory(updatedPurchases);
      state.distributions = sortDistributionData([...state.distributions, updatedDistributionItem]);
    },
  },
});

export const { addInventory, addDistribution, addPurchase } = inventorySlice.actions;

export default inventorySlice.reducer;
