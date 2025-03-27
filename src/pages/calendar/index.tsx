import Layout from "@/layout/layout"
import dynamic from "next/dynamic";

const CalenderPage = dynamic(() => 
  import('./components/calenderPage'),
  {ssr: false}
);


const Page = () => {
  return(
  <Layout>
  <CalenderPage/>
  </Layout>
  )
};

export default Page;

