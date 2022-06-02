import abiDecoder from "abi-decoder";
import { abi as UNISWAPV2_ROUTER02_ABI } from "@uniswap/v2-periphery/build/UniswapV2Router02.json";

// Easily decode UniswapV2 Router data
abiDecoder.addABI(UNISWAPV2_ROUTER02_ABI);

// Only does swapExactETHForTokens
// You'll need to extend it yourself :P
export const parseUniv2RouterTx = (txData: string) => {
  let data = null;
  try {
    data = abiDecoder.decodeMethod(txData);
  } catch (e) {
    return null;
  }

  if (data.name !== "swapExactETHForTokens") {
    return null;
  }

  const [amountOutMin, path, to, deadline] = data.params.map((x: any) => x.value);

  return {
    amountOutMin,
    path,
    to,
    deadline,
  };
};
