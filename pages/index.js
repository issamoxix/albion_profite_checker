import Head from "next/head";
import { useCallback, useEffect, useRef, useState } from "react";
import styles from "../styles/Home.module.css";
import toast, { Toaster } from "react-hot-toast";
import { ItemsData } from "../data/items";
import { SearchItems } from "../data/formated_items";
import Navbar from "../Components/Navbar";

export default function Home() {
  const [item, setItem] = useState("T4_ARMOR_LEATHER_SET2");
  const [lenprof, setlenprof] = useState(0);
  const [data, setData] = useState([]);
  const [bmarket, setbmarket] = useState([]);
  const [market, setmarket] = useState([]);
  const [from, setfrom] = useState(1000);
  const [to, setto] = useState(2000);
  const [more, setMore] = useState(false);
  const [profi, setpro] = useState(500);
  const [q, setQ] = useState();
  const [buyp, setbuy] = useState(0);

  const locations = ["Black Market", "Caerleon"];
  useEffect(() => {
    setto(parseInt(from) + 1000);
  }, [from]);
  const Totale = [...market, ...bmarket];
  const get_Date = () => {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();

    today = yyyy + "-" + mm + "-" + dd;
    return today;
  };
  const fetch_data = async (items, q, auto = false) => {
    const toastId = !auto && toast.loading("Loading...");
    const res = await fetch(
      `/api/hello?items=${items}&locations=${locations.toString()}&q=${q}`
    );
    const json = await res.json();
    json.map((d) => {
      if (
        d.city == "Black Market" &&
        d.buy_price_max_date.includes(get_Date())
      ) {
        setbmarket((f) => [...f, d]);
      } else if (d.sell_price_min_date.includes(get_Date())) {
        setmarket((f) => [...f, d]);
      }
    });

    setData(json);
    !auto && toast.success("Done !", { id: toastId });
  };
  const get_items = (data) => {
    let totale = [];

    for (let i = 0; i < Object.keys(data).length - 1; i++) {
      totale.push(data[Object.keys(data)[i]].toString());
    }

    setItem(totale.toString());
  };
  const handlemessage = () => {
    let loading = toast.loading("Loading ...", {
      style: {
        position: "absolute",
        right: "0%",
      },
    });
    return loading;
  };
  const MasseSearch = async (man, tal) => {
    let arr = ItemsData.split(",");
    // console.log(man, tal);
    // console.log(arr.slice(man, tal));
    if (tal >= to || tal >= arr.length) {
      return toast.success(`Automated Programme Stoped`, {
        id: handlemessage(),
        style: {
          position: "absolute",
          right: "0%",
        },
      });
    }
    await fetch_data(arr.slice(man, tal).toString(), q, true);
    toast.success(`Progress  ${tal}/${to} `, {
      style: {
        position: "absolute",
        right: "0%",
      },
    });
    // setfrom(to);
    // setto(to + 20);
    MasseSearch(tal, tal + 20);
  };
  const Itemprofite = useCallback(({ haja }) => {
    const [select, setSelect] = useState(false);
    return (
      <div
        onClick={() => setSelect(!select)}
        className={`${styles.bodyitemprofite} ${
          select && styles.selecteditem
        } `}
      >
        <span
          onClick={() => {
            navigator.clipboard.writeText(SearchItems[haja.name]);
            toast.success("Copied");
          }}
        >
          {" "}
          {SearchItems[haja.name]}{" "}
        </span>
        <span>
          En( {haja.name.split("@")[1] ? haja.name.split("@")[1] : 0} )
        </span>
        <span style={{ color: parseInt(haja.quality) == 1 && "red" }}>
          Q: {haja.quality}{" "}
        </span>
        <span
          onClick={() => {
            navigator.clipboard.writeText(haja.Buy);
            toast.success("Copied");
          }}
          style={{
            color:
              (parseInt(buyp) > 0) & (parseInt(haja.buy) <= parseInt(buyp)) &&
              "red",
          }}
        >
          Buy(<b>{haja.Buy}</b>){" "}
        </span>
        <span
          onClick={() => {
            navigator.clipboard.writeText(haja.Sell);
            toast.success("Copied");
          }}
          style={{ color: parseInt(haja.Sell) / 10000 < 10 && "blue" }}
        >
          Sell(<b>{haja.Sell}</b>)
        </span>
        <span
          style={{
            color:
              parseInt(haja.profite.toFixed(2)) / parseInt(profi) < 10 && "red",
          }}
        >
          Profite(<b>{haja.profite.toFixed(2)}</b>){" "}
        </span>
      </div>
    );
  }, []);
  let chanta = [];
  const handlecalc = (profite = 500) => {
    let bag = {};

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
          bag[d.item_id][`Q_${d.quality}`]["prices"]["Profite"] >=
            parseInt(profite) &&
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
    // console.log(bag);
    return chanta;
  };
  useEffect(() => {
    setlenprof(chanta.length);
  }, [chanta]);
  const [mode, setmode] = useState(false);
  return (
    <div className={`${mode ? styles.light : styles.dark}`}>
      <Head>
        <title>
          {" "}
          {lenprof != 0 ? `(${lenprof})` : ""} Albion Black Market heaven
        </title>
        <link rel="icon" href="/albion.png" />
        {/* <!-- Global site tag (gtag.js) - Google Analytics --> */}
      </Head>
      <div className={`${styles.container} ${!more && styles.flex}`}>
        <Navbar setmode={setmode} styles={styles} mode={mode} />
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
                placeholder="Quality from 1 to 5"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
              <input type="submit" value="Search" />
              {/* <textarea
                placeholder="Json of Items from github"
                value={area}
                onChange={(e) => setarea(e.target.value)}
              ></textarea> */}
            </form>
            <form onSubmit={(e) => e.preventDefault()}>
              {/* <button onClick={() => get_items(JSON.parse(area))}>
              Masse Search
            </button> */}
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
              <input
                type="text"
                placeholder="Profite 500"
                onChange={(e) => setpro(e.target.value)}
              />
              <input
                type="text"
                placeholder="Buy power"
                onChange={(e) => setbuy(e.target.value)}
              />
              <button
                onClick={() => {
                  MasseSearch(parseInt(from), parseInt(from) + 20);
                  handlemessage();
                }}
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
            </form>
          </div>
        </div>
        {Totale.length > 0 && (
          <div className={styles.bodyprofite}>
            <img
              onClick={() => setMore(!more)}
              className={styles.moresvg}
              src="/svgs/down.svg"
              alt="Stretch"
            />
            {handlecalc(profi).map((d) => (
              <Itemprofite haja={d} />
            ))}
          </div>
        )}

        {/* <div className={styles.home}>
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
       */}
      </div>
      <Toaster />
    </div>
  );
}
