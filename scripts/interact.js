const { ethers } = require("ethers");
const hre = require("hardhat");

async function main() {
    const LayerZeroDemo1 = await hre.ethers.getContractFactory("LayerZeroDemo1");
    const layerZeroDemo1 = await LayerZeroDemo1.attach(
        "0xaea41C127A1Ff7bd75b3eCcDf394AF7015be26a4"
    );
    const fees = await layerZeroDemo1.estimateFees(
        10009,
        "0x9912Bd35e5521Add4180e447c0E236272f51867a",
        "0x009912Bd35e5521Add4180e447c0E236272f51867a",
        false,
        "0x009912Bd35e5521Add4180e447c0E236272f51867a"
    );
    console.log(ethers.utils.formatEther(fees[0].toString()));
    await layerZeroDemo1.sendMsg(
        10009,
        "0x9912Bd35e5521Add4180e447c0E236272f51867a",
        ethers.encodeBytes32String("Hello LayerZero"),
        { value: ethers.utils.parseEther("0") }
    );
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
