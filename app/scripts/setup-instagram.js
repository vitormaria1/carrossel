#!/usr/bin/env node

const readline = require('readline');
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env.local');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function updateEnv(key, value) {
  let envContent = fs.readFileSync(envPath, 'utf-8');

  if (envContent.includes(key)) {
    envContent = envContent.replace(
      new RegExp(`${key}=.*`),
      `${key}=${value}`
    );
  } else {
    envContent += `\n${key}=${value}`;
  }

  fs.writeFileSync(envPath, envContent);
}

function main() {
  console.log('📱 Setup Instagram Business Account\n');

  rl.question('Digite o ID da sua Business Account do Instagram: ', (businessAccountId) => {
    if (!businessAccountId.trim()) {
      console.error('❌ ID é obrigatório');
      rl.close();
      process.exit(1);
    }

    updateEnv('INSTAGRAM_BUSINESS_ACCOUNT_ID', businessAccountId.trim());

    console.log(`\n✅ Configuração salva em .env.local`);
    console.log(`   INSTAGRAM_BUSINESS_ACCOUNT_ID=${businessAccountId.trim()}`);
    console.log('\n✅ Agora você pode rodar: npm run dev');

    rl.close();
  });
}

main();
