// Mi prendo i json dei contratti
const Blacklist = artifacts.require("Blacklist");
const Token = artifacts.require("Token");

// Truffle in questo modo distribuisce i contratti sulla blockchain
// di ganache utilizzando gli account generati da lei stessa (in questo caso il deployer sarà l'account 0)
module.exports = async(deployer) => {
    // Distribuisci il contratto Blacklist
    await deployer.deploy(Blacklist);
    const blacklist = await Blacklist.deployed();
    console.log("Contract Blacklist deployed @: ", blacklist.address);

    // Distribuisci il contratto Token con i parametri corretti
    await deployer.deploy(Token, "First Token", "FT1", blacklist.address);
    const token = await Token.deployed();
    console.log("Contract Token deployed @: ", token.address);
    
}