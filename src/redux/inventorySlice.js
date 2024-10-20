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
    {value: 'Naphthalene Balls', label: 'Naphthalene Balls'},
    {value: 'Glazing Door Lock', label: 'Glazing Door Lock'},
    {value: 'Logitech Pointer(R400)', label: 'Logitech Pointer(R400)'},
    {value: 'Comb Bind x Acce.', label: 'Comb Bind x Acce.'},
    {value: 'Marker Board', label: 'Marker Board'},
    {value: 'Flip Chart(Large)', label: 'Flip Chart(Large)'},
    {value: 'Marker', label: 'Marker'},
    {value: 'Air Conditioner', label: 'Air Conditioner'},
    {value: 'Mop', label: 'Mop'},
    {value: 'Paper Tissue', label: 'Paper Tissue'},
    {value: 'Ceiling Brush', label: 'Ceiling Brush'},
    {value: 'Toilet Brush', label: 'Toilet Brush'},
    {value: 'Sweeping Brush', label: 'Sweeping Brush'},
    {value: 'Dust Pan', label: 'Dust Pan'},
    {value: 'Toilet Rolls', label: 'Toilet Rolls'},
    {value: 'Dust Bin', label: 'Dust Bin'},
    {value: 'Office Chair', label: 'Office Chair'},
    {value: 'Industrial T-Roll', label: 'Industrial T-Roll'},
    {value: 'Tissue Stand', label: 'Tissue Stand'},
    {value: 'Floor Wiper', label: 'Floor Wiper'},
    {value: 'Double Door Cabinet', label: 'Double Door Cabinet'},
    {value: 'Table', label: 'Table'},
  ],
  inventoriesAtDistribution: [],
  inventoryUpdate: [],
  sortPurchaseBy: [
    {value: 'Date', label: 'Date'},
    {value: 'Item', label: 'Item'},
    {value: 'Quantity', label: 'Quantity'},
    {value: 'Quantity Left', label: 'Quantity Left'},
  ],
  sortDistributionBy: [
    {value: 'Date', label: 'Date'},
    {value: 'Item', label: 'Item'},
    {value: 'Person', label: 'Person'},
    {value: 'Issues', label: 'Issues'},
    {value: 'Section', label: 'Section'},
  ]
};

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    sortPurchases: (state, action) => {
      const { value } = action.payload;
      if (value === 'Date') {
        state.purchases = sortInventory(state.purchases);
      } else if (value === 'Item') {
        state.purchases = state.purchases.sort((a, b) => a.name.localeCompare(b.name));
      } else if (value === 'Quantity') {
        state.purchases = state.purchases.sort((a, b) => b.itemsBought - a.itemsBought);
      } else {
        state.purchases = state.purchases.sort((a, b) => b.balance - a.balance);
      }
    },

    sortDistributions: (state, action) => {
      const { value } = action.payload;
      if (value === 'Date') {
        state.distributions = sortDistributionData(state.distributions);
      } else if (value === 'Item') {
        state.distributions = state.distributions.sort((a, b) => a.itemName.localeCompare(b.itemName));
      } else if (value === 'Person') {
        state.distributions = state.distributions.sort((a, b) => a.recipient.localeCompare(b.recipient));
      } else if (value === 'Issues') {
        state.distributions = state.distributions.sort((a, b) => b.issues - a.issues);
      }else {
        state.distributions = state.distributions.sort((a, b) => a.section.localeCompare(b.section));
      }
    },

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

export const { addInventory, sortDistributions, sortPurchases, addDistribution, addPurchase } = inventorySlice.actions;

export default inventorySlice.reducer;
