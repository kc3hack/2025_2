import "../components/collections.module.css"; // グローバルCSSを適用（今は仮でやってる）

export default function MyApp({ Component, pageProps }) {
    return <Component {...pageProps} />;
}