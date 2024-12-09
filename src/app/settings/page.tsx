import { getAll } from "@vercel/edge-config";
import FormWrapper from "./formWrapper";

async function Settings() {
  const data = await getAll();
  const edgeConfigId = process.env.EDGE_CONFIG_ID;
  const vecelAPIToken = process.env.VECEL_API_ACCESS_TOKEN;
  return (
    <FormWrapper
      data={data}
      edgeConfigId={edgeConfigId}
      vecelAPIToken={vecelAPIToken}
    />
  );
}

export default Settings;
