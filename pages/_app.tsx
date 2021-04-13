import { AppProps } from 'next/app'
import Head from 'next/head'
import 'styles/globals.scss'

const App = ({ Component, pageProps }) => (
  <div>
    <Head>
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, shrink-to-fit=no"
      />
      {/* <link rel="shortcut icon" href="/favicon.png" key="shortcutIcon" /> */}
      {/* <link rel="manifest" href="/manifest.json" /> */}
    </Head>
    <Component {...pageProps} />
  </div>
)

export default App
