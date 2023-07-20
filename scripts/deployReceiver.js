// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  const Receiver = await hre.ethers.getContractFactory("Receiver")
  // Sepolia ChainID: 10161.
  // LZ Endpoint address on Sepolia.
  const endpoint = "0xae92d5aD7583AD66E49A0c67BAd18F6ba52dDDc1"
  const receiver = await Receiver.deploy(endpoint)

  console.log(`Receiver deployed to Sepolia @ ${await receiver.getAddress()}.`)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
