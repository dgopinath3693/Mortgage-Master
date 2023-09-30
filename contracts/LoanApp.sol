// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
import "hardhat/console.sol";

contract LoanApp {
    
    //how much the total loan is, before splitting into monthly plans
    uint public totalReqAmount;
    address payable public owner;
    bool approved = false;
    //links address to user balance 
    uint public userBalance; 
    string public typeOfLoan; 
    event Withdrawal(uint amount, uint when);

    
    constructor(uint _totalReqAmount) payable {
        uint minReqBalance = _totalReqAmount/4; 
        require(
            minReqBalance < _userBalance,
            "User balance is under the required minimum amount"
        );

        totalReqAmount = _totalReqAmount;
        owner = payable(msg.sender);
        approved = true;
    }

    function compareStrings(string memory a, string memory b) public pure returns (bool) {
         return keccak256(abi.encodePacked(a)) == keccak256(abi.encodePacked(b));
    }

    uint interestRate = 0; 
    uint monthlyLoan = 0; 


    //picks payment plan 1 - highest payment, shortest duration
    function shortestPaymentPlan() public {
    
        if (compareStrings(typeOfLoan, "Home")) {
         interestRate = 0.08; 
         numMonths = 15 * 12; 
        monthlyLoan = (totalReqAmount * interestRate * (1 + interestRate)^numMonths) / ((1 + interestRate)^numMonths - 1);
        return monthlyLoan; 
        } 
        if (compareStrings(typeOfLoan, "Auto")) {
         interestRate = 0.07;
         numMonths = 3 * 12; 
         monthlyLoan = (totalReqAmount * interestRate * (1 + interestRate)^numMonths) / ((1 + interestRate)^numMonths - 1);
        return monthlyLoan; 
        } 
        if (compareStrings(typeOfLoan, "Personal")) {
         interestRate = 0.10; 
         numMonths = 2 * 12; 
         monthlyLoan = (totalReqAmount * interestRate * (1 + interestRate)^numMonths) / ((1 + interestRate)^numMonths - 1);
        return monthlyLoan; 
        } 
        else {
            return "error in loan selection"; 
        }
    }   

    //picks payment plan 2 - medium payment, medium duration
    function averagePaymentPlan() public {
         if (compareStrings(typeOfLoan, "Home")) {
         interestRate = 0.08; 
         numMonths = 20 * 12; 
        monthlyLoan = (totalReqAmount * interestRate * (1 + interestRate)^numMonths) / ((1 + interestRate)^numMonths - 1);
        return monthlyLoan; 
        } 
        if (compareStrings(typeOfLoan, "Auto")) {
         interestRate = 0.07;
         numMonths = 6 * 12; 
         monthlyLoan = (totalReqAmount * interestRate * (1 + interestRate)^numMonths) / ((1 + interestRate)^numMonths - 1);
        return monthlyLoan; 
        } 
        if (compareStrings(typeOfLoan, "Personal")) {
         interestRate = 0.10; 
         numMonths = 5 * 12; 
         monthlyLoan = (totalReqAmount * interestRate * (1 + interestRate)^numMonths) / ((1 + interestRate)^numMonths - 1);
        return monthlyLoan; 
        } 
        else {
            return "error in loan selection"; 
        }
    }

    //picks payment plan 3 - lowest payment, highest duration
    function longestPaymentPlan() public {
        if (compareStrings(typeOfLoan, "Home")) {
         interestRate = 0.08; 
         numMonths = 30 * 12; 
        monthlyLoan = (totalReqAmount * interestRate * (1 + interestRate)^numMonths) / ((1 + interestRate)^numMonths - 1);
        return monthlyLoan; 
        } 
        if (compareStrings(typeOfLoan, "Auto")) {
         interestRate = 0.07;
         numMonths = 8 * 12; 
         monthlyLoan = (totalReqAmount * interestRate * (1 + interestRate)^numMonths) / ((1 + interestRate)^numMonths - 1);
        return monthlyLoan; 
        } 
        if (compareStrings(typeOfLoan, "Personal")) {
         interestRate = 0.10; 
         numMonths = 7 * 12; 
         monthlyLoan = (totalReqAmount * interestRate * (1 + interestRate)^numMonths) / ((1 + interestRate)^numMonths - 1);
        return monthlyLoan; 
        } 
        else {
            return "error in loan selection"; 
        }
    }
  
     //print out loan amount for user, and transfer the full loan amount to user account balance
    function withdraw() public {
        // Uncomment this line, and the import of "hardhat/console.sol", to print a log in your terminal
         console.log("Unlock time is %o and block timestamp is %o", unlockTime, block.timestamp);
        
        require(approved);
        require(block.timestamp >= unlockTime, "You can't withdraw yet");
        require(msg.sender == owner, "You aren't the owner");

        emit Withdrawal(address(this).balance, block.timestamp);

        owner.transfer(address(this).balance);
    }
}
