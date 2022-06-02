import * as dotenv from "dotenv";

import { extendEnvironment, HardhatUserConfig } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";
import { logError } from "./src/logging";

dotenv.config();

const ENV_VARS = ["_HTTP", "_WSS", "_PRIVATE_KEY", "_FLASHBOTS_PRIVATE_KEY", "_SANDWICH_CONTRACT"];

extendEnvironment((hre) => {
  if (hre.network.name !== "hardhat") {
    const networkName = hre.network.name.toUpperCase();

    let hasEnv = true;

    for (let i = 0; i < ENV_VARS.length; i++) {
      const varName = `${networkName}${ENV_VARS[i]}`;

      if (!process.env[varName]) {
        logError(`Missing env var ${varName}`);
        hasEnv = false;
      }
    }

    if (!hasEnv) {
      // eslint-disable-next-line no-process-exit
      process.exit(1);
    }
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
  solidity: "0.8.4",
  networks: {
    goerli: {
      url: process.env.GOERLI_HTTP,
      accounts: [process.env.GOERLI_PRIVATE_KEY!],
    },
    hardhat: {
      forking: {
        url: String(process.env.MAINNET_RPC),
      },
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  typechain: {
    externalArtifacts: [
      "node_modules/@uniswap/v2-core/build/**/!(Combined)*.json",
      "node_modules/@uniswap/v2-periphery/build/**/!(Combined)*.json",
    ],
  },
};

export default config;
