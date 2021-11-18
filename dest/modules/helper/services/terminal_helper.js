"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TerminalHelper = void 0;
const child_process_1 = require("child_process");
const logger_1 = require("../../logger");
const error_1 = require("../../error");
class TerminalHelper {
    static execute(cammand) {
        return new Promise((resolve, reject) => {
            const ls = child_process_1.exec(cammand, (error, stdout, stderr) => {
                if (error) {
                    logger_1.Logger.error(`Terminal Execute Error`);
                    logger_1.Logger.warn(`Error message: ${error.message.toString()}`);
                    return reject(new error_1.errorTerminalExecute(error.message.toString()));
                }
                if (stderr) {
                    console.log(`Terminal STDERR Error`);
                    logger_1.Logger.warn(`Error message: ${stderr.toString()}`);
                    return reject(new error_1.errorTerminalExecute(stderr.toString()));
                }
                return resolve(stdout || true);
            });
            ls.stdout.on('data', (data) => {
                data = data.toString().replace('\n', '');
                if (data) {
                    logger_1.Logger.debug(`Terminal STDOUT: ${data}`);
                }
            });
            ls.stderr.on('data', (data) => {
                data = data.toString().replace('\n', '');
                if (data) {
                    logger_1.Logger.debug(`Terminal STDERR: ${data}`);
                }
            });
            ls.on('exit', (code) => {
                logger_1.Logger.debug(`Terminal Execute Successfully! Code: ${code}`);
            });
        });
    }
}
exports.TerminalHelper = TerminalHelper;
//# sourceMappingURL=terminal_helper.js.map