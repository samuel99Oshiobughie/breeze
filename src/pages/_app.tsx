import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Script from "next/script";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { StoreProvider } from 'easy-peasy'
import { BreezeStore } from "@/store/BreezeStore";
import SnackbarComponent from "@/components/snackBar";
import Head from "next/head";

const theme = createTheme({
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          color: 'var(--foreground)',
          backgroundColor: 'var(--background)',
        },
      },
    },
  },
});

const measurementID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS;

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      { measurementID && (
        <>
          <Script
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${measurementID}`}
          />
          <Script
              id="google-analytics"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${measurementID}', {
                    page_path: window.location.pathname,
                  });
                `,
              }}
            />
        </>
      )}

      <ThemeProvider theme={theme}>
        <CssBaseline /> 
        <StoreProvider store={BreezeStore}>
          <Component {...pageProps} />
          <SnackbarComponent />
        </StoreProvider>
      </ThemeProvider>
    </>
  );  
}
