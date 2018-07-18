import * as http from 'http';
import * as https from 'https';
import * as parser from 'csv-parse';
import * as LinearRegressor from '../lib/regressor/LinearRegressor';

export class RegressorService {
    static LinearModel = {
        async trainFromCSV(fileUrl: string, config?: LinearRegressor.ModelConfig) {
            // Initiate variables
            let labels_data: any[] = [];
            let features_data: any[] = [];
            // Read data from url
            let data = await readCsvFromUrl(fileUrl);
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
            return {
                loss: model.loss,
                bias: model.bias,
                config: model.config,
                weights: model.weights,
            }
        }
    }
    static PolynomialModel = {

    }
}

function readCsvFromUrl(fileUrl): Promise<any[]> {
    return new Promise((resolve, reject) => {
        let data: any = [];
        if (fileUrl.includes('https')) {
            console.log(`Reading file from url ${fileUrl} ...`);
            https.get(fileUrl, async (res) => {
                res.pipe(parser({delimiter: ','})).on('data', (row: any[]) => {
                    row = row.map(data => Number(data));
                    data.push(row);
                }).on('end', () => {
                    return resolve(data);
                }).on('error', (err) => {
                    return reject(err);
                });
            });
        }
        else
            return resolve(data);
    });
}