const { ethers } = require("ethers")

const provider = new ethers.JsonRpcProvider("https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161")

const getCounts = async () => {
    const { abi: senderAbi } = require("../artifacts/contracts/Sender.sol/Sender.json")
    const Sender = new ethers.Contract("0x63D20e6810927977aE7c16DD8f3b5F7f319EDF7C", senderAbi, provider)
    console.log(await Sender.getCounts())
}

getCounts()