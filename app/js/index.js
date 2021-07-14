require('dotenv').config();

import Web3 from "web3";
import carArtifact from "../../build/contracts/CarContract.json";
import fleek from '@fleekhq/fleek-storage-js';


// Credit: https://github.com/truffle-box/webpack-box/blob/master/app/src/index.js
const App = {
    web3: null,
    account: null,
    carContract: null,

    start: async function () {
        const { web3 } = this;
        window.ethereum.enable()

        try {
            // Get contract instance.
            const networkId = await web3.eth.net.getId();
            const deployedNetwork = carArtifact.networks[networkId];
            this.carContract = new web3.eth.Contract(
                carArtifact.abi,
                deployedNetwork.address,
            );

            // Get accounts
            const accounts = await web3.eth.getAccounts();
            this.account = accounts[0];
        } catch (error) {
            console.error("Could not connect to contract or chain: ", error);
        }
    },

    generateRandomCarData: async function (to) {
        // Car specs
        var carSpecs = {
            topSpeed: `${Math.round(Math.random() * 400)} MPH`,
            zeroSixty: `${(Math.random() * 9 + 1).toFixed(2)}s`,
            horsepower: Math.round(Math.random() * 1000)
        }
        // Build the metadata.
        var metadata = {
            "name": "crypto cars",
            "description": `A car that lives on the blockchain.`,
            "Top Speed": carSpecs.topSpeed,
            "0-60": carSpecs.zeroSixty,
            "Horsepower": carSpecs.horsePower,
            "timestamp": new Date().toISOString()
        };

        // Configure the uploader.
        const uploadMetadata = {
            apiKey: process.env.FLEEK_KEY,
            apiSecret: process.env.FLEEK_SECRET,
            key: `metadata/${metadata.timestamp}.json`,
            data: JSON.stringify(metadata),
        };

        // Tell the user we're generating the car
        this.setStatus("Generating a crypto car... please wait!");

        // Add the metadata to IPFS first, because our contract requires a
        // valid URL for the metadata address.
        const result = await fleek.upload(uploadMetadata);

        // Once the file is added, then we can send a car
        this.awardItem(to, result.publicUrl, carSpecs);
    },

    awardItem: async function (to, metadataURL, metadata) {
        // Fetch the awardItem method from our contract.
        const { awardItem } = this.carContract.methods;

        // Award the car
        await awardItem(to, metadataURL).send({ from: this.account });

        // Set the status and show the car generated.
        this.setStatus(`Car generated! Here are the specs of the car 🚙🚀:
        <br/>
        <ul>
            <li>Top Speed: ${metadata.topSpeed}</li>
            <li>0-60: ${metadata.zeroSixty}</li>
            <li>Horsepower: ${metadata.horsepower}</li>
        </ul>
        View the metadata <a href="${metadataURL}" target="_blank">here</a>.
        `);
    },

    setStatus: function (message) {
        $('#status').html(message);
    }
};

window.App = App;

// When all the HTML is loaded, run the code in the callback below.
$(document).ready(function () {
    // Detect Web3 provider.
    if (window.ethereum) {
        // use MetaMask's provider
        App.web3 = new Web3(window.ethereum);
        window.ethereum.enable(); // get permission to access accounts
    } else {
        console.warn("No web3 detected. Falling back to http://127.0.0.1:8545. You should remove this fallback when you deploy live",);
        // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
        App.web3 = new Web3(
            new Web3.providers.HttpProvider("http://127.0.0.1:8545"),
        );
    }
    // Initialize Web3 connection.
    window.App.start();

    // Capture the form submission event when it occurs.
    $("#car-form").submit(function (e) {
        // Run the code below instead of performing the default form submission action.
        e.preventDefault();

        // Capture form data and create metadata from the submission.
        const to = $("#to").val();

        window.App.generateRandomCarData(to);
    });
});
