import Head from "next/head"; // ====================================================================

export interface SEOProps {
  title: string;
  description?: string;
  sitename?: string;
}

// ====================================================================
const SEO = ({
  title,
  description,
  sitename = "CÔNG TY THIẾT BỊ VẬT TƯ NHA KHOA CÔNG BÌNH",
}: SEOProps) => {
  return (
    <Head>
      <title>{`${title} | ${sitename}`}</title>
      <meta name="description" content={description} />
    </Head>
  );
};

export default SEO;
