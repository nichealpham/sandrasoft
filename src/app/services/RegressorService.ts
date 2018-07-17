import * as http from 'http';
import * as https from 'https';
import * as fs from 'fs';
import * as timer from 'node-simple-timer';
import * as LinearRegressor from '../libs/regressor/LinearRegressor';
import DataHelper from '../libs/helper/DataHelper';

export class RegressorService {
    static LinearModel = {
        async trainFromCSV(filePath: string, config?: LinearRegressor.ModelConfig) {
            let totalTimer = new timer.Timer();
            totalTimer.start();
            let destDirName = `${__dirname}/tmp`;
            DataHelper.createDir(destDirName);
            await downloadFileFromUrl(filePath, destDirName);
            let data = await DataHelper.readNumericsFromCsv(`${destDirName}/${getFileNameFromUrl(filePath)}`);
            let labels_data: any[] = [];
            let features_data: any[] = [];
            data.forEach(row => {
                if (!row || !row.length || !row[0])
                    return;
                else {
                    labels_data.push(Math.floor(row[row.length - 2] / 1000));
                    features_data.push([row[3] / 1000, row[4] / 1000, row[6] / 200]);
                }
            });
            let model = new LinearRegressor.Model(config);
            await model.train(features_data, labels_data, (i, cost) => {
                console.log(`Epoch ${i} loss is: ${cost}`);
            });
            totalTimer.end();
            DataHelper.removeDir(destDirName);
            return {
                loss: model.loss,
                bias: model.bias,
                config: model.config,
                weights: model.weights,
                executionTime: totalTimer.seconds().toFixed(2)
            }
        }
    }
    static PolynomialModel = {

    }
}

function getFileNameFromUrl(url: string): string {
    return url.substring(url.lastIndexOf('/') + 1, url.indexOf('.') < 0 ? url.length : url.lastIndexOf('.'));
}
async function downloadFileFromUrl(url, destDirName: string = './tmp') {
    return new Promise((resolve, reject) => {
        let writeStream = fs.createWriteStream(`${destDirName}/${getFileNameFromUrl(url)}`);
        console.log(`Downloading and Writing ${getFileNameFromUrl(url)} to ${destDirName}`);
        function callback(res) {
            res.pipe(writeStream);
            res.on('end', () => {resolve()})
        }
        if (url.includes('https')) https.get(url, async(res) => {callback(res)}).on('error', (e) => {reject(e)});
        else http.get(url, async(res) => {callback(res)}).on('error', (e) => {reject(e)});
    });
}