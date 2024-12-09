import { getAll } from "@vercel/edge-config";
import FetchData from "./fetchData";

async function Settings() {
  const data = await getAll();
  return <FetchData config={data} />;
}

export default Settings;
