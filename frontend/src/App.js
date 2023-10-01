// import detectEthereumProvider from '@metamask/detect-provider';
import { useEffect, useRef, useState } from 'react';  // able to use react elements in page
//import { ethers } from 'ethers';                      // ethersjs library. Connectivity to web3: https://docs.ethers.org/v5/
// import {Helmet} from "react-helmet";                  // badgver image shown in tab
import MetaMaskOnboarding from '@metamask/onboarding'; // only executes if user doesn't have metamask install; add to package json

import './App.css'; // imports css styles - Here is how you change what the webpage looks like (color, front, style, etc)

// import image from './badger_pic.png' // picture used in main webpage

import LoanApp from './artifacts/contracts/LoanApp.sol/LoanApp.json'  // import the ABI code from this path

const ethers = require("ethers");
const contractAddress =  "0xC4819Ba4186884fd2681E2B0Af70fb96F8B884f6"
//"0x5FbDB2315678afecb367f032d93F642f64180aa3"   // reference to the deployed contract for local node it will be this address.
                                                                      // if you deploy to a testnet you will get a new address after the contract is 
                                                                      // deployed so it will need to be updated

function App() {

  const [loanAmount, setLoanAmount] = useState('')
  const [showElements, setShowElements] = useState(false);
  const [showSecondaryElements, setShowSecondaryElements] = useState({button: false, input: false});
  const [showTertiaryElements, setShowTertiaryElements] = useState(false);

  // Define a state variable to store the data from the contract
  const [shortestPlan, setShortestPlan] = useState(null); 
  const [averagePlan, setAveragePlan] = useState(null); 
  const [longestPlan, setLongestPlan] = useState(null); 

  // var fetchAndSet = document.querySelectorAll(".fetchAndSet")
  // fetchAndSet.forEach.disabled = false;

  const onboarding = new MetaMaskOnboarding();         // used to help user download metamask if not installed
  const hasMetaMask = useRef(false);                    // determines whether user should be linked to metamask install

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const loanApp = new ethers.Contract(contractAddress, LoanApp.abi, signer);

  // https://docs.metamask.io/guide/create-dapp.html#basic-action-part-1    further reading
  
  // executes upon load and starts the executes isMetaMaskInstalled()
  useEffect(() => {
    hasMetaMask.current = isMetaMaskInstalled();
  },[]);

  

  // checks if the MetaMask extension is installed
  const isMetaMaskInstalled = () => {
    // Have to check the ethereum binding on the window object to see if it's installed
    const { ethereum } = window;
    return Boolean(ethereum && ethereum.isMetaMask); // returns false if metamask is not installed; else true
  };

  ////**** return function at the bottom drives the rest of the code ****////

// Executes when "Connect Wallet" gets clicked. Checks if a user has the metamask extension. If not a 
// tab gets opened taking them to the web store where they can download it. If the user has a metamask account
// ethers will use window.ethereum to see which accounts are conencted to the site. If this is a user's first time
// connecting metamask will open a page for them to select a wallet (make sure to pick the one you imported!)
// If a user was connected from before a message will be displayed indicating what their account addr is
  const onClickConnect = async () => {
    try {
      if(hasMetaMask.current === false){ // if false then chrome tab will open for you to download
        onboarding.startOnboarding();
      }
      else{ // connects user wallet
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        console.log("user account: " + accounts); // used in debugging
        alert("User's account " + accounts + " is connected");
      }
      
    } catch (error) {
      console.error(error);
    }
  };

  const handleLoanAmountChange = (event) => {
    setLoanAmount(event.target.value);
  };

  async function requestLoan() {
    if (!loanAmount) {
      console.log("Please enter a loan amount");
      return;
    }
  
    try {
      setShowElements(false);
      setShowTertiaryElements(true);
      const tx = await loanApp.setLoanAmount(loanAmount);
      await tx.wait();
      console.log("Loan requested successfully");
      setShowSecondaryElements({button: false, input: false});

 

      const shortest = await loanApp.shortestPaymentPlan();
      loanApp.on("loanAmount", (value, duration) => {
        setShortestPlan(`Shortest loan plan is `,{value}` for `,{duration}` months`);
      })
      // const average = await loanApp.averagePaymentPlan();
      // const longest = await loanApp.longestPaymentPlan();   
      
      // setShortestPlan(shortest);
      // setAveragePlan(average);
      // setLongestPlan(longest);

      
    } catch (err) {
      console.log("Error: ", err);
    }
  }
   // Function executes when "Fetch Loan" is clicked. Calls the smart contract, reads the current greeting value
  async function fetchLoan(){
    if (typeof window.ethereum !== 'undefined') {                               // line that checks if the user has Metamask installed; not bad to have double check
      const provider = new ethers.providers.Web3Provider(window.ethereum);       // step in obtaining contract var which can call the Greeter.sol methods
      
      // since we are not changing the state of the blockchain we do not need a signer
      // SEE Providers and Signers in API reference for ethers.js: https://docs.ethers.org/v5/api/

      const contract = new ethers.Contract(contractAddress, LoanApp.abi, provider); // get contract object

      try {
        const data = await contract.withdraw();   // obtain current set Greeting -> calls the function in Greeter.sol!
        alert(data);
        console.log('data: ', data);             // print out set Greeting
      } catch (err) {
        console.log("Error: ", err);
      }
    } 
  }

// Function executes when "Set Loan" is clicked. calls the smart contract, sends an update via transaction
  async function setLoan(){
    if (typeof window.ethereum !== 'undefined') {
      // We are updating the blockchain, therefore we needed to add another step when creating the contract.
      // We need to have a way to create a transaction. In order to do that we need to sign the transaction using a signer
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();                                     // signs
      const contract = new ethers.Contract(contractAddress, LoanApp.abi, signer); // notice how it is "signer" for a change on the blockchain
      // const transaction = await contract.setGreeting(greeting)                  // calls Contract.sol setGreeting method and uses gas
      const transaction = await contract.withdraw();

      await transaction.wait()        // wait for the transaction to be confirmed on the blockchain; in a prod env this might take a while
    }
  } 

  return (
    
    <div className="App">
      <header className="App-header">
        <h1 className ='primary'>Welcome to Mortgage Master+!</h1>
        <h2 className = 'secondary' >Please connect your wallet and click 'Start Application' to get started.</h2>
        <button className="connect_wallet" onClick={onClickConnect}>Connect Wallet</button> {/*when button is clicked it invokes the onClickConnect method */}
        <button className="btn_props" onClick={() => setShowElements(true)}>Start Application</button>
        {showElements && <button onClick={() => setShowSecondaryElements({button: true, input: true})}>Home</button>}
        {showElements && <button onClick={() => setShowSecondaryElements({button: true, input: true})}>Auto</button>}
        {showElements && <button onClick={() => setShowSecondaryElements({button: true, input: true})}>Personal</button>}
        {showSecondaryElements.button && <button onClick={(requestLoan)}>Request Loan</button>}
        {showSecondaryElements.input && <input
          type = "number"
          placeholder = "Enter loan amount"
          value = {loanAmount}
          onChange = {handleLoanAmountChange}
        />}
        <p>{shortestPlan}</p>
        {/* {averagePlan && <p>The average payment plan is: {averagePlan}</p>}
        {longestPlan && <p>The longest payment plan is: {longestPlan}</p>} */}

          {showTertiaryElements && <button className="btn_props fetchAndSet" onClick={fetchLoan}>Fetch Loan</button>} {/*when button is clicked it invokes the fetchLoan method */}
          <div id = "set"></div>
          {showTertiaryElements && <button className="btn_props fetchAndSet" onClick={setLoan}>Set Loan</button>}     {/*when button is clicked it invokes the set Greeting method */}
      </header>
    </div>
  );

}
export default App;
