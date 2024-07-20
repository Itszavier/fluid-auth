/** @format */

import Image from "next/image";
import styles from "./page.module.css";
import { LoginButton } from "./componets/buttons";

export default function Home() {
  return (
    <main className={styles.main}>
      <LoginButton label="Google" provider="google" />
    </main>
  );
}
