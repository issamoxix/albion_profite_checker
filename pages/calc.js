import Head from "next/head";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Navbar from "../Components/Navbar";
import styles from "../styles/Calc.module.css";
import { useRouter } from "next/router";
import { route } from "next/dist/next-server/server/router";

function calc() {
  const [C, setC] = useState();
  const [B, setB] = useState();
  const [buck, setbuck] = useState([{}]);
  const [Profite, setProfite] = useState();
  const router = useRouter();
  const Itemslist = useCallback(({ d }) => {
    const [hide, setHide] = useState(false);
    const [slash, setSlash] = useState(false);
    const li = useRef();
    return (
      <li
        ref={li}
        onMouseOver={() => setHide(true)}
        onMouseLeave={() => setHide(false)}
      >
        {" "}
        <span className={slash && styles.slash}>{d.prof} </span>
        {hide && (
          <button
            onMouseOver={() => setSlash(true)}
            onMouseLeave={() => setSlash(false)}
            onClick={() => li.current.remove()}
            className={styles.rmvbtn}
          >
            X
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
      <button onClick={() => router.push("/")} className={styles.back}>
        Back
      </button>
    </div>
  );
}

export default calc;
