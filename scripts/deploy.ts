// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";

async function main() {
  const [owner] = await ethers.getSigners();

  const Sandwich = await ethers.getContractFactory("Sandwich");

  const sandwich = await Sandwich.deploy(owner.address);

  console.log("Sandwich deployed to:", sandwich.address);

  const receipt = await sandwich.deployTransaction.wait();

  console.log(`Tx ${receipt.transactionHash}, gas used: ${receipt.gasUsed}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
