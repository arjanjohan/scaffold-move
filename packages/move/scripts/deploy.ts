import { execSync } from 'child_process';
import minimist from 'minimist';
import { getNetworkFromConfig } from './utils';

async function main(): Promise<void> {
  // Parse command line arguments
  const argv = minimist(process.argv.slice(2));

  // Get network from config
  const network = getNetworkFromConfig();

  // Determine if network is custom (localhost or custom URL)
  const isCustomNetwork = network.includes('Custom');

  // Build deploy command
  let deployCommand = 'aptos move publish';
  if (isCustomNetwork) {
    // Default to move-1 and bytecode-version 6 for custom networks, needed for deployment to Movement
    deployCommand += ' --move-1 --bytecode-version 6';
  }

  // Add assume-yes flag
  deployCommand += ' --assume-yes';

  try {
    // Execute deploy command
    console.log(`Executing: ${deployCommand}`);
    execSync(deployCommand, { stdio: 'inherit' });

  } catch (error) {
    console.error('Deployment failed:', error instanceof Error ? error.message : 'Unknown error');
    process.exit(1);
  }
}

main().catch(console.error);