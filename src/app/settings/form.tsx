"use client";

import { Card } from "@/common/common";
import { projectId } from "@/config/web3modal";
import { Box, Button } from "@chakra-ui/react";

function Form({ data }: { data: any }) {
  // data: {"pool":"0x417b80C8c11f05097039198Aa714e068aE9daa0E","poolAddressesProvider":"0x4208C0f3FB8988BfFa260573Ec8dE51fD4896D37","poolCore":"0xfe9517F1A0F46e105c02c99de8FB18CAF3d197AB","priceOracle":"0x16BC76613aC12540Cc87377bff3ebAD37B2aD9CF"}
  function save() {
    // To add an item to or update an item in your Edge Config, send a PATCH request to the edge-config endpoint, appending /your_edge_config_id_here/items to the end.

    // If you're requesting an Edge Config scoped to a team, add ?teamId= to the end of the endpoint, pasting the Vercel Team's ID after the = symbol.

    // Your URL should look like this:
    // 'https://api.vercel.com/v1/edge-config/your_edge_config_id_here/items?teamId=your_team_id_here';
    const edgeConfigId = process.env.NEXT_PUBLIC_EDGE_CONFIG_ID;
    const url = `https://api.vercel.com/v1/edge-config/${edgeConfigId}/items`;
    const updatedData = JSON.parse(
      document.querySelector("pre")?.innerText || "{}"
    );

    const mappedData = Object.keys(updatedData).map((key) => ({
      operation: "update",
      key: key,
      value: updatedData[key],
    }));

    fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_VECEL_API_ACCESS_TOKEN}`,
      },
      body: JSON.stringify({ items: mappedData }),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.error) {
          alert("Error saving config: " + result.error.message);
          return;
        }
        alert("Config saved successfully");
      });
  }
  return (
    <Card>
      <Box as="pre" contentEditable suppressContentEditableWarning>
        {JSON.stringify(data, null, 2)}
      </Box>
      <Box mt={4}>
        <Button onClick={save} size="sm" variant="outline">
          Save
        </Button>
      </Box>
    </Card>
  );
}

export default Form;
