import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';

export interface Config {
  profiles: {
    default: {
      network?: string;
      account?: string;
      rest_url?: string;
    };
  };
}

export function parseYaml(filePath: string): Config {
  const yamlContent = fs.readFileSync(filePath, 'utf-8');
  return yaml.load(yamlContent) as Config;
}

export function getConfigPath(): string {
  return path.join(__dirname, '../.aptos/config.yaml');
}

export function getMoveTomlPath(): string {
  return path.join(__dirname, '../Move.toml');
}

export function getNetworkFromConfig(): string {
  const config = parseYaml(getConfigPath());
  return config.profiles.default.network || '';
}

export function getAccountFromConfig(): string {
  const config = parseYaml(getConfigPath());
  return config.profiles.default.account || '';
}

export function getRestUrlFromConfig(): string {
  const config = parseYaml(getConfigPath());
  return config.profiles.default.rest_url || '';
}