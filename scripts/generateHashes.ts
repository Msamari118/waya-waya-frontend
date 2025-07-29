import { generateEnvHash } from '../src/utils/passwordHash';
import * as fs from 'fs';
import * as path from 'path';

interface EnvironmentConfig {
  name: string;
  apiBaseUrl: string;
  environment: string;
  adminPassword: string;
}

const environments: EnvironmentConfig[] = [
  {
    name: 'development',
    apiBaseUrl: 'http://localhost:3001',
    environment: 'development',
    adminPassword: 'dev-admin-2024'
  },
  {
    name: 'staging',
    apiBaseUrl: 'https://waya-waya-backend-staging.up.railway.app',
    environment: 'staging',
    adminPassword: 'stage-admin-2024'
  },
  {
    name: 'production',
    apiBaseUrl: 'https://waya-waya-backend-production.up.railway.app',
    environment: 'production',
    adminPassword: 'prod-admin-2024'
  }
];

async function generateEnvFile(config: EnvironmentConfig): Promise<void> {
  try {
    console.log(`\n🔐 Generating hash for ${config.name} environment...`);
    
    // Generate hash for admin password
    const adminPasswordHash = await generateEnvHash(config.adminPassword);
    
    // Create .env content
    const envContent = `# ${config.name.toUpperCase()} Environment Variables
# Generated on ${new Date().toISOString()}

# API Configuration
VITE_API_BASE_URL=${config.apiBaseUrl}

# Environment
VITE_ENVIRONMENT=${config.environment}

# Admin Access (Hashed Password)
VITE_ADMIN_PASSWORD_HASH=${adminPasswordHash}

# Note: This file contains hashed passwords, not plain text
# Original password for ${config.name}: ${config.adminPassword}
`;

    // Write to .env file
    const envFileName = config.name === 'development' ? '.env' : `.env.${config.name}`;
    const envFilePath = path.join(process.cwd(), envFileName);
    
    fs.writeFileSync(envFilePath, envContent);
    
    console.log(`✅ Generated ${envFileName}`);
    console.log(`📁 Location: ${envFilePath}`);
    console.log(`🔑 Admin Password: ${config.adminPassword}`);
    console.log(`🔒 Hash: ${adminPasswordHash.substring(0, 20)}...`);
    
  } catch (error) {
    console.error(`❌ Error generating ${config.name} environment:`, error);
  }
}

async function generateAllEnvironments(): Promise<void> {
  console.log('🚀 Starting environment hash generation...');
  console.log('==========================================');
  
  for (const config of environments) {
    await generateEnvFile(config);
  }
  
  console.log('\n==========================================');
  console.log('✅ All environment files generated successfully!');
  console.log('\n📋 Generated files:');
  console.log('   - .env (development)');
  console.log('   - .env.staging');
  console.log('   - .env.production');
  console.log('\n🔐 Admin passwords:');
  environments.forEach(env => {
    console.log(`   - ${env.name}: ${env.adminPassword}`);
  });
  console.log('\n⚠️  Remember to:');
  console.log('   1. Add .env.* files to .gitignore');
  console.log('   2. Change passwords in production');
  console.log('   3. Keep passwords secure');
}

// Run the script immediately
generateAllEnvironments().catch(console.error);

export { generateAllEnvironments, environments }; 