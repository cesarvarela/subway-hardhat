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

  async function getSandwichPayload() {
    const wethAddress = weth.address;
    const path = [weth.address, usdc.address];
    const amountIn = ethers.utils.parseEther("1.0");
    const amountOut = (await univ2Router.getAmountsOut(amountIn, path))[1];
    const tokenOutNo = usdc.address < weth.address ? 0 : 1;

    return ethers.utils.solidityPack(["bytes20", "bytes20[]", "uint128", "uint128", "uint8"], [wethAddress, path, amountIn, amountOut, tokenOutNo]);
  }

  async function deploySandwich(address: string) {
    return await (await ethers.getContractFactory("Sandwich")).deploy(address);
  }

  beforeEach(async () => {
    [owner] = await ethers.getSigners();

    weth = (await ethers.getContractAt(WETH9_ABI, addresses.WETH)) as WETH9;

    await weth.deposit({ value: ethers.utils.parseEther("1.0") });

    usdc = (await ethers.getContractAt(ERC20_ABI, addresses.USDC)) as ERC20;

    univ2Factory = (await ethers.getContractAt(UNISWAPV2_FACTORY_ABI, addresses.UNISWAPV2_FACTORY)) as IUniswapV2Factory;

    const address = await univ2Factory.getPair(weth.address, usdc.address);

    wethUsdcPair = (await ethers.getContractAt(UNISWAPV2_PAIR_ABI, address)) as IUniswapV2Pair;

    univ2Router = (await ethers.getContractAt(UNISWAPV2_ROUTER02_ABI, addresses.UNISWAPV2_ROUTER02)) as IUniswapV2Router02;
  });

  it("Should use 125389 gas", async () => {
    await weth.approve(univ2Router.address, ethers.constants.MaxUint256);

    const path = [weth.address, usdc.address];

    const timestamp = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp;

    const tx = await univ2Router.swapExactTokensForTokens(ethers.utils.parseEther("1.0"), 0, path, owner.address, timestamp + 100);

    const receipt = await tx.wait();

    expect(receipt.gasUsed).to.eq(125389);
  });

  it("Should use 40387 gas", async () => {
    const sandwich = await deploySandwich(owner.address);

    await weth.transfer(sandwich.address, ethers.utils.parseEther("1.0"));

    const data = await getSandwichPayload();

    const tx = await owner.sendTransaction({ to: sandwich.address, data });

    const receipt = await tx.wait();

    expect(receipt.gasUsed).to.eq(40387); // whatever the hell happens in that contract takes 3 times less gas 😱
  });

  it("Should revert if not owner ", async () => {
    const sandwich = await deploySandwich(ethers.constants.AddressZero);

    const data = await getSandwichPayload();

    await expect(owner.sendTransaction({ to: sandwich.address, data })).to.be.reverted;
  });

  //moar tests to come?
});
