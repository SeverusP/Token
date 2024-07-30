// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IBlacklist.sol";

contract Token is ERC20, Ownable {
    
    // Indirizzo pubblico del contratto di blacklist
    address public blAddress;

    //uint8 public _decimals;

    // Costruttore del token, mi tiro giù anche il contratto di blacklist
    // Necessità di un nome, un imbolo, un address del contratto di blacklist
    constructor(string memory name_, string memory symbol_, address blAddress_) ERC20(name_, symbol_) Ownable(_msgSender()){
        //_decimals = decimals_;

        // Setto l'address del contratto di blacklist in una variabile
        blAddress = blAddress_;
    }


    /*function decimal() ublic returns(uint8){
        return _decimals;
    }*/

    // Mint del Token, soltanto owner può chiamare
    // (input) = ricevente, ammontare
    function mint(address account, uint256 amount) public onlyOwner {
        _beforeTokenTransfer(_msgSender(), account, amount);
        _mint(account, amount);
    }

    // Burn del Token
    // (input) = ammontare
    function burn(uint256 amount) public {
        _beforeTokenTransfer(_msgSender(), address(0), amount);
        _burn(_msgSender(), amount);
    }

    //  Tranx del Token, sovrascrive ERC20 
    // (input) = ricevente, valore ; (output) = bool
    function transfer(address to, uint256 value) public override returns (bool) {
        _beforeTokenTransfer(_msgSender(), to, value);
        super._transfer(_msgSender(), to, value);
        return true;
    }

    function transferFrom (address from, address to, uint256 value) public override returns (bool) {
        _beforeTokenTransfer(from, to, value);
        super._transfer(from,to,value);
        return true;
    }

    // La nuova versione di OpenZeppelin non ha più la beforeTokenTransfer(), ce la costriuiamo.
    // Controlla se il mandante o il ricevente sono inseriti nella lista nera, se si, non permette la trans del token
    // Permette quindi sia di bloccare chi riceve ma anche chi possiede già il token
    // (input) = mandante, ricevente, ammontare
    function _beforeTokenTransfer(address from, address to, uint256 amount) internal view {
        amount;
        if(IBlacklist(blAddress).isBlacklisted(from) || IBlacklist(blAddress).isBlacklisted(to)){
            revert("Address is Blacklisted");
        }
    }
}




