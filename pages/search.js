import React from "react";
import styles from "../styles/Search.module.css";

function search() {
  return (
    <div className={styles.container}>
      <div className={styles.body}>
        <input type="text" placeholder="Item Id" />
      </div>
    </div>
  );
}

export default search;
