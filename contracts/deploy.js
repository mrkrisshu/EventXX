import { ethers } from 'hardhat';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  console.log('🚀 Deploying EventXX Smart Contract to Avalanche Fuji...');
  
  // Get the contract factory
  const EventXX = await ethers.getContractFactory('EventXX');
  
  // Deploy the contract
  console.log('📦 Deploying contract...');
  const eventXX = await EventXX.deploy();
  
  // Wait for deployment to be mined
  await eventXX.deployed();
  
  console.log('✅ EventXX deployed to:', eventXX.address);
  console.log('🔗 Transaction hash:', eventXX.deployTransaction.hash);
  
  // Save contract address and ABI
  const contractInfo = {
    address: eventXX.address,
    network: 'avalanche-fuji',
    deployedAt: new Date().toISOString(),
    transactionHash: eventXX.deployTransaction.hash
  };
  
  // Create contracts directory if it doesn't exist
  const contractsDir = path.join(__dirname, '../lib');
  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir, { recursive: true });
  }
  
  // Save deployment info
  fs.writeFileSync(
    path.join(contractsDir, 'deployment.json'),
    JSON.stringify(contractInfo, null, 2)
  );
  
  // Get and save ABI
  const artifact = await ethers.getContractFactory('EventXX');
  const abi = artifact.interface.format(ethers.utils.FormatTypes.json);
  
  fs.writeFileSync(
    path.join(contractsDir, 'EventXX-abi.json'),
    JSON.stringify(JSON.parse(abi), null, 2)
  );
  
  console.log('💾 Contract info saved to lib/deployment.json');
  console.log('💾 ABI saved to lib/EventXX-abi.json');
  
  // Verify contract on snowtrace (optional)
  if (process.env.SNOWTRACE_API_KEY) {
    console.log('🔍 Verifying contract on Snowtrace...');
    try {
      await hre.run('verify:verify', {
        address: eventXX.address,
        constructorArguments: [],
      });
      console.log('✅ Contract verified on Snowtrace');
    } catch (error) {
      console.log('❌ Verification failed:', error.message);
    }
  }
  
  console.log('\n🎉 Deployment completed successfully!');
  console.log('📋 Next steps:');
  console.log('1. Update .env.local with the contract address');
  console.log('2. Update lib/contracts.ts with the new ABI');
  console.log('3. Test the contract functions in your dApp');
}

// Handle errors
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Deployment failed:', error);
    process.exit(1);
  });