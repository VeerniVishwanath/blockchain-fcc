//SPDX-License-Identifier: MIT
//Pragma
pragma solidity ^0.8.8;
/** Imports */
import "@chainlink/contracts/src/v0.6/tests/MockV3Aggregator.sol";
import "./PriceConverter.sol";
/** Error Codes  */
error FundMe__NotOwner();

/** Interfaces, libraries & Contracts */

/** @title A contract for crowd funding
 *  @author Vishwanath Veerni
 *  @notice This contract is to demo a sample funding contract
 *  @dev This implements price feeds as our library 
 */
contract FundMe {
    /** Type Declarations */
    using PriceConverter for uint256;

    /** State Variables */
    address public immutable i_owner;
    //Making Constant for Gas Optimizations
    uint256 public constant MINIMUM_USD = 50 * 1e18;
    //List of Funders with amount
    address[] public funders;
    mapping(address => uint256) public addressToAmountFunders;
    AggregatorV3Interface public priceFeed;


    /** Modifiers */
    modifier onlyi_owner() {
        // require(i_owner ==  msg.sender, "You ain't the i_owner");
        if (i_owner != msg.sender) revert FundMe__NotOwner();
        _;
    }

    /** Functions */

    //constructor
    constructor(address priceFeedAddress) {
        i_owner = msg.sender;
        priceFeed = AggregatorV3Interface(priceFeedAddress);
    }

    // Recieve and Fallback
    recieve() external payable{
        fund();
    }
    fallback() external payable{
        fund();
    }
    
    function fund() public payable {
        require(
            msg.value.getConversionRate(priceFeed) >= MINIMUM_USD,
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
}
