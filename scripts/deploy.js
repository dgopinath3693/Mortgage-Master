// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.

  // We get the contract to deploy in the contracts folder for LoanApp.sol

  const LoanApp = await hre.ethers.getContractFactory("LoanApp"); // obtain object
  const loanapp = await LoanApp.deploy(500000); // deploy with a uint constructor

//   await loanapp.deployed(); // wait for contract to be deployed
  console.log("Greeter deployed to:", loanapp.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
