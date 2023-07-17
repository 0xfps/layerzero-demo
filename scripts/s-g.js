const { ethers } = require("ethers")
const dotenv = require("dotenv")

dotenv.config

const provider = new ethers.JsonRpcProvider("https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161")
const signer = new ethers.Wallet(process.env.PK, provider)

const getCounts = async () => {
    const { abi: senderAbi } = require("../artifacts/contracts/Sender.sol/Sender.json")
    const Sender = new ethers.Contract("0x63D20e6810927977aE7c16DD8f3b5F7f319EDF7C", senderAbi, provider)

    const { abi: receiverAbi } = require("../artifacts/contracts/Receiver.sol/Receiver.json")
    const Receiver = new ethers.Contract("0x143577C18586c96EDB680063FAFFAcb1F93Bff81", receiverAbi, provider)

    const [senderSentMsgCount, senderReceivedMsgCount] = await Sender.getCounts()
    console.log(`Sender :: Sent: ${senderSentMsgCount}, Received: ${senderReceivedMsgCount}`)

    const destChainId = 10161
    // const destination = "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4Ab8483F64d9C6d1EcF9b849Ae677dD3315835cb2"
    const destination = "0x143577C18586c96EDB680063FAFFAcb1F93Bff81"
    const payload = "0x00"
    const txSigner = Sender.connect(signer)
    const data = await txSigner.sendMsg(
        destChainId,
        "0x143577C18586c96EDB680063FAFFAcb1F93Bff81",
        ethers.encodeBytes32String("Hello LayerZero"),
        { value: ethers.parseEther("0") }
    )
}

getCounts()