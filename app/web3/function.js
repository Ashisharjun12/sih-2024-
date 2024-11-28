import { ethers } from "ethers";
import { CONTRACT_ADDRESS } from "./contractAddress";
import { CONTRACT_ABI } from "./contractABI";

export const initializeEthers = async (ethereum) => {
  const provider = new ethers.BrowserProvider(ethereum);
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
  return contract;
};
