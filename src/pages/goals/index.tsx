import Layout from "@/layout/layout"
import dynamic from "next/dynamic";

const GoalsPage = dynamic(() => 
  import('./components/goalsPage'),
  {ssr: false}
);


const Page = () => {
  return(
  // <Layout>
  // </Layout>
  <GoalsPage/>
  )
};

export default Page;

