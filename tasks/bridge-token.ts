import { task } from "hardhat/config";

task("bridge-token", "")
	.addParam("dest", "Destination chain id")
	.addParam("amount", "Amount of tokens in ETH")
	.addOptionalParam("wallet", "Custom wallet")
	.addOptionalParam("signer", "Custom signer (private key)")
	.addOptionalParam("gas", "Custom gas")
	.addOptionalParam("provider", "Custom provider RPC url")
	.setAction(async (args, hre: any) => {
		const ethers = hre.ethers;
		const network = hre.network.name;
		const [deployer] = await ethers.getSigners();

		const GAS_LIMIT = 0x500000;

		let signer = deployer;
		let wallet = deployer.address;
		if (args.signer) signer = new ethers.Wallet(args.signer, new ethers.providers.JsonRpcProvider(args.provider));
		if (args.wallet) wallet = args.wallet;

		const helloERC20 = await ethers.getContract("HelloERC20");

		let overrides = {};
		if (args.gas) overrides = { gasLimit: GAS_LIMIT };

		// await (await helloERC20.connect(signer).approve(signer.address, ethers.parseEther(args.amount), overrides)).wait();

		// await helloERC20.connect(signer).bridge.estimateGas(args.dest, wallet, ethers.parseEther(args.amount), overrides);
		await (await helloERC20.connect(signer).bridge(args.dest, wallet, ethers.parseEther(args.amount), overrides)).wait();

		console.log("sent", args.amount, " of tokens to", wallet, "on chain id", args.dest);
	});
