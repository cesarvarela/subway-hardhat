import hre from "hardhat";
import { abi as UNISWAPV2_PAIR_ABI } from "@uniswap/v2-core/build/UniswapV2Pair.json";

// Contracts
export const CONTRACTS = {
  UNIV2_ROUTER: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",

  // Sandwich contract
  SANDWICH: process.env.SANDWICH_CONTRACT,
};

// Helpful tokens for testing
export const TOKENS = {
  WETH: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
  USDC: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
};

// Providers
export const provider = hre.ethers.getDefaultProvider();
export const wssProvider = new hre.ethers.providers.WebSocketProvider(process.env.GOERLI_WSS!);

// Used to send transactions, needs ether
export const searcherWallet = new hre.ethers.Wallet(process.env.GOERLI_PRIVATE_KEY!, wssProvider);

// Used to sign flashbots headers doesn't need any ether
export const authKeyWallet = new hre.ethers.Wallet(process.env.GOERLI_PRIVATE_KEY!, wssProvider);

// Common contracts
export const uniswapV2Pair = new hre.ethers.Contract(hre.ethers.constants.AddressZero, UNISWAPV2_PAIR_ABI, searcherWallet);
