import Layout from "@/layout/layout"
import dynamic from "next/dynamic";

const TasksPage = dynamic(() => 
  import('./components/tasksPage'),
  {ssr: false}
);


const Page = () => {
  return(
  <Layout>
  <TasksPage/>
  </Layout>
  )
};

export default Page;

