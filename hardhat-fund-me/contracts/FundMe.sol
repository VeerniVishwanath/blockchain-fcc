//SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import "./PriceConverter.sol";

contract FundMe {
    using PriceConverter for uint256;

    //Making Constant for Gas Optimizations
    uint256 public constant MINIMUM_USD = 50 * 1e18;

    address public immutable i_owner;

    error notOwner();

    //constructor
    constructor() {
        i_owner = msg.sender;
    }

    //List of Funders with amount
    address[] public funders;
    mapping(address => uint256) public addressToAmountFunders;

    function fund() public payable {
        require(
            msg.value.getConversionRate() >= MINIMUM_USD,
            "Didn't send enough"
        );
        funders.push(msg.sender);
        addressToAmountFunders[msg.sender] += msg.value;
    }

    function withdraw() public onlyi_owner {
        for (uint256 i = 0; i < funders.length; i++) {
            address funder = funders[i];
            addressToAmountFunders[funder] = 0;
        }
        //reset the funders array
        funders = new address[](0);

        //Actual withdraw of funds
        // using call function

        (bool callSuccess, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(callSuccess, "Call Failed");
    }

    modifier onlyi_owner() {
        // require(i_owner ==  msg.sender, "You ain't the i_owner");
        if (i_owner != msg.sender) revert notOwner();
        _;
    }
}
