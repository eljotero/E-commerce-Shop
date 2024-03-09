import React, { useState } from "react";
import "../css/Promocode.css";

function Promocode() {
  const [visible, setVisible] = useState(true);

  const closePromoCodeNotification = () => {
    setVisible(false);
  };

  if (!visible) {
    return null;
  }

  return (
    <div className="PromoCodeContainer">
      <span className="PromoCodeText">
        Get free candy samples with orders over $100. Code: SWEETSHIP
      </span>
      <button
        className="ClosePromoCodeNotification"
        onClick={closePromoCodeNotification}
      >
        X
      </button>
    </div>
  );
}

export default Promocode;
