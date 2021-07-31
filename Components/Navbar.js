import React from "react";

function Navbar({ setmode, styles, mode, silver, gain }) {
  return (
    <div className={styles.profite}>
      <h1>Profit Checker</h1>
      <nav className={styles.navbar}>
        <ul>
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a href="/calc">Calculator</a>
          </li>
          <li>
            <p>Silver : {silver}</p>
          </li>
          <li>
            <p>Gain : {gain}</p>
          </li>
        </ul>
      </nav>
      <div className={styles.Switch} onClick={() => setmode(!mode)}>
        <img src="/svgs/mode.svg" />
      </div>
    </div>
  );
}

export default Navbar;
