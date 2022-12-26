// used for each page to define the title showed in the tab
import Head from "next/head";

export default function PageTitle({ title }) {
  return (
    <Head>
      <title>{title + " | Vinaa"}</title>
    </Head>
  );
}
