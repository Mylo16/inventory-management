export const sections = [
  {value: 'Service Support', label: 'Service'},
  {value: 'Technical Support', label: 'Technical'},
  {value: 'Instructional Support', label: 'Instructional'},
  {value: 'Administration Support', label: 'Administration'},
]

export const addNewInventory = (updatedInventoryItems) => {
  localStorage.setItem("inventoryItems", JSON.stringify(updatedInventoryItems));
}

export const getInventoryItems = () => {
  return JSON.parse(localStorage.getItem("inventoryItems"));
}

export const updateInventory = (inventory) => {
  localStorage.setItem("inventory", JSON.stringify(inventory));
}

export const getInventory = () => {
  return JSON.parse(localStorage.getItem("inventory"));
}

export const getDistributionData = () => {
  return JSON.parse(localStorage.getItem("distributionData"));
}

export const addDistributionData = (distributionData) => {
  localStorage.setItem("distributionData", JSON.stringify(distributionData));
}

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
