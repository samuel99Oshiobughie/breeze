import Layout from "@/layout/layout"
import dynamic from "next/dynamic";

const SettingsPage = dynamic(() => 
  import('./components/settingsPage'),
  {ssr: false}
);


const Page = () => {
  return(
  <Layout>
  <SettingsPage />
  </Layout>
  )
};

export default Page;

