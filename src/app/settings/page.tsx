import { getAll } from "@vercel/edge-config";
import FormWrapper from "./formWrapper";

async function Settings() {
  const data = await getAll();
  return <FormWrapper data={data} />;
}

export default Settings;
