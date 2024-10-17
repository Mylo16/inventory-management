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

export const sortInventory = (inventory) => {
  const sortedInventory = inventory.sort((a, b) => {
    return new Date(b.itemBoughtDate) - new Date(a.itemBoughtDate);
  });
  return sortedInventory;
}