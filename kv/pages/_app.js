import "@/styles/globals.css";
import { Open_Sans } from "next/font/google";

const open = Open_Sans({ subsets: ["latin"] });

export default function App({ Component, pageProps }) {
  return (
    <div className={open.className}>
    <Component {...pageProps} />
  </div>
  );
}
