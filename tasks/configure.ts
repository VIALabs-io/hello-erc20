import fs from 'fs';
import { task } from "hardhat/config";
import { getChainConfig } from "@vialabs-io/npm-registry";
import networks from "../networks";

task("configure", "")
	.addOptionalParam("signer", "Custom signer (private key)")
	.addOptionalParam("provider", "Custom provider RPC url")
	.setAction(async (args, hre:any) => {
		const ethers = hre.ethers;
		const [deployer] = await ethers.getSigners();

		let signer = deployer;
		if (args.signer) signer = new ethers.Wallet(args.signer, new ethers.providers.JsonRpcProvider(args.provider));
		
		let addresses = [];
		let chainids = [];
		let confirmations=[];
		for(let x=0; x < networks.length; x++) {
			const helloERC20 = require(process.cwd()+"/deployments/"+networks[x]+"/HelloERC20.json");
			const chainId = fs.readFileSync(process.cwd()+"/deployments/"+networks[x]+"/.chainId").toString();
			addresses.push(helloERC20.address);
			chainids.push(chainId);
			confirmations.push(1);
		}
	
		const chainConfig = getChainConfig(hre.network.config.chainId);
		if (!chainConfig) {
			throw new Error(`Chain configuration not found for chainId: ${hre.network.config.chainId}`);
		}

		console.log('setting remote contract addresses .. CLT message address:', chainConfig.message);
		const helloERC20 = await ethers.getContract("HelloERC20");
		await (await helloERC20.configureClient(chainConfig.message, chainids, addresses, confirmations)).wait();
	});
