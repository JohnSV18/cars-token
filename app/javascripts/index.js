$(document).ready(function() {

    var accounts = web3.eth.accounts;

    CarContract.detectNetwork();

    $("#car-form").submit (function(e){
        e.preventDefault();

        CarContract.deployed().then(function (instance){
            var metadata = {
                "name": "cars-token",
                "from": $("#sender").val(),
                "to": $("receipient").val(),
                "description": $("#message").val()
            };

            CarContract.awardItem(reciepient, "URL_TO_IFPS")
        });
    });

});