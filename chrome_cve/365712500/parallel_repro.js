// parallel_repro.js, with '--sandbox-testing --sandbox-fuzzing'

import { exec } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const jsFile = path.resolve(__dirname, 'poc.js');

let executionCount = 1000;

function executeFile(index) {
    return new Promise((resolve, reject) => {
        exec(`./d8 --expose-gc --omit-quit --allow-natives-syntax --fuzzing --sandbox-fuzzing --sandbox-testing --jit-fuzzing --harmony --js-staging --wasm-staging --turboshaft-csa ${jsFile}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Execution ${index} failed:`, error);
                reject(error);
            } else {
                console.log(`Execution ${index} completed:`, { stdout, stderr });
                resolve(stdout);
            }
        });
    });
}

async function executeInParallel() {
    const promises = [];
    for (let i = 0; i < executionCount; i++) {
        promises.push(executeFile(i));
    }

    try {
        await Promise.all(promises);
        console.log('All executions completed successfully.');
    } catch (error) {
        console.error('Some executions failed:', error);
    }
}

executeInParallel();