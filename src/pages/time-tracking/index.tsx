import Layout from "@/layout/layout"
import dynamic from "next/dynamic";

const TimeTrackingPage = dynamic(() => 
  import('./components/time-trackingPage'),
  {ssr: false}
);


const Page = () => {
  return(
  <Layout>
  <TimeTrackingPage />
  </Layout>
  )
};

export default Page;

