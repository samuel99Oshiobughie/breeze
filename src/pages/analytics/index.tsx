import Layout from "@/layout/layout"
import dynamic from "next/dynamic";

const AnalyticsPage = dynamic(() => 
  import('./components/analyticsPage'),
  {ssr: false}
);


const Page = () => {
  return(
  <Layout>
  <AnalyticsPage/>
  </Layout>
  )
};

export default Page;

