import * as path from 'path';
import { runTests, downloadAndUnzipVSCode, resolveCliArgsFromVSCodeExecutablePath } from '@vscode/test-electron';

async function main() {
    try {
        // The folder containing the Extension Manifest package.json
        const extensionDevelopmentPath = path.resolve(__dirname, '../../');

        // The path to test runner
        const extensionTestsPath = path.resolve(__dirname, './suite/index');

        // Download VS Code
        const vscodeExecutablePath = await downloadAndUnzipVSCode('stable');

        // On Windows, use the CLI wrapper instead of Code.exe directly
        const [cli, ...args] = resolveCliArgsFromVSCodeExecutablePath(vscodeExecutablePath);

        // Run the integration test
        await runTests({
            vscodeExecutablePath: cli,
            extensionDevelopmentPath,
            extensionTestsPath
        });
    } catch (err) {
        console.error('Failed to run tests:', err);
        process.exit(1);
    }
}

main();
