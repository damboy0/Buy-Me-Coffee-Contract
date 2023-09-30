// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function getBalance(address) {
  const balanceBigInt = await hre.waffle.provider.getBalance(address);
  return hre.ethers.utils.formatEther(balanceBigInt);
}

async function printBalances(addresses) {
  let idx = 0;
  for (const address of addresses) {
    console.log(`Address ${idx} balance:`, await getBalance(address));
    idx++;
  }
}

async function printMemos(memos) {
  for (const memo of memos) {
    const timestamp = memo.timestamp;
    const tipper = memo.name;
    const tipperAddress = memo.address;
    const message = memo.message;

    console.log(`At ${timestamp}, ${tipper} ${tipperAddress} said: ${message}`);
  }
}

async function main() {
  const [owner, tipper, tipper2, tipper3] = await hre.ethers.getSigners();

  const BuyMeACoffee = await hre.ethers.getContractFactory("BuyMeACoffee");
  const buyMeACoffee = await BuyMeACoffee.deploy();
  await buyMeACoffee.deployed();
  console.log(`BuyMeCoffee Deployed to Address:`, buyMeACoffee.address);

  const addresses = [owner.address, tipper.address, buyMeACoffee.address];
  console.log("== Beginnig ==");
  await printBalances(addresses);

  const tip = { value: hre.ethers.utils.parseEther("1") };
  await buyMeACoffee.connect(tipper).buyCoffee("Vijjay ", "Weldone Champ", tip);
  await buyMeACoffee
    .connect(tipper2)
    .buyCoffee("Pranav", "Keep up the good work", tip);
  await buyMeACoffee
    .connect(tipper3)
    .buyCoffee("Arjun", "You're the best", tip);

  //check balance after coffee Buy
  console.log("== Coffee Bought ==");
  await printBalances(addresses);

  //Withdraw funds to owner
  await buyMeACoffee.connect(tipper).withdrawTips();
  console.log("== After WithdrawTips ==");
  await printBalances(addresses);

  //Print Memos
  const memos = await buyMeACoffee.connect(tipper).getMemos();
  console.log("== Print Memos ==");
  printMemos(memos);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
