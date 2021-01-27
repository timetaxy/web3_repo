
const TomoBridgeWrapToken = artifacts.require('TomoBridgeWrapToken')
const BigNumber = require('bignumber.js')

const config = require('config');

module.exports = function(deployer) {
    return deployer.deploy(
        TomoBridgeWrapToken,
        ["0x33c2E732ae7dce8B05F37B2ba0CFe14c980c4Dbe"],
        1,
        "BridgeToken",
        "BTK",
        18,
        0,
        0,
        [0, 0],
        "0xe2064e59005f55c8f04ec37f95819aec06932fbc",
        "ETH"
    ).then(() => {
        return true
    })
};
