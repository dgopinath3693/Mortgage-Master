// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
import "hardhat/console.sol";

contract LoanApp {
    
    //how much the total loan is, before splitting into monthly plans
    uint public totalLoanAmount;
    bool approved = false;
    address public user = msg.sender; //user's address
    mapping(address => uint256) userBalance;

    event Withdrawal(uint _totalLoanAmount); // the event that will be emitted to frontend
    
    constructor(uint _totalLoanAmount) payable {
        setUserBalance(msg.sender, 100000); //currently hardcoded to 100000
        uint minReqBalance = _totalLoanAmount/4; 
        require(
            minReqBalance < userBalance[msg.sender],
            "User balance is under the required minimum amount"
        );
        totalLoanAmount = _totalLoanAmount;
        approved = true;
    }

    //picks payment plan 1 - highest payment, shortest duration

    //picks payment plan 2 - medium payment, medium duration

    //picks payment plan 3 - lowest payment, highest duration

  
     /**
      * Withdraw the full loan amount to the user's account balance if they are approved.
      */
    function withdraw() public {
        // Uncomment this line, and the import of "hardhat/console.sol", to print a log in your terminal
        // console.log("The user's address: %s", user,"and the user's balance is %s", userBalance);
        require(approved);
        require(msg.sender == user, "You aren't the owner");

        userBalance[msg.sender] += totalLoanAmount;

        emit Withdrawal(totalLoanAmount);
    }



    /**
     * Method that updates the userBalance mapping to the user's current balance in their account when trying
     * to apply for a loan. The default userBalance is currently hardcoded to a specific value
     * for simpler functionality.
     */
    function setUserBalance(address _user, uint _balance) internal {
        userBalance[_user] = _balance;
    }
}
