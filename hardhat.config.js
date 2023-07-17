require("@nomicfoundation/hardhat-toolbox");
const dotenv = require("dotenv")

dotenv.config()

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  networks: {
    sepolia: {
      url: `https://sepolia.infura.io/v3/${process.env.API_KEY}`,
      accounts: [process.env.PK]
    },
    goerli: {
      url: `https://goerli.infura.io/v3/${process.env.API_KEY}`,
      accounts: [process.env.PK]
    }
  }
};
