import "hardhat-deploy";
import "hardhat-deploy-ethers";
import "@nomicfoundation/hardhat-ethers";
import "@typechain/hardhat";

import "./tasks/get-token-balance";
import "./tasks/bridge-token";
import "./tasks/configure";

const dotenv = require("dotenv");
dotenv.config({ path: __dirname + "/.env" });

const accounts = [
	process.env.PRIVATE_KEY
];

const config: any = {
	gasReporter: {
		enabled: true,
		token: "ETH",
		coinmarketcap: process.env.CMC_API_KEY || "",
	},
	networks: {
		"ethereum-goerli": {
			chainId: 5,
			url: "https://ethereum-goerli.publicnode.com",
			live: false,
			accounts: accounts,
		},		
		"ethereum-holesky": {
			chainId: 17000,
			url: "https://ethereum-holesky.publicnode.com",
			live: false,
			accounts: accounts,
		},		
		"ethereum-sepolia": {
			chainId: 11155111,
			url: "https://eth-sepolia.public.blastapi.io",
			live: false,
			accounts: accounts,
		},		
		"fantom-testnet": {
			chainId: 4002,
			url: "https://rpc.testnet.fantom.network",
			live: false,
			accounts: accounts,
		},
		"polygon-testnet": {
			chainId: 80001,
			url: "https://rpc-mumbai.maticvigil.com/",
			live: false,
			accounts: accounts,
		},
		"sonic-testnet": {
			chainId: 64165,
			url: "https://rpc.sonic.fantom.network/",
			live: false,
			accounts: accounts,
		},
		
		hardhat: {
			live: false,
			deploy: ["deploy/hardhat/"],
		},
	},
	namedAccounts: {
		deployer: 0,
		accountant: 1,
	},
	solidity: {
		compilers: [
			{
				version: "0.8.17",
				settings: {
					optimizer: {
						enabled: true,
						runs: 200,
					},
				},
			},
		],
	},
};

export default config;
