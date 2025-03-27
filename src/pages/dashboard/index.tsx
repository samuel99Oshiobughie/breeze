import Layout from "@/layout/layout"
import dynamic from "next/dynamic";
import { useEffect } from "react";
import useBreezeHooks from '@/hooks/useBreezeHooks'

const DashboardPage = dynamic(() => 
  import('./components/dashboardPage'),
  {ssr: false}
);


const Page = () => {

  const {fetchAllTasks, fetchAllProjects} = useBreezeHooks();

  useEffect(() => {
    fetchAllTasks();
    // fetchAllProjects();
  }, []);

  return(
  <Layout>
  <DashboardPage/>
  </Layout>
  )
};

export default Page;

