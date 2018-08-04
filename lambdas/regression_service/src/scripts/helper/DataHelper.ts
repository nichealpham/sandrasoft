import * as https from 'https';
import * as parser from 'csv-parse';

export class DataHelper {
    // Shuffles data and label using Fisher-Yates algorithm.
    static shuffleDataset(features: any[], labels: any[]) {
        let counter = features.length;
        let temp = 0;
        let index = 0;
        while (counter > 0) {
            index = (Math.random() * counter) | 0;
            counter--;
            // Shuffle features:
            temp = features[counter];
            features[counter] = features[index];
            features[index] = temp;
            // Shuffle labels:
            temp = labels[counter];
            labels[counter] = labels[index];
            labels[index] = temp;
        }
        return {features, labels};
    }

    static normalizeDataset(features: number[][], labels: number[]) {
        let maxLabel = 0;
        labels.forEach(label => {
            if (label > maxLabel) maxLabel = label;
        });
        labels = labels.map(label => label / maxLabel);
        for (let i = 0; i < features[0].length; i++) {
            let maxColumn = 0;
            features.forEach(featureRow => {
                if (featureRow[i] > maxColumn) maxColumn = featureRow[i];
            });
            for (let j = 0; j < features.length; j++) {
                features[j][i] = features[j][i] / maxColumn;
            }
        };
        return {features, labels};
    }

    static readCsvFromUrl(fileUrl): Promise<any[]> {
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
}