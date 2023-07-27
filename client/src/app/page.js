"use client"

import WrongNetworkMessage from '../components/WrongNetworkMessage'
import ConnectWalletButton from '../components/ConnectWalletButton'
import TodoList from '../components/TodoList'
import { TaskContractAddress } from "../../config"
import TaskAbi from "../../../server/build/contracts/TaskContract.json"
import { useEffect, useState } from 'react'

const ethers = require("ethers")
/*
const tasks = [
  { id: 0, taskText: 'clean', isDeleted: false },
  { id: 1, taskText: 'food', isDeleted: false },
  { id: 2, taskText: 'water', isDeleted: true }
]
*/

export default function Home() {
  const [correctNetwork, setCorrectNetwork] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [currentAccount, setCurrentAccount] = useState('');
  const [input, setInput] = useState('');
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    connectWallet()
    getAllTasks()
  }, [])


  // Calls Metamask to connect wallet on clicking Connect Wallet button
  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        console.log("Metamask not detected");
        return;
      }
      let chainId = await ethereum.request({ method: "eth_chainId" });
      console.log("connected to chain:", chainId);

      const goerliChainId = "0x5";
      if (chainId != goerliChainId) {
        alert("You are not connected to the goerli testnet!");
        setCorrectNetwork(false);
        return;
      } else {
        setCorrectNetwork(true)
      }

      const accounts = await ethereum. request( {method:'eth_requestAccounts'} )
      console.log( 'Found account', accounts[0])
      setIsUserLoggedIn(true)
      setCurrentAccount(accounts[0])
    } catch (error) {
      console.log(error);
    }
};

  // Just gets all the tasks from the contract
  const getAllTasks = async () => {
    try {
      const {ethereum} = window

      if (ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner()
        const TaskContract = new ethers.Contract(
          TaskContractAddress,
          TaskAbi.abi,
          signer
        )
        let allTasks = await TaskContract.getMyTasks()
        console.log(allTasks)
        setTasks(allTasks)
      } else {
        console.log("Ethereum object does not exist!")
      }
    } catch (error) {
      console.log(error)
    }
  }

  // Add tasks from front-end onto the blockchain
  const addTask = async e => {
    e.preventDefault()

    let task = {
      taskText: input,
      isDeleted: false
    }

    try{
      const {ethereum} = window

      if (ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner()
        const TaskContract = new ethers.Contract(
          TaskContractAddress,
          TaskAbi.abi,
          signer
        )

        TaskContract.addTask(task.taskText, task.isDeleted)
        .then(res => {
          setTasks([...tasks, task])
          console.log("Added task")
        })
        .catch(error => {
          console.log(error)
        })
      } else {
        console.log("Ethereum object does not exist!")
      }
    } catch(error){
      console.log(error)
    }
    setInput('')
  }

  // Remove tasks from front-end by filtering it out on our "back-end" / blockchain smart contract
  const deleteTask = key => async () => {
    try{
      const {ethereum} = window

      if (ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner()
        const TaskContract = new ethers.Contract(
          TaskContractAddress,
          TaskAbi.abi,
          signer
        )

        const deleteTaskTransaction = await TaskContract.deleteTask(key, true)
        console.log("succesfully deleted: ", deleteTaskTransaction)

        let allTasks = await TaskContract.getMyTasks()
        setTasks(allTasks)
      } else {
        console.log("Ethereum does not exist!")
      }
    } catch(error) {
      console.log(error)
    }
  }

  return (
    <div className='bg-[#97b5fe] h-screen w-screen flex justify-center py-6'>
      {!isUserLoggedIn ? <ConnectWalletButton connectWallet={connectWallet}/> :
        correctNetwork ? <TodoList
                            tasks={tasks}
                            input={input}
                            setInput={setInput}
                            addTask={addTask}
                            deleteTask={deleteTask}
                        /> :
                        <WrongNetworkMessage />}
    </div>
  )
}
