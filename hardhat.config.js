require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  networks: {
    buildbear: {
      url: "https://rpc.buildbear.io/sudden-dud-bolt-97b2595e",
      accounts: {
        mnemonic: "gun clock joke kick select around mansion student width violin catch injury",
      }
    }
  }
};
