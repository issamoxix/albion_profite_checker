import Head from "next/head";
import { useState } from "react";
import styles from "../styles/Home.module.css";
import toast, { Toaster } from "react-hot-toast";
import { ItemsData } from "../data/items";

export default function Home() {
  const [item, setItem] = useState("T4_ARMOR_LEATHER_SET2");
  const [area, setarea] = useState();
  const [profite, setProfite] = useState({});
  const [data, setData] = useState([]);
  const [bmarket, setbmarket] = useState([]);
  const [market, setmarket] = useState([]);
  const [from, setfrom] = useState();
  const [to, setto] = useState();

  const [q, setQ] = useState();
  const locations = ["Black Market", "Caerleon"];

  const Totale = [...market, ...bmarket];

  const fetch_data = async (items, q) => {
    const toastId = toast.loading("Loading...");
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
    toast.success("Done !", { id: toastId });
  };
  const get_items = (data) => {
    let totale = [];

    for (let i = 0; i < Object.keys(data).length - 1; i++) {
      totale.push(data[Object.keys(data)[i]].toString());
    }

    setItem(totale.toString());
  };
  const MasseSearch = async (man, tal) => {
    let arr = ItemsData.split(",");
    // console.log(man, tal);
    // console.log(arr.slice(man, tal));
    if (tal >= to) {
      return toast.success(`Automated Programme Stoped`);
    }
    await fetch_data(arr.slice(man, tal).toString(), q);
    toast.success(`Progress  ${tal}/${to} `);
    // setfrom(to);
    // setto(to + 20);
    MasseSearch(tal, tal + 20);
  };
  const Itemprofite = ({ haja }) => {
    const [select, setSelect] = useState(false);
    return (
      <div
        onClick={() => setSelect(!select)}
        className={`${styles.bodyitemprofite} ${
          select && styles.selecteditem
        } `}
      >
        <span> {haja.name} </span>
        <span>Q: {haja.quality} </span>
        <span>
          Buy(<b>{haja.Buy}</b>){" "}
        </span>
        <span>
          Sell(<b>{haja.Sell}</b>)
        </span>
        <span>
          Profite(<b>{haja.profite.toFixed(2)}</b>){" "}
        </span>
      </div>
    );
  };
  const handlecalc = () => {
    let bag = {};
    let chanta = [];
    Totale.map((d) => {
      if (bag[d.item_id] === undefined) {
        bag[d.item_id] = {};
      }
      if (bag[d.item_id][`Q_${d.quality}`] === undefined) {
        bag[d.item_id][`Q_${d.quality}`] = { prices: {} };
      }

      if (d.city == "Black Market") {
        bag[d.item_id][`Q_${d.quality}`]["prices"]["BM"] = d.buy_price_max;
      } else {
        bag[d.item_id][`Q_${d.quality}`]["prices"]["CM"] = d.sell_price_min;
      }
      if (
        bag[d.item_id][`Q_${d.quality}`]["prices"]["BM"] !== undefined &&
        bag[d.item_id][`Q_${d.quality}`]["prices"]["CM"] !== undefined
      ) {
        bag[d.item_id][`Q_${d.quality}`]["prices"]["Profite"] =
          bag[d.item_id][`Q_${d.quality}`]["prices"]["BM"] -
          bag[d.item_id][`Q_${d.quality}`]["prices"]["CM"] -
          bag[d.item_id][`Q_${d.quality}`]["prices"]["BM"] * 0.06;
        if (
          bag[d.item_id][`Q_${d.quality}`]["prices"]["Profite"] >= 500 &&
          bag[d.item_id][`Q_${d.quality}`]["prices"]["CM"] != 0
        ) {
          chanta.push({
            name: d.item_id,
            quality: d.quality,
            Buy: bag[d.item_id][`Q_${d.quality}`]["prices"]["CM"],
            Sell: bag[d.item_id][`Q_${d.quality}`]["prices"]["BM"],
            profite: bag[d.item_id][`Q_${d.quality}`]["prices"]["Profite"],
          });
        }
      }
    });

    return chanta;
  };
  return (
    <div className={styles.container}>
      <Head>
        <title>Albion Black Market heaven</title>
        <link rel="icon" href="/albion.png" />
      </Head>
      <div className={styles.container}>
        <div className={styles.profite}>
          <h1 onClick={() => handlecalc()}>
            Profite is {profite.buy - profite.sell - profite.buy * 0.06}{" "}
          </h1>
          <button onClick={() => setProfite({})}>Reset</button>
        </div>
        <div className={styles.body}>
          <div className={styles.bodyform}>
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
              <textarea
                value={area}
                onChange={(e) => setarea(e.target.value)}
              ></textarea>
            </form>
            <button onClick={() => get_items(JSON.parse(area))}>
              Masse Search
            </button>
            <input
              type="text"
              placeholder="From"
              value={from}
              onChange={(e) => setfrom(e.target.value)}
            />
            <input
              type="text"
              placeholder="To"
              value={to}
              onChange={(e) => setto(e.target.value)}
            />
            <button
              onClick={() => MasseSearch(parseInt(from), parseInt(from) + 20)}
            >
              Automate
            </button>
            <button
              onClick={() => {
                setmarket([]);
                setbmarket([]);
              }}
            >
              Reset Search
            </button>
          </div>
          <div className={styles.bodyprofite}>
            {handlecalc().map((d) => (
              <Itemprofite haja={d} />
            ))}
          </div>
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
                    setProfite({ ...profite, buy: d.buy_price_max })
                  }
                >
                  Buy : {d.buy_price_max}{" "}
                </h3>
                <h3>Sell : {d.sell_price_min} </h3>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
}
