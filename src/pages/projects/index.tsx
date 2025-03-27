import Layout from "@/layout/layout"
import dynamic from "next/dynamic";

const ProjectPage = dynamic(() => 
  import('./components/projectPage'),
  {ssr: false}
);


const Page = () => {
  return(
  <Layout>
  <ProjectPage />
  </Layout>
  )
};

export default Page;

