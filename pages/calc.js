import React, { useEffect, useState } from "react";
import styles from "../styles/Calc.module.css";

function calc() {
  const [C, setC] = useState();
  const [B, setB] = useState();
  const [buck, setbuck] = useState([{}]);
  const [Profite, setProfite] = useState();

  const handlecalc = () => {
    setProfite(parseInt(B) - parseInt(C) - parseInt(B) * 0.06);
  };
  useEffect(() => {
    setbuck((e) => [...e, { prof: Profite }]);
  }, [Profite]);
  return (
    <div className={styles.container}>
      <div className={styles.body}>
        <input
          type="text"
          value={C}
          onChange={(e) => setC(e.target.value)}
          placeholder="Carleon Market"
        />
        <input
          type="text"
          value={B}
          onChange={(e) => setB(e.target.value)}
          placeholder="Black Market"
        />
        <button onClick={() => handlecalc()}>Calculate</button>
        <h1>Profite {Profite} </h1>
        <ul>{buck.map((d) => d.prof > 0 && <li> {d.prof} </li>)}</ul>
      </div>
    </div>
  );
}

export default calc;
