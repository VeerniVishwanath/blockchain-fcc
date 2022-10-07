//SPDX-License-Identifier: MIT
//Pragma
pragma solidity ^0.8.0;
/** Imports */
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "./PriceConverter.sol";
import "hardhat/console.sol";

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
    address private immutable i_owner;
    //Making Constant for Gas Optimizations
    uint256 public constant MINIMUM_USD = 50 * 1e18;
    //List of Funders with amount
    address[] private s_funders;
    mapping(address => uint256) private s_addressToAmountFunders;
    AggregatorV3Interface private s_priceFeed;

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
        s_priceFeed = AggregatorV3Interface(priceFeedAddress);
    }

    // Recieve and Fallback
    receive() external payable {
        console.log("Recieve : ", msg.value);
        fund();
    }

    fallback() external payable {
        console.log("Fallback : ", msg.value);
        if (msg.value > 100) {
            fund();
        }
    }

    function fund() public payable {
        require(
            msg.value.getConversionRate(s_priceFeed) >= MINIMUM_USD,
            "Didn't send enough"
        );
        s_funders.push(msg.sender);
        s_addressToAmountFunders[msg.sender] += msg.value;
    }

    function withdraw() public onlyi_owner {
        for (uint256 i = 0; i < s_funders.length; i++) {
            address funder = s_funders[i];
            s_addressToAmountFunders[funder] = 0;
        }
        //reset the funders array
        s_funders = new address[](0);

        //Actual withdraw of funds
        // using call function

        (bool callSuccess, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(callSuccess, "Call Failed");
    }

    function cheaperWithdraw() public onlyi_owner {
        address[] memory funders = s_funders;
        for (uint256 i = 0; i < funders.length; i++) {
            address funder = funders[i];
            s_addressToAmountFunders[funder] = 0;
        }
        //reset the funders array
        s_funders = new address[](0);

        //Actual withdraw of funds
        // using call function

        (bool callSuccess, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(callSuccess, "Call Failed");
    }

    /**View and Pure */
    //Getter functions for private state variables
    function getOwner() public view returns (address) {
        return i_owner;
    }

    function getFunder(uint256 index) public view returns (address) {
        return s_funders[index];
    }

    function getAddressToAmountFunded(address funder)
        public
        view
        returns (uint256)
    {
        return s_addressToAmountFunders[funder];
    }

    function getPriceFeed() public view returns (AggregatorV3Interface) {
        return s_priceFeed;
    }
}
