export const sortInventory = (inventory) => {
  const sortedInventory = inventory.sort((a, b) => {
    return new Date(b.itemBoughtDate) - new Date(a.itemBoughtDate);
  });
  return sortedInventory;
}

export const sortDistributionData = (distributionData) => {
  const sortedDistributionData = distributionData.sort((a, b) => {
    return new Date(b.itemUseDate) - new Date(a.itemUseDate);
  });
  return sortedDistributionData;
}

export const loadState = () => {
  try {
    const serializedState = localStorage.getItem('inventoryState');
    if (serializedState === null) {
      return undefined; // State not found, Redux will use default state
    }
    return JSON.parse(serializedState); // Parse the saved state from localStorage
  } catch (error) {
    console.error("Could not load state", error);
    return undefined;
  }
};

export const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('inventoryState', serializedState); // Save Redux state to localStorage
  } catch (error) {
    console.error("Could not save state", error);
  }
};
