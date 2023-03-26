import type { AppProps } from "next/app";
import './../styles/LoginForm.css';

export default function App({ Component, pageProps }: AppProps) {
    return <Component {...pageProps} />;
}
