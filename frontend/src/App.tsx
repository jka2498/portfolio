import './App.css'
import { Layout } from "./components/Layout";
import { Overview } from "./components/Overview";
import { ExperiencesTable } from "./components/ExperiencesTable";
import { Storage } from "./components/Storage";

export default function App() {
  return (
    <Layout>
      <Overview />
      <ExperiencesTable />
      <Storage />
    </Layout>
  );
}
