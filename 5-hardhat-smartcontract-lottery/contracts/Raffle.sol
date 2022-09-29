/** Raffle
 * Enter the Lottery (By paying some eth)
 * Pick a random winner (verifiably random)
 * Winner will be selected every X minutes -> completly automate
 * ChainLink Oracle -> Randomness, Automated Execution (Chainlink Keepers)
 */

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

/**Error codes */
error Raffle__NotEnoughETHEntered();

contract Raffle {
    /**State Variables */
    uint256 private immutable i_entranceFee;
    address payable[] private s_players;

    /**Events */
    event RaffleEnter(address indexed player);

    /**Constructor */
    constructor(uint256 entranceFee) {
        i_entranceFee = entranceFee;
    }

    /**Entering the Lottery/Raffle */
    function enterRaffle() public payable {
        if (msg.value < i_entranceFee) {
            revert Raffle__NotEnoughETHEntered();
        }
        s_players.push(payable(msg.sender));
        //Emit an event when we update a dynamic array or mapping
        //Name Events with the function name reversed
        emit RaffleEnter(msg.sender);
    }

    // function pickRandomWinner(){}

    /**View and Pure functions */
    function getEntranceFee() public view returns (uint256) {
        return i_entranceFee;
    }

    function getPlayer(uint256 index) public view returns (address) {
        return s_players[index];
    }
}
