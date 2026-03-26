import hre from "hardhat";
const { ethers } = hre;

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const ArcXMarketplace = await ethers.getContractFactory("ArcXMarketplace");
  const maxSupply = 1000; // Set initial max supply
  const marketplace = await ArcXMarketplace.deploy(maxSupply);

  await marketplace.waitForDeployment();

  const address = await marketplace.getAddress();
  console.log("ArcXMarketplace deployed to:", address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
