import Head from "next/head";
import React, { useCallback, useEffect, useRef, useState } from "react";
import styles from "../styles/Calc.module.css";

function calc() {
  const [C, setC] = useState();
  const [B, setB] = useState();
  const [buck, setbuck] = useState([{}]);
  const [Profite, setProfite] = useState();

  const Itemslist = useCallback(({ d }) => {
    const [hide, setHide] = useState(false);
    const li = useRef();
    return (
      <li
        ref={li}
        onMouseOver={() => setHide(true)}
        onMouseLeave={() => setHide(false)}
      >
        {" "}
        {d.prof}{" "}
        {hide && (
          <button onClick={() => li.current.remove()} className={styles.rmvbtn}>
            Remove
          </button>
        )}{" "}
      </li>
    );
  }, []);
  const handlecalc = () => {
    setProfite((parseInt(B) - parseInt(C) - parseInt(B) * 0.06).toFixed(2));
  };
  useEffect(() => {
    setbuck((e) => [...e, { prof: Profite }]);
  }, [Profite]);
  return (
    <div className={styles.container}>
      <Head>
        <title>Black Market Profite Calculator</title>
        <link rel="icon" href="/albion.png" />
      </Head>
      <div className={styles.body}>
        <label>Carlion Market</label>
        <input
          type="text"
          value={C}
          onChange={(e) => setC(e.target.value)}
          placeholder="Carleon Market"
        />
        <label>Black Market</label>
        <input
          type="text"
          value={B}
          onChange={(e) => setB(e.target.value)}
          placeholder="Black Market"
        />
        <button onClick={() => handlecalc()}>Calculate</button>
        <h1>Profite {!Profite ? 0 : Profite} </h1>
        {Profite && (
          <ul className={styles.listitems}>
            {buck.map((d) => d.prof > 0 && <Itemslist d={d} />)}
          </ul>
        )}
      </div>
    </div>
  );
}

export default calc;
