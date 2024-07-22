/** @format */

import Image from "next/image";
import styles from "./page.module.css";
import { LoginButton } from "./componets/buttons";

export default function Home() {
  return (
    <main className={styles.main}>
      <form className={"form"}>
        <input placeholder="Email" />
        <input placeholder="Password" />

        <div className="bottom">
          <LoginButton label="Google" provider="google" />
        </div>
      </form>
    </main>
  );
}
