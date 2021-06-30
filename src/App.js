import {useState,useEffect} from "react";
import Web3 from "web3";
import abi from "./abi.json";

let web3,contract;
function App() {

  const [account,setAccount] = useState()
  const contractAddress = "0x6057ad9f0BDf6622e554B5fACD90A1F35c19956e";

  useEffect(async()=>{
    if(!window.ethereum){
      console.log("Get metamask plis request");
      return;
    }
    async function startMetamask(){
      await window.ethereum.request({method:'eth_requestAccounts'});
      web3 = new Web3(window.ethereum);
      setAccount(window.ethereum.selectedAddress);
      console.log(web3.eth.getChainId);
      if(web3.eth.getChainId != 800001){
        console.log("Please change your network to Mumbai Testnet");
      }
      contract = new web3.eth.Contract(abi,contractAddress);
    }
    startMetamask();
    
  },[]);
    
  async function CreateProject(NFTPrice,isPaused,Quantity){
    const amount = web3.utils.toWei(NFTPrice,"ether");
    const result = contract.methods.createProject(amount,isPaused,Quantity).send({from: account});
    result.on("transactionHash",(hash)=>{
      console.log("Transaction sent successfully. Check console for Transaction hash")
      console.log("Transaction Hash is ",hash)
    }).once("confirmation",(confirmationNumber,receipt)=>{
      if(receipt.status){
        console.log("Transaction processed successfully")
        GetAllProjectInfo();
      }else{
        console.log("Transaction failed");
      }
      console.log(receipt)
    })
  }

  async function GetAllProjectInfo(){
    const result = await contract.methods.getAllUserProjectInfo().call({from:account});
    console.log(result);
  }

  async function ChangeNFTPrice(ProjectID,newPrice){
    const amount = web3.utils.toWei(newPrice,"ether");
    const result = contract.methods.changeProjectPrice(ProjectID,amount).send({from: account});
    result.on("transactionHash",(hash)=>{
      console.log("Transaction sent successfully. Check console for Transaction hash")
      console.log("Transaction Hash is ",hash)
    }).once("confirmation",(confirmationNumber,receipt)=>{
      if(receipt.status){
        console.log("Transaction processed successfully")
      }else{
        console.log("Transaction failed");
      }
      console.log(receipt)
    })
  }

  async function ChangeNFTPause(ProjectID,PauseStatus){
    const result = contract.methods.changePauseStatus(ProjectID,PauseStatus).send({from: account});
    result.on("transactionHash",(hash)=>{
      console.log("Transaction sent successfully. Check console for Transaction hash")
      console.log("Transaction Hash is ",hash)
    }).once("confirmation",(confirmationNumber,receipt)=>{
      if(receipt.status){
        console.log("Transaction processed successfully")
      }else{
        console.log("Transaction failed");
      }
      console.log(receipt)
    })
  }

  async function IncreaseNFTQuantity(ProjectID,NewAmount){
    const result = contract.methods.increateNFTAmount(ProjectID,NewAmount).send({from: account});
    result.on("transactionHash",(hash)=>{
      console.log("Transaction sent successfully. Check console for Transaction hash")
      console.log("Transaction Hash is ",hash)
    }).once("confirmation",(confirmationNumber,receipt)=>{
      if(receipt.status){
        console.log("Transaction processed successfully")
      }else{
        console.log("Transaction failed");
      }
      console.log(receipt)
    })
  }

  async function ShowBalanceAmount(){
    const result = await contract.methods.showAmount().call({from:account});
    console.log(result);
  }

  async function RetrieveUserBalance(){
    const result = contract.methods.retrieveAmount().send({from: account});
    result.on("transactionHash",(hash)=>{
      console.log("Transaction sent successfully. Check console for Transaction hash")
      console.log("Transaction Hash is ",hash)
    }).once("confirmation",(confirmationNumber,receipt)=>{
      if(receipt.status){
        console.log("Transaction processed successfully")
      }else{
        console.log("Transaction failed");
      }
      console.log(receipt)
    })
  }  

  return (
    <div className="App">
      <button type="button" className="button" onClick={GetAllProjectInfo}>Submit</button>
    </div >
  );
}

export default App;
