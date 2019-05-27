// Import external-modules
import { exec } from 'child_process';

// Import peer-modules
import { Logger } from '../../logger';
import { errorTerminalExecute } from '../../error';

export class TerminalHelper {
    static execute(cammand: string): Promise<string | boolean> {
        return new Promise((resolve, reject) => {
            const ls = exec(cammand, (error, stdout, stderr) => {
                if (error) {
                    Logger.error(`Terminal Execute Error`);
                    Logger.warn(`Error message: ${error.message.toString()}`);
                    return reject(new errorTerminalExecute(error.message.toString()));
                }
                if (stderr) {
                    console.log(`Terminal STDERR Error`);
                    Logger.warn(`Error message: ${stderr.toString()}`);
                    return reject(new errorTerminalExecute(stderr.toString()));
                }
                return resolve(stdout || true);
            });

            ls.stdout.on('data', (data) => {
                data = data.toString().replace('\n', '');
                if (data) {
                    Logger.debug(`Terminal STDOUT: ${data}`);
                }
            });

            ls.stderr.on('data', (data) => {
                data = data.toString().replace('\n', '');
                if (data) {
                    Logger.debug(`Terminal STDERR: ${data}`);
                }
            });

            ls.on('exit', (code) => {
                Logger.debug(`Terminal Execute Successfully! Code: ${code}`);
            });
        });
    }
}