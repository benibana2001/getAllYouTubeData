import * as React from "react";
import { Store } from "../store";
import styles from "./css/pickup.module.css"

export default function Pickup({ store }: { store: Store }) {
  return (
    <div className={styles.pickup}>
      <div className={styles.card}>動画1</div>
      <div className={styles.card}>動画2</div>
      <div className={styles.card}>動画3</div>
      <div className={styles.card}>動画4</div>
      <div className={styles.card}>動画5</div>
      <div className={styles.card}>動画6</div>
      <div className={styles.card}>動画7</div>
      <div className={styles.card}>動画8</div>
    </div>
  );
};

