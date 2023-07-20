// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import {ILayerZeroEndpoint} from "./lz/ILayerZeroEndpoint.sol";
import {ILayerZeroReceiver} from "./lz/ILayerZeroReceiver.sol";

import "hardhat/console.sol";

/**
 * @dev To send cross chain messages, contracts will use an endpoint to send() 
 *      from the source chain and lzReceive() to receive the message on the 
 *      destination chain.In order to use it, we need to import the interface 
 *      from LayerZero repository.
 *
 *      This Sender contract will send to the Receiver contract, and will in turn
 *      receive whatever the Receiver contract sent.
 *
 *      Goerli: 0x3ACc9B365aB90742659161Cc10e40E6DD664147F.
 */

contract Sender is ILayerZeroReceiver {
    ILayerZeroEndpoint public endpoint;
    uint256 public sentMessageCount;
    uint256 public receivedMessageCount;
    bytes[] public message;

    event ReceiveMsg(
        uint16 _srcChainId,
        address _from,
        uint256 _count,
        bytes _payload
    );

    constructor(address _endpoint) {
        endpoint = ILayerZeroEndpoint(_endpoint);
    }

    function name() public pure returns (string memory) {
        return "Sender";
    }

    function getCounts() public view returns (uint256, uint256) {
        return (sentMessageCount, receivedMessageCount);
    }

    function sendMsg(
        uint16 _dstChainId,
        bytes calldata _destination,
        bytes calldata payload
    ) public payable {
        sentMessageCount++;

        endpoint.send{value: msg.value}(
            _dstChainId,
            _destination,
            payload,
            payable(msg.sender),
            address(this),
            bytes("")
        );
    }

    function lzReceive(
        uint16 _srcChainId,
        bytes memory _from,
        uint64,
        bytes memory _payload
    ) external override {
        require(msg.sender == address(endpoint));
        address from;
        assembly {
            from := mload(add(_from, 20))
        }
        if (
            keccak256(abi.encodePacked((_payload))) ==
            keccak256(abi.encodePacked((bytes10("ff"))))
        ) {
            endpoint.receivePayload(
                1,
                bytes(""),
                address(0x0),
                1,
                1,
                bytes("")
            );
        }
        message.push(_payload);
        receivedMessageCount += 1;
        emit ReceiveMsg(_srcChainId, from, receivedMessageCount, _payload);
    }

    function estimateFees(
        uint16 _dstChainId,
        address _userApplication,
        bytes calldata _payload,
        bool _payInZRO,
        bytes calldata _adapterParams
    ) external view returns (uint256 nativeFee, uint256 zroFee) {
        return
            endpoint.estimateFees(
                _dstChainId,
                _userApplication,
                _payload,
                _payInZRO,
                _adapterParams
            );
    }
}