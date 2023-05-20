"use client";

import { Signer, ethers } from "ethers";
import React, { useState, useEffect } from "react";
import Web3Modal from "web3modal";
import { CrowdFundingABI, CrowdFundingAddress } from "./constants";
import { parseUnits } from "ethers/lib/utils";

ethers.BaseContract;

const fetchContract = (signerOrProvider) => {
    new ethers.Contract(CrowdFundingAddress, CrowdFundingABI, signerOrProvider);
};

export const CrowdFundingContext = React.createContext();

export const CrowdFundingProvider = ({ children }) => {
    const titleData = "Crowd Funding Contract";
    const [currentAccount, setCurrentAccount] = useState("");

    const parseCampaigns = (campaigns) => {
        const parsedCampaigns = campaigns.map(
            ({ owner, title, description, target, deadline, amountCollected }, i) => ({
                owner,
                title,
                description,
                target: ethers.utils.parseEther(target).toString(),
                deadline: deadline.toNumber(),
                amountCollected: ethers.utils.formatEther(amountCollected.toString()),
                pId: i,
            })
        );
        return parsedCampaigns;
    };

    const createCampaign = async (campaign) => {
        const { title, description, amount, deadline } = campaign;
        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner();
        const contract = fetchContract(signer);

        console.log(currentAccount);
        try {
            const tx = await contract.createCampaign(
                currentAccount,
                title,
                description,
                ethers.utils,
                parseUnits(amount, 18),
                new Date(deadline).getTime()
            );
            await tx.wait();
            console.log("contract call success", transaction);
        } catch (error) {
            console.log("contract call failure", error);
        }
    };

    const getCampaigns = async () => {
        const provider = new ethers.providers.JsonRpcProvider();
        const contract = fetchContract(provider);

        const campaigns = await contract.getCampaigns();
        return parseCampaigns(campaigns);
    };

    const getUserCampaigns = async () => {
        const provider = new ethers.providers.JsonRpcProvider();
        const contract = fetchContract(provider);

        const allCampaigns = await contract.getCampaigns();
        const accounts = await window.ethereum.request({
            method: "eth_accounts",
        });
        const currentUser = accounts[0];

        const filteredCampaigns = allCampaigns.filter((campaign) => {
            campaign.owner === "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
        });

        const userData = parseCampaigns(filteredCampaigns);
        return userData;
    };

    const donate = async (pId, amount) => {
        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner();
        const contract = fetchContract(signer);

        const campaignData = await contract.donateToCampaign(pId, {
            value: ethers.utils.parseEther(amount),
        });

        await campaignData.wait(1);
        location.reload();

        return campaignData;
    };

    const getDonations = async (pId) => {
        const provider = new ethers.providers.JsonRpcProvider();
        const contract = fetchContract(provider);

        const donations = await contract.getDonators(pId);
        const numberOfDonations = donations[0].length;
        const parsedDonations = [];

        for (let i = 0; i < numberOfDonations; i++) {
            parsedDonations.push({
                donator: donations[0][i],
                donation: ethers.utils.formatEther(donations[1][i].toString()),
            });
        }

        return parsedDonations;
    };

    // CHECK IF WALLET IS CONNECTED
    const checkIfWalletConnected = async () => {
        try {
            if (!window.ethereum) return setOpenError(true), setError("Install MetaMask");

            const accounts = await window.ethereum.request({
                method: "eth_accounts",
            });

            accounts.length ? setCurrentAccount(accounts[0]) : console.log("No account found");
        } catch (err) {
            console.log("Something went wrong while connecting to wallet");
        }
    };

    useEffect(() => {
        checkIfWalletConnected();
    }, []);

    const connectWallet = async () => {
        try {
            if (!window.ethereum) return console.log("Install MetaMask");

            const accounts = await window.ethereum.request({
                method: "eth_requestAccounts",
            });

            setCurrentAccount(accounts[0]);
        } catch (err) {
            console.log("Error while connecting to wallet");
        }
    };

    const gasLimit = async () => {
        const web3Modal = new Wenb3Modal();
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner();
        const contract = fetchContract(signer);
        //0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199
        const donations = await contract.send("0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199", {
            value: ethers.utils.parseEther("45"),
            gasLimit: 100000,
        });
    };

    return (
        <CrowdFundingContext.Provider
            value={{
                titleData,
                currentAccount,
                createCampaign,
                getCampaigns,
                getUserCampaigns,
                donate,
                getDonations,
                connectWallet,
                gasLimit,
            }}
        >
            {children}
        </CrowdFundingContext.Provider>
    );
};
