import React, { useState, useEffect } from "react";
import Web3 from "web3";
import abi from "../abi.json";
import pinataSDK from "@pinata/sdk";
// components

import CardLineChart from "components/Cards/CardLineChart.js";
import CardBarChart from "components/Cards/CardBarChart.js";
import CardPageVisits from "components/Cards/CardPageVisits.js";
import CardSocialTraffic from "components/Cards/CardSocialTraffic.js";

import { v4 as uuidv4 } from "uuid";

export default function Dashboard() {
  const [account, setAccount] = useState();
  const contractAddress = "0xbF42789cb77cF034c329BbbeEdaa9550344b40F1";
  const [contract, setContract] = useState();
  const [web3, setWeb3] = useState();
  const pinata = pinataSDK(
    "8320c40d54b932b00c87",
    "7c3ca50c3980596621640b3264125c4e57cd561063106de9672ffaf225f745b4"
  );

  //New Project
  const [projectName, setProjectName] = useState("");
  const [price, setPrice] = useState();
  const [quantity, setQuantity] = useState();

  const handleChangeProjectName = (e) => {
    setProjectName(e.target.value);
  };

  const handleChangeQuantity = (e) => {
    setQuantity(e.target.value);
  };

  const handleChangePrice = (e) => {
    setPrice(e.target.value);
  };

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

  useEffect(() => {
    contract && GetAllProjectInfo();
  }, [contract]);

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
  async function storeJsonIPFS(body) {
    pinata
      .pinJSONToIPFS(body)
      .then((result) => {
        //handle results here
        console.log("Creating Project");
        CreateProject(price, false, quantity, result.IpfsHash)
          .then(console.log)
          .catch(console.log);
      })
      .catch((err) => {
        //handle error here
        console.log(err);
      });
  }

  const handleCreateNewProject = () => {
    const ipfs = { projectName: projectName, projectOwner: account };
    storeJsonIPFS(ipfs);
  };

  // useEffect(() => {
  //   contract && RetrieveUserBalance();
  // }, [contract]);

  const [showModal, setShowModal] = useState(false);
  return (
    <>
      {showModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl shadow-lg">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                  <h3 className="text-3xl font-semibold">Create New Project</h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none px-3"
                    onClick={() => setShowModal(false)}
                  >
                    <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                      ×
                    </span>
                  </button>
                </div>
                {/*body*/}
                <div className="relative px-6 py-3 flex-auto">
                  <div class="mb-3 pt-0">
                    <input
                      type="text"
                      placeholder="Project Name"
                      class="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 relative bg-white bg-white rounded text-sm shadow outline-none focus:outline-none focus:shadow-outline w-full"
                      value={projectName}
                      onChange={handleChangeProjectName}
                    />
                  </div>
                  <div class="mb-3 pt-0">
                    <input
                      type="text"
                      placeholder="Price"
                      class="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 relative bg-white bg-white rounded text-sm shadow outline-none focus:outline-none focus:shadow-outline w-full"
                      value={price}
                      onChange={handleChangePrice}
                    />
                  </div>
                  <div class="mb-3 pt-0">
                    <input
                      type="text"
                      placeholder="Quantity"
                      class=" px-3 py-3 placeholder-blueGray-300 text-blueGray-600 relative bg-white bg-white rounded text-sm shadow outline-none focus:outline-none focus:shadow-outline w-full"
                      value={quantity}
                      onChange={handleChangeQuantity}
                    />
                  </div>
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b py-3 px-6">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => handleCreateNewProject()}
                  >
                    Create New Project
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
      <div className="flex flex-wrap mt-4">
        <div className="w-full mb-12 xl:mb-0 px-4">
          <>
            <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
              <div className="rounded-t mb-0 px-4 py-3 border-0">
                <div className="flex flex-wrap items-center">
                  <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                    <h3 className="font-semibold text-base text-blueGray-700">
                      Projects
                    </h3>
                  </div>
                  <div className="relative w-full px-4 max-w-full flex-grow flex-1 text-right">
                    <button
                      className="bg-indigo-500 text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={() => setShowModal(true)}
                    >
                      + Create New
                    </button>
                  </div>
                </div>
              </div>
              <div className="block w-full overflow-x-auto">
                {/* Projects table */}
                <table className="items-center w-full bg-transparent border-collapse">
                  <thead>
                    <tr>
                      <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                        Project Name
                      </th>
                      <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                        Status
                      </th>
                      <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                        Quantity
                      </th>
                      <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                        Price
                      </th>
                      <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                        Users
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">
                        Random Project
                      </th>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                        Running
                      </td>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                        340
                      </td>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                        0.02
                      </td>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                        10
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </>
        </div>
        {/* <div className="w-full xl:w-4/12 px-4">
          <CardSocialTraffic />
        </div> */}
      </div>
    </>
  );
}
