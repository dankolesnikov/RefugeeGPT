import { Title } from "@mantine/core";
import Head from "next/head";

const AboutPage = () => {
  const pageNameAbout = "About RefugeeGPT";

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
        <meta name="og:title" content={pageNameAbout} />
        <meta name="twitter:card" content="summary_large_image" />
        <title>{pageNameAbout}</title>
      </Head>
    </>
  );
};

export default AboutPage;
