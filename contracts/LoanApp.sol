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

    //picks payment plan 1 - highest payment, shortest duration
    function poo {

    }

    //picks payment plan 2 - medium payment, medium duration

    //picks payment plan 3 - lowest payment, highest duration

  
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
