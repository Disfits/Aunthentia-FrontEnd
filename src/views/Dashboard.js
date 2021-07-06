import React, { useState, useEffect } from "react";
import Web3 from "web3";
import abi from "../abi.json";
import pinataSDK from "@pinata/sdk";
// components

import CardLineChart from "components/Cards/CardLineChart.js";
import CardBarChart from "components/Cards/CardBarChart.js";
import CardPageVisits from "components/Cards/CardPageVisits.js";
import CardSocialTraffic from "components/Cards/CardSocialTraffic.js";

export default function Dashboard() {
  const [account, setAccount] = useState();
  const contractAddress = "0x03AfF2Af74D355E4bEE93301a5e003F8A2a7ec23";
  const [contract, setContract] = useState();
  const [web3, setWeb3] = useState();
  const pinata = pinataSDK('key', 'secret key');
  useEffect(() => {
    if (!window.ethereum) {
      console.log("Get metamask plis request");
      return;
    }
    async function startMetamask() {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      let newWeb3 = new Web3(window.ethereum);
      setWeb3(newWeb3);
      setAccount(window.ethereum.selectedAddress);
      newWeb3.eth.getChainId().then((chainId) => {
        // console.log(chainId);
        if (chainId != 80001) {
          console.log("Please change your network to Mumbai Testnet");
        }
        setContract(new newWeb3.eth.Contract(abi, contractAddress));
      });
    }
    startMetamask();
  
  }, []);

  async function CreateProject(NFTPrice, isPaused, Quantity, URI) {
    const amount = web3.utils.toWei(NFTPrice, "ether");
    const result = contract.methods
      .createProject(amount, isPaused, Quantity, URI)
      .send({ from: account });
    result
      .on("transactionHash", (hash) => {
        console.log(
          "Transaction sent successfully. Check console for Transaction hash"
        );
        console.log("Transaction Hash is ", hash);
      })
      .once("confirmation", (confirmationNumber, receipt) => {
        if (receipt.status) {
          console.log("Transaction processed successfully");
          GetAllProjectInfo();
        } else {
          console.log("Transaction failed");
        }
        console.log(receipt);
      });
  }

  async function GetAllProjectInfo() {
    const result = await contract.methods
      .getAllUserProjectInfo()
      .call({ from: account });
    console.log(result);
  }

  async function ChangeNFTPrice(ProjectID, newPrice) {
    const amount = web3.utils.toWei(newPrice, "ether");
    const result = contract.methods
      .changeProjectPrice(ProjectID, amount)
      .send({ from: account });
    result
      .on("transactionHash", (hash) => {
        console.log(
          "Transaction sent successfully. Check console for Transaction hash"
        );
        console.log("Transaction Hash is ", hash);
      })
      .once("confirmation", (confirmationNumber, receipt) => {
        if (receipt.status) {
          console.log("Transaction processed successfully");
        } else {
          console.log("Transaction failed");
        }
        console.log(receipt);
      });
  }

  async function ChangeNFTPause(ProjectID, PauseStatus) {
    const result = contract.methods
      .changePauseStatus(ProjectID, PauseStatus)
      .send({ from: account });
    result
      .on("transactionHash", (hash) => {
        console.log(
          "Transaction sent successfully. Check console for Transaction hash"
        );
        console.log("Transaction Hash is ", hash);
      })
      .once("confirmation", (confirmationNumber, receipt) => {
        if (receipt.status) {
          console.log("Transaction processed successfully");
        } else {
          console.log("Transaction failed");
        }
        console.log(receipt);
      });
  }

  //Increase Quantity of NFTs
  async function IncreaseNFTQuantity(ProjectID, NewAmount) {
    const result = contract.methods
      .increateNFTAmount(ProjectID, NewAmount)
      .send({ from: account });
    result
      .on("transactionHash", (hash) => {
        console.log(
          "Transaction sent successfully. Check console for Transaction hash"
        );
        console.log("Transaction Hash is ", hash);
      })
      .once("confirmation", (confirmationNumber, receipt) => {
        if (receipt.status) {
          console.log("Transaction processed successfully");
        } else {
          console.log("Transaction failed");
        }
        console.log(receipt);
      });
  }

  //Shows the total amount our dev has made in sales
  async function ShowBalanceAmount() {
    const result = await contract.methods.showAmount().call({ from: account });
    console.log(result);
  }

  //Returns the total amount our developer has made in NFT sales
  async function RetrieveUserBalance() {
    const result = contract.methods.retrieveAmount().send({ from: account });
    result
      .on("transactionHash", (hash) => {
        console.log(
          "Transaction sent successfully. Check console for Transaction hash"
        );
        console.log("Transaction Hash is ", hash);
      })
      .once("confirmation", (confirmationNumber, receipt) => {
        if (receipt.status) {
          console.log("Transaction processed successfully");
        } else {
          console.log("Transaction failed");
        }
        console.log(receipt);
      });
  }

  //pass JSON as body
  //Response
//  {
//     IpfsHash: This is the IPFS multi-hash provided back for your content,
//     PinSize: This is how large (in bytes) the content you just pinned is,
//     Timestamp: This is the timestamp for your content pinning (represented in ISO 8601 format)
// }
  async function storeJsonIPFS(body){
    pinata.pinJSONToIPFS(body).then((result) => {
      //handle results here
      console.log(result);
  }).catch((err) => {
      //handle error here
      console.log(err);
  });
  }

  // useEffect(() => {
  //   contract && RetrieveUserBalance();
  // }, [contract]);
  return (
    <>
      <div className="flex flex-wrap mt-4">
        <div className="w-full mb-12 xl:mb-0 px-4">
          <CardPageVisits />
        </div>
        {/* <div className="w-full xl:w-4/12 px-4">
          <CardSocialTraffic />
        </div> */}
      </div>
    </>
  );
}
