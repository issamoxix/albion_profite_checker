import Head from "next/head";
import React from "react";
import styles from "../styles/Home.module.css";

function landing() {
  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Ubuntu&display=swap"
          rel="stylesheet"
        />
      </Head>
      <div className={styles.landingContainer}>
        <div className={styles.landingContainerWrapper}>
          <div className={styles.landingHeader}>
            <h1>Black Market Profite Checker</h1>
            <h3>
              Amet nulla et Lorem quis Lorem. Nisi adipisicing ea irure duis
              nulla ex do anim reprehenderit. Sint tempor mollit cupidatat
              veniam excepteur sint laborum qui amet veniam fugiat duis anim.
              Veniam Lorem reprehenderit laboris do ipsum veniam cillum aliquip
              nisi adipisicing mollit dolor.
            </h3>
          </div>

          <div className={`${styles.body} ${styles.bodyLanding} `}>
            <div className={styles.bodyform}>
              <input type="text" placeholder="Items" />
              <input type="text" placeholder="Items" />
              <input type="text" placeholder="Items" />
              <input type="text" placeholder="Items" />
              <button className={styles.bodyLandingButton}>Automate</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default landing;
