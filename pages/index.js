import Head from "next/head";
import { useState } from "react";
import styles from "../styles/Home.module.css";

export default function Home() {
  const [item, setItem] = useState("T4_ARMOR_LEATHER_SET2");
  const [profite, setProfite] = useState({});

  const [data, setData] = useState([]);
  const [bmarket, setbmarket] = useState([]);
  const [market, setmarket] = useState([]);
  const [q, setQ] = useState();
  const locations = ["Black Market", "Caerleon"];

  const fetch_data = async (items, q) => {
    const res = await fetch(
      `/api/hello?items=${items}&locations=${locations.toString()}&q=${q}`
    );
    const json = await res.json();
    json.map((d) => {
      if (d.city == "Black Market") {
        setbmarket((f) => [...f, d]);
      } else {
        setmarket((f) => [...f, d]);
      }
    });

    setData(json);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Albion Black Market heaven</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.container}>
        <div className={styles.profite}>
          <h1>Profite is {profite.buy - profite.sell - profite.buy * 0.06} </h1>
          <button onClick={() => setProfite({})}>Reset</button>
        </div>
        <div className={styles.body}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              fetch_data(item, q);
            }}
          >
            <input
              type="text"
              placeholder="Items"
              value={item}
              onChange={(e) => setItem(e.target.value)}
            />
            <input
              type="text"
              placeholder="Quality"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <input type="submit" />
          </form>
        </div>

        <div className={styles.home}>
          <div className={styles.Market}>
            <h1>Market</h1>
            {market.map((d) => (
              <div className={styles.MarketItem}>
                <h3>Name : {d.item_id} </h3>
                <h3>Quality : {d.quality} </h3>
                <h3>Buy : {d.buy_price_min} </h3>
                <h3
                  onClick={() =>
                    setProfite({ ...profite, sell: d.sell_price_min })
                  }
                >
                  Sell : {d.sell_price_min}{" "}
                </h3>
              </div>
            ))}
          </div>
          <div className={styles.BlackMarket}>
            <h1>Black MArket</h1>
            {bmarket.map((d) => (
              <div className={styles.MarketItem}>
                <h3>Name : {d.item_id} </h3>
                <h3>Quality : {d.quality} </h3>
                <h3
                  onClick={() =>
                    setProfite({ ...profite, buy: d.buy_price_min })
                  }
                >
                  Buy : {d.buy_price_min}{" "}
                </h3>
                <h3>Sell : {d.sell_price_min} </h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
