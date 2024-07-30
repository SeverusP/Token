const { constants, expectRevert } = require('@openzeppelin/test-helpers');
const { web3 } = require('@openzeppelin/test-helpers/src/setup');
const { ZERO_ADDRRESS } = constants; //stringa di 0 che identifica l'indirizzo 0

import('chai');


const Blacklist = artifacts.require("Blacklist");
const Token = artifacts.require("Token");

let blacklist, token;

// Definsico un gruppo di test
contract('Token', (accounts) => {
    // Setto l'array che contiene gli account forniti da truffle
    const [owner, account1, account2, account3] = accounts

    //Esiste la beforeEach che viene richiamata prima di un nuovo it (di solito si usa se è necessario reinizializzare il token)
    before(async () => {
        blacklist = await Blacklist.new({ from: owner });
        token = await Token.new("TokenName", "TKN", blacklist.address, { from: owner });
    });

    // Se volessi utilizzare gli indirizzi già migrati in precedenza
    // Altrmenti il test ne genera di nuovi
    /*before(async () => {
        blacklist = await Blacklist.deployed();
        token = await Token.deployed();
    });*/

    // Definisco un singolo test, asincrono perchè interagisce con la blockchain simulata
    it('check if deployed', async () => {

        // Loggo l'indirizzo del proprietario del contratto
        console.log("Owner address: ", owner);
            
        // Ottengo l'istanza del contratto blacklist distribuito
        //blacklist = await Blacklist.deployed();
        // Verifico che l'indirizzo non sia zero_address
        expect(blacklist.address).to.not.equal(ZERO_ADDRRESS);
        // Loggo l'indirizzo del contratto blacklist
        console.log("BL address: ", blacklist.address);


        // Ottengo l'istanza del contratto token
        //token = await Token.deployed();
        // Verifico che l'indirizzo non sia zero_address
        expect(token.address).to.not.equal(ZERO_ADDRRESS);
        // Loggo l'indirizzo del contratto token
        console.log("Token address: ", token.address);

        // Verifico che il proprietario ottenuto dal contratto token corrisponda
        // all'indirizzo del proprietario previsto
        expect(owner).to.equal(await token.owner());
    })

    it('set blacklist', async () => {
        await blacklist.setBlacklist([account3])
        expect(await blacklist.isBlacklisted(account3)).to.equal(true)
    })

    it('mint ok', async () => {
        await token.mint(account1, web3.utils.toWei("100"), {from: owner})
        expect(web3.utils.fromWei(await token.balanceOf(account1))).to.equal("100")
    })

    it('mint not ok', async () => {
        await expectRevert(token.mint(account3, web3.utils.toWei("100"), {from: owner}), "Address is Blacklisted")
    })

    it('transfer ok', async () => {
        await token.transfer(account2, web3.utils.toWei("50"), {from: account1})
        expect(web3.utils.fromWei(await token.balanceOf(account1))).to.equal("50")
        expect(web3.utils.fromWei(await token.balanceOf(account2))).to.equal("50")
    })

    it('transfer not ok', async () => {
        await expectRevert(token.transfer(account3, web3.utils.toWei("50"), {from: account1}), "Address is Blacklisted")
    })

    it('reset from blacklist', async () => {
        await blacklist.resetBlacklist([account3])
        expect(await blacklist.isBlacklisted(account3)).to.equal(false)
    })

    it('transfer ok', async () => {
        await token.transfer(account3, web3.utils.toWei("10"), {from: account1})
        expect(web3.utils.fromWei(await token.balanceOf(account1))).to.equal("40")
        expect(web3.utils.fromWei(await token.balanceOf(account3))).to.equal("10")
    })
})