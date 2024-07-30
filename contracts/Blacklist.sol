// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Blacklist is Ownable {
    // address[] private _blackList;
    mapping(address => bool) private _blacklisted;

    constructor() Ownable(msg.sender){}

    // Disabilita un account in blacklist
    function setBlacklist(address[] calldata blArray) external onlyOwner {
        for (uint256 i = 0; i < blArray.length; i++){
            _blacklisted[blArray[i]] = true;
        }
    }

    // Riabilita un account in blacklist
    function resetBlacklist(address[] calldata blArray) external onlyOwner {
        for (uint256 i = 0; i < blArray.length; i++){
            _blacklisted[blArray[i]] = false;  
        }
    }

    // Controlla se un account è disabilitato o meno nella blacklist
    function isBlacklisted(address account) public view returns (bool){
        return _blacklisted[account];
    }
}




