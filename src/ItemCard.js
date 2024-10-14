import React from "react";
import images from "./utils/images";

function ItemCard({ item, onEditClick, onDeleteClick }) {
  return (
    <div className="item-card">
      <div className="delete-icon" onClick={() => onDeleteClick(item.id)}>
        <img src={images.deleteBtn} alt="delete-icon"/>
      </div>
      <h3>{item.name}</h3>
      <p>Type: {item.type}</p>
      <p>Items Bought: {item.itemsBought}</p>
      <p>Items Used: {item.itemsUsed}</p>
      <p>Items Remaining: {item.itemsRemaining}</p>
      <p>Last Bought: {item.itemBoughtDate}</p>
      <p>Last Used: {item.itemUsedDate}</p>
      <button onClick={() => onEditClick(item)}>Edit</button>
    </div>
  );
}

export default ItemCard;
