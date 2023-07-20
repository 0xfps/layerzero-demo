const { ethers } = require("ethers")
const dotenv = require("dotenv")

dotenv.config

const goerliProvider = new ethers.JsonRpcProvider("https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161")
const sepoliaProvider = new ethers.JsonRpcProvider("https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161")
const goerliSigner = new ethers.Wallet(process.env.PK, goerliProvider)
const sepoliaSigner = new ethers.Wallet(process.env.PK, sepoliaProvider)

let Sender, Receiver

const getNames = async () => {
    const { abi: senderAbi } = require("../artifacts/contracts/Sender.sol/Sender.json")
    Sender = new ethers.Contract("0x3ACc9B365aB90742659161Cc10e40E6DD664147F", senderAbi, goerliProvider)

    const { abi: receiverAbi } = require("../artifacts/contracts/Receiver.sol/Receiver.json")
    Receiver = new ethers.Contract("0x98Ec13F3368C7256c7DEbAE9DD1ebB8DB6648B5C", receiverAbi, sepoliaProvider)

    const senderContractName = await Sender.name()
    const receiverContractName = await Receiver.name()

    console.log(`Goerli deployed name ${senderContractName}; Sepolia deployed name ${receiverContractName}.`)
}

const estimateFees = async () => {
    const chainId = 10161
    const receiver = "0x98Ec13F3368C7256c7DEbAE9DD1ebB8DB6648B5C"
    const payload = "0x98Ec13F3368C7256c7DEbAE9DD1ebB8DB6648B5C"
    const payInZRO = false
    const adapterParams = "0x00010000000000000000000000000000000000000000000000000000000000030d40"

    const estimate = await Sender.estimateFees(
        chainId,
        receiver,
        payload,
        payInZRO,
        adapterParams
    )

    console.log(ethers.formatEther(estimate[0]))
    // 0.000004972713175275 ETH.
}

const sendMessage = async () => {
    const chainId = 10161
    const destination = ethers.solidityPacked(
        ["address", "address"],
        ["0x98Ec13F3368C7256c7DEbAE9DD1ebB8DB6648B5C", "0x3ACc9B365aB90742659161Cc10e40E6DD664147F"]
    )
    const payload = "0x3ACc9B365aB90742659161Cc10e40E6DD664147F"

    const sendMsg = await Sender.sendMsg.populateTransaction(
        chainId,
        destination,
        payload,
        { value: ethers.parseEther("0.01") }
    )

    const sendTxn = await goerliSigner.sendTransaction(sendMsg)

    await printCounts()
}

const printCounts = async () => {
    const senderCounts = await Sender.getCounts()
    const receiverCounts = await Receiver.getCounts()

    console.log(`Sender: Sent ${senderCounts[0]}, Received ${senderCounts[1]}`)
    console.log(`Receiver: Sent ${receiverCounts[0]}, Received ${receiverCounts[1]}`)
}

getNames()
estimateFees()
sendMessage()

// Messaging Library: https://goerli.etherscan.io/address/0x6f3a314C1279148E53f51AF154817C3EF2C827B1#code