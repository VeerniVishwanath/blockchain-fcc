//SPDX-License-Identifier: MIT
pragma solidity 0.8.8;

contract SimpleStorage {
    uint256 public favoriteNumber;

    struct People {
        uint256 favoriteNumber;
        string name;
    }

    People[] public people;

    mapping(string => uint256) public nameToFavoriteNumber;

    function store(uint256 numberFavorite) public virtual {
        favoriteNumber = numberFavorite;
    }

    //Getter Function
    function retrieve() public view returns (uint256) {
        return favoriteNumber;
    }

    function add(string memory name, uint256 _favoriteNumber) public {
        people.push(People(_favoriteNumber, name));
        nameToFavoriteNumber[name] = _favoriteNumber;
    }
}
