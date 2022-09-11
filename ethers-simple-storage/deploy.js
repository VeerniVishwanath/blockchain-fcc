require("dotenv").config();
const ethers = require("ethers");
const fs = require("fs-extra");

async function main() {
  //To connect script to our Local Blockchain
  const rcpURL = "http://127.0.0.1:8545";
  const provider = new ethers.providers.JsonRpcProvider(rcpURL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  /*To deploy we need to contract binary and abi 
    we use fs to access those files*/
  const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf8");
  const binary = fs.readFileSync(
    "./SimpleStorage_sol_SimpleStorage.bin",
    "utf8"
  );

  //contract factory is an object used to deploy contracts
  const contractFactory = new ethers.ContractFactory( abi, binary, wallet );
  console.log( "Deploying,please wait...." );
  const contract = await contractFactory.deploy();
  console.log(contract);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
