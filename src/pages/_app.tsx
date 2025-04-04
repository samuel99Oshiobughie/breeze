import "@/styles/globals.css";
import type { AppProps } from "next/app";
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



export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
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
