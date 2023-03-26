import { AppProps } from "next/app";
import Head from "next/head";
import { MantineProvider, MantineThemeOverride } from "@mantine/core";
import React from "react";

export default function App(props: AppProps) {
  const { Component, pageProps } = props;
  const theme: MantineThemeOverride = {
    primaryColor: "dark",
    fontFamily:
      "Inter,-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue,Arial, Noto Sans",
  };
  const pageName = "RefugeeGPT - AI Assistant for Refugees";
  return (
    <>
      <Head>
        <link rel="icon" href="favicon/favicon.ico" />
        <link rel="icon" sizes="32x32" href="favicon/favicon-32x32.png" />
        <link rel="icon" sizes="16x16" href="favicon/favicon-16x16.png" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />

        <link rel="icon" href="favicon/favicon.ico" />
        <link rel="icon" href="favicon/favicon.ico" />
        <meta
          name="description"
          content="AI Assistant that helps refugees navigate a crises."
        />
        <meta name="og:title" content={pageName} />
        <meta name="twitter:card" content="summary_large_image" />
        <title>{pageName}</title>
      </Head>

      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          /** Put your mantine theme override here */
          colorScheme: "light",
          ...theme,
        }}
      >
        <Component {...pageProps} />
      </MantineProvider>
    </>
  );
}
