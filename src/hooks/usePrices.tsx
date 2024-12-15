import { get } from "lodash";
import { useEffect, useState } from "react";

export default function useETHPrice() {
  const [ethPrice, setEthPrice] = useState<number | null>(null);

  useEffect(() => {
    const weth = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";
    fetch(
      `https://api.geckoterminal.com/api/v2/simple/networks/eth/token_price/${weth}`
    )
      .then((res) => res.json())
      .then((data) => {
        setEthPrice(get(data, `data.attributes.token_prices.${weth}`));
      });
  }, []);

  return {
    ethPrice: Number(ethPrice),
  };
}
