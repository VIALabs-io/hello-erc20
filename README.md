# HelloERC20

`HelloERC20` is an example `ERC20` token implemented in Solidity, designed for cross-chain operations without relying on traditional bridge mechanisms. Utilizing the CryptoLink.Tech NPM package and MessageClient extension, it demonstrates a bridgeless approach to native token minting and burning across different blockchain networks.

## Features

- **ERC20 Token Implementation**: A standard `ERC20` token with additional burnable functionality.
- **Cross-Chain Functionality**: Native support for cross-chain interactions without using a bridge.
- **CryptoLink.Tech Integration**: Leverages the CryptoLink.Tech NPM package for seamless cross-chain communication.
- **Configurable on Multiple Networks**: Can be deployed and configured across various blockchain networks.

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js and npm (Node Package Manager)
- A text editor such as VSCode for editing `.sol` and `.ts` files
- GIT installed
- Testnet Tokens ([fantom testnet faucet](https://faucet.fantom.network/) and [polygon testnet faucet](https://faucet.polygon.technology/))

Please visit [node documentation link](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) and the [git install documentation](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) for more information.


## Installation

Please open a terminal to run the following commands. You can use any terminal of your choice, including the built in terminal in vscode (Terminal -> New Terminal)

1. **Clone the Repository**: 
```bash
git clone https://github.com/CryptoLinkTech/hello-erc20.git
```

2. **Open in IDE**: 
After cloning the repository, if using vscode or a similar IDE, you can now open the hello-erc20 in your IDE of choice.
```bash
code hello-erc20
```

1. **Install Dependencies**: 
In vscode (Terminal -> New Terminal)
```bash
npm install
```

1. **Set Up Environment Variables**:
Create a new `.env` file to set your EVM private key for contract deployment or copy and edit the existing `.env.example` to `.env`
```bash
PRIVATE_KEY=0000000000000000000000000000
```

## Deployment

Deploy the `HelloERC20` contract to your desired networks. This must be done for each network you wish to operate on. You can see a list of our networks in the [NPM package documentation](https://github.com/CryptoLinkTech/npm?tab=readme-ov-file#testnets)

1. **Fantom Testnet**:
```bash
npx hardhat --network fantom-testnet deploy
```

2. **Polygon Testnet**:
```bash
npx hardhat --network polygon-testnet deploy
```

## Configuration

Once all contracts are deployed across the desired networks and listed in `networks-testnet.json`, configure them using the provided script. Remember, if a new network is added later, all contracts must be reconfigured.

1. **Fantom Testnet**:
```bash
npx hardhat --network fantom-testnet configure
```

2. **Polygon Testnet**:
```bash
npx hardhat --network polygon-testnet configure
```

## Usage

### Checking Token Balance

To check the balance of tokens on a particular chain:

```bash
npx hardhat --network fantom-testnet get-token-balance
```

### Bridging Tokens to Another Chain

To send tokens to another chain it is required to set the `--dest` parameter to the destination chain id. The example below uses the id for the Polygon Testnet. Chain IDs can be looked up in the [NPM package documentation](https://github.com/CryptoLinkTech/npm?tab=readme-ov-file#testnets).

```bash
npx hardhat --network fantom-testnet bridge-token --dest 80001 --amount 50
```

### Check Tokens on Destination Chain

You can now check the balance on the destination chain. **Please give the transaction some time to process.** You should see your balance increase on the destination chain:

```bash
npx hardhat --network polygon-testnet get-token-balance
```

## Contract Breakdown of `HelloERC20`

This contract is an `ERC20` token with additional functionalities for cross-chain operations. It inherits from `ERC20Burnable` for standard `ERC20` functionality with burn capabilities and from `MessageClient` for handling cross-chain messages.

```solidity
pragma solidity =0.8.17;

import "@cryptolink/contracts/message/MessageClient.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

contract HelloERC20 is ERC20Burnable, MessageClient {
    constructor() ERC20("HelloERC20", "HELLO") {
        _mint(msg.sender, 1_000_000 ether);
    }

    function bridge(uint _destChainId, address _recipient, uint _amount) external onlyActiveChain(_destChainId) {
        // burn tokens
        _burn(msg.sender, _amount);

        // send cross chain message
        _sendMessage(_destChainId, abi.encode(_recipient, _amount));
    }

    function messageProcess(uint, uint _sourceChainId, address _sender, address, uint, bytes calldata _data) external override  onlySelf(_sender, _sourceChainId)  {
        // decode message
        (address _recipient, uint _amount) = abi.decode(_data, (address, uint));

        // mint tokens
        _mint(_recipient, _amount);
    }
}
```

### Constructor

```solidity
constructor() ERC20("HelloERC20", "HELLO") {
    _mint(msg.sender, 1_000_000 ether);
}
```

- Initializes the token with the name "HelloERC20" and symbol "HELLO".
- Mints 1,000,000 tokens to the address deploying the contract.

### Function: `bridge`

```solidity
function bridge(
    uint _destChainId, 
    address _recipient, 
    uint _amount
) external onlyActiveChain(_destChainId) {
    // burn tokens
    _burn(msg.sender, _amount);

    // send cross chain message
    _sendMessage(_destChainId, abi.encode(_recipient, _amount));
}
```

- Allows a user to send tokens to another chain.
- **Parameters**:
  - `_destChainId`: The ID of the destination chain.
  - `_recipient`: The recipient's address on the destination chain.
  - `_amount`: The amount of tokens to send.
- **Process**:
  - Burns the specified `_amount` of tokens from the sender's balance.
  - Encodes the `_recipient` address and `_amount` into bytes (`_data`).
  - Calls `_sendMessage`, a function from `MessageClient`, to send this encoded data to the destination chain.
- **Modifiers**:
  - `onlyActiveChain`: A modifier restricts this function to be called only if the destination chain is active.

### Function: `messageProcess`

```solidity
function messageProcess(
    uint, 
    uint _sourceChainId, 
    address _sender, 
    address, 
    uint, 
    bytes calldata _data
) external override  onlySelf(_sender, _sourceChainId)  {
    // decode message
    (address _recipient, uint _amount) = abi.decode(_data, (address, uint));

    // mint tokens
    _mint(_recipient, _amount);
}
```

- Handles incoming messages from other chains.
- **Parameters**:
  - `_sourceChainId`: The ID of the source chain from where the message is sent.
  - `_data`: Encoded data containing the recipient's address and the amount.
- **Process**:
  - Decodes `_data` to extract `_recipient` and `_amount`.
  - Mints `_amount` of tokens to `_recipient`'s address on the current chain.
- **Modifiers**:
  - `onlySelf`: A modifier restricts this function to be called only if the message was sent from the corresponding deployments of this contract on the source chain.
