import React from "react";
import images from "../utils/images";

function ItemCard({ item, onEditClick, onDeleteClick }) {
  return (
    <div className="item-card">
      <div className="delete-icon" onClick={() => onDeleteClick(item.id)}>
        <img src={images.deleteBtn} alt="delete-icon"/>
      </div>
      <div className="item-card-header">{item.name}</div>
      <div className="item-info">
      <div className="item-info-row">
        <div className="property">Type</div>
        <div className="value">{item.type}</div>
      </div>
      <div className="item-info-row">
        <div className="property">Items Bought</div>
        <div className="value">{item.itemsBought}</div>
      </div>
      <div className="item-info-row">
        <div className="property">Used</div>
        <div className="value">{item.itemsUsed}</div>
      </div>
      <div className="item-info-row">
        <div className="property">Remaining</div>
        <div className="value">{item.itemsRemaining}</div>
      </div>
      <div className="item-info-row">
        <div className="property">Last Bought</div>
        <div className="value"> {new Date(item.itemBoughtDate).toLocaleDateString()}</div>
      </div>
      <div className="item-info-row">
        <div className="property">Last Use</div>
        <div className="value"> {item.itemUsedDate === '' ? '-' : new Date(item.itemUsedDate).toLocaleDateString()}</div>
      </div>
      </div>
      
      <button className="edit-btn" onClick={() => onEditClick(item)}>Edit</button>
    </div>
  );
}

export default ItemCard;
