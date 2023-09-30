// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

//Deployed to sepolia at 0x976613Bd114F659Ada18f49CD20E285c7C1e1D5e

contract BuyMeACoffee {
    //Events Emmitted
    event NewMemo(
        address indexed from,
        uint256 timestamp,
        string name,
        string message
    );

    struct Memo {
        address from;
        uint256 timestamp;
        string name;
        string message;
    }

    Memo[] memos;

    //Deployer Address
    address payable owner;

    constructor() {
        owner = payable(msg.sender);
    }

    function buyCoffee(
        string memory _name,
        string memory _message
    ) public payable {
        require(msg.value > 0, "can't buy a cofee with 0th");

        memos.push(Memo(msg.sender, block.timestamp, _name, _message));

        emit NewMemo(msg.sender, block.timestamp, _name, _message);
    }

    function withdrawTips() public {
        require(owner.send(address(this).balance));
    }

    function getMemos() public view returns (Memo[] memory) {
        return memos;
    }
}
