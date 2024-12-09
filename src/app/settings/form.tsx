"use client";

import { Card } from "@/common/common";
import { Box, Button } from "@chakra-ui/react";

function Form({ data, edgeConfigId, vecelAPIToken }: any) {
  function save() {
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
        Authorization: `Bearer ${vecelAPIToken}`,
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
