// SPDX-License-Identifier: MIT
// (c)2024 Atlas (atlas@vialabs.io)
pragma solidity =0.8.17;

import "@vialabs-io/contracts/message/MessageClient.sol";
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