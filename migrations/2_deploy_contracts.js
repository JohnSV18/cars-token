const CarContract = artifacts.require("CarContract")

module.exports = function(deployer){
    deployer.deploy(CarContract);
}