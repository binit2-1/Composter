const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const mode = process.argv[2];

if(!['dev', 'test'].includes(mode)) {
    console.error("Usage: node scripts/test-bootstrap.js dev or test");
    process.exit(0);
}

const isTest = mode === 'test'
const ROOT_DIR = process.cwd();
const API_DIR = path.join(ROOT_DIR, 'apps/api');

//configuration
const CONFIG = {
    dockerFile: isTest ? 'docker-compose.test.yaml' : 'docker-compose.yaml',
    envFile: isTest ? '.env.test' : '.env',
}

const run = (cmd, cwd = ROOT_DIR) => {
    try {
        console.log(`> ${cmd}`);
        execSync(cmd, { stdio: 'inherit', cwd, env: process.env });
    } catch (e) {
        console.error(`❌ Command failed: ${cmd}`);
        process.exit(1);
    }
};

async function main() {
    console.log(`🚀 Setting up ${mode.toUpperCase()} environment...`);

    if(!fs.existsSync(ROOT_DIR, 'node_modules')){
        run('npm install');
    }

    console.log('🐳 Resetting Database Containers...');
    try{
        execSync(`docker compose -f ${CONFIG.dockerFile} down -v`)
    } catch(error){
        //Ignore if already down
    }

    console.log('🐳 Starting Database...');
    run(`docker compose -f ${CONFIG.dockerFile} up -d`);

    console.log(`Waiting for db to be ready...`)
    await new Promise(r=>setTimeout(r, 5000));

    console.log('🔄 Syncing Schema...');

    const envFile = `npx dotenv-cli -e ${CONFIG.envFile} --`

    if(isTest){
        run(`${envFile} npx prisma migrate dev --name test`, API_DIR)

        console.log(`better-auth migrations`)
        run(`${envFile} npx @better-auth/cli migrate --config auth/auth.js`, API_DIR)
    } else {
        run(`${envFile} npx prisma migrate dev --name dev`, API_DIR)

        console.log(`better-auth migrations`)
        run(`${envFile} npx @better-auth/cli migrate --config auth/auth.js`, API_DIR)
    }

    console.log(`✅ Setup complete!`)
}

main().catch((e)=>{
    console.error(e);
    process.exit(1);
})