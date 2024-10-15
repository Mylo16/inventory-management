import { useEffect, useRef, useState } from "react";
import images from "../utils/images";

const Modal = ({item, show, quitModal}) => {
  const [inventory, setInventory] = useState(() => {
    // Retrieve inventory from localStorag
    if(item) return [item];
    const storedInventory = localStorage.getItem("inventory");
    return storedInventory ? JSON.parse(storedInventory) : [];
  });

  const [lowStock, setLowStock] = useState([]);
  const [showLowStock, setShowLowStock] = useState(show);
  const [highlight, setHighlight] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const lowStockItems = inventory.filter(item => item.itemsRemaining <= item.reorderLevel);
    setLowStock(lowStockItems);
    setHighlight(lowStockItems.length > 0);
  }, [inventory]);

  const closeModal = () => {
    setShowLowStock(false);
    quitModal();
  }

  useEffect(() => {
    const scrollContainerRef = containerRef.current;
    const handleClick = (event) => {
      if (showLowStock && !event.target.closest('.notification-modal-content') && !event.target.closest('.notification')) {
        closeModal();
      }
    }

    const scrollInterval = setInterval(() => {
      if(showLowStock) {
        scrollContainerRef.scrollBy({ 'left': scrollContainerRef.scrollLeft += 330}, 'smooth');
      }
    }, 3000);

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
      clearInterval(scrollInterval);
    }
  }, [showLowStock]);
  return(
    <>
      <div className='notification-modal'>
          <div className='notification-modal-content'>
            <div><img className='warning' src={images.warning} alt="warning"/></div>
            <div ref={containerRef} className='content-ctn'>
              <div className='content-sub-ctn'>
              {lowStock.map((stock, index) => (
                <div className='stock-warn' key={index}>
                  {stock.name} is running Low!!
                </div>
              ))}
              </div>
            </div>
            <button className="ok-btn" onClick={() => closeModal()}>OK</button>
          </div>
        </div>
    </>
  );
}

export default Modal;