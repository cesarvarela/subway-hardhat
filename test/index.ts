import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { ERC20, WETH9, IUniswapV2Factory, IUniswapV2Pair, IUniswapV2Router02 } from "../typechain";
import addresses from "../src/addresses";
import { abi as WETH9_ABI } from "@uniswap/v2-periphery/build/WETH9.json";
import { abi as ERC20_ABI } from "@openzeppelin/contracts/build/contracts/ERC20.json";
import { abi as UNISWAPV2_FACTORY_ABI } from "@uniswap/v2-core/build/UniswapV2Factory.json";
import { abi as UNISWAPV2_PAIR_ABI } from "@uniswap/v2-core/build/UniswapV2Pair.json";
import { abi as UNISWAPV2_ROUTER02_ABI } from "@uniswap/v2-periphery/build/UniswapV2Router02.json";

describe("Sandwich", function () {
  let weth: WETH9;
  let usdc: ERC20;
  let owner: SignerWithAddress;
  let wethUsdcPair: IUniswapV2Pair;
  let univ2Router: IUniswapV2Router02;
  let univ2Factory: IUniswapV2Factory;

  beforeEach(async () => {
    weth = (await ethers.getContractAt(WETH9_ABI, addresses.WETH)) as WETH9;

    await weth.deposit({ value: ethers.utils.parseEther("1.0") });

    usdc = (await ethers.getContractAt(ERC20_ABI, addresses.USDC)) as ERC20;

    univ2Factory = (await ethers.getContractAt(UNISWAPV2_FACTORY_ABI, addresses.UNISWAPV2_FACTORY)) as IUniswapV2Factory;

    const address = await univ2Factory.getPair(weth.address, usdc.address);

    wethUsdcPair = (await ethers.getContractAt(UNISWAPV2_PAIR_ABI, address)) as IUniswapV2Pair;

    univ2Router = (await ethers.getContractAt(UNISWAPV2_ROUTER02_ABI, addresses.UNISWAPV2_ROUTER02)) as IUniswapV2Router02;

    [owner] = await ethers.getSigners();
  });

  it("test_sandwich_frontslice_router", async () => {
    await weth.approve(univ2Router.address, ethers.constants.MaxUint256);

    const path = [weth.address, usdc.address];

    const timestamp = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp;

    const tx = await univ2Router.swapExactTokensForTokens(ethers.utils.parseEther("1.0"), 0, path, owner.address, timestamp + 100);

    const receipt = await tx.wait();

    expect(receipt.gasUsed).to.eq(125389);
  });
});
