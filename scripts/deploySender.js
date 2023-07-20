// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  const Sender = await hre.ethers.getContractFactory("Sender")
  // Goerli ChainID : 10121.
  // LZ Endpoint address on Goerli.
  const endpoint = "0xbfD2135BFfbb0B5378b56643c2Df8a87552Bfa23"
  const sender = await Sender.deploy(endpoint)

  console.log(`Sender deployed to Goerli @ ${await sender.getAddress()}.`)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
