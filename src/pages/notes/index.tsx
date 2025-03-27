import Layout from "@/layout/layout"
import dynamic from "next/dynamic";

const NotePage = dynamic(() => 
  import('./components/notePage'),
  {ssr: false}
);


const Page = () => {
  return(
  <Layout>
  <NotePage />
  </Layout>
  )
};

export default Page;