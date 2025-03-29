import dynamic from "next/dynamic";

const GoalsPage = dynamic(() => 
  import('./components/goalsPage'),
  {ssr: false}
);


const Page = () => {
  return(
  <GoalsPage/>
  )
};

export default Page;

