import { execSync } from 'child_process';

async function main(): Promise<void> {
  const deployCommand = 'aptos move publish --assume-yes';

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