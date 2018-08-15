import { FirestoreRepository } from '../../scripts/firebase/FirestoreRepository';
import { LinearRegressor } from '../models/regression/LinearRegressor';
import { Monica, IMonica } from '../models/monica/Monica';
import { DataHelper } from '../../scripts/helper/DataHelper';
import { ServiceConfig } from '../../system/Config';

export interface ILinearRegressionService {
    getModel(_id: string): Promise<Monica>;
    createModel(data: IMonica): Promise<Monica>;
    updateModel(_id: string, data: Monica): Promise<boolean>;
    trainModelFromCsv(input: {fileUrl, config}): Promise<{model}>;
    deleteModel(_id: string): Promise<boolean>;
}

export class LinearRegressionService implements ILinearRegressionService {
    protected modelRepository: FirestoreRepository;

    constructor() {
        this.modelRepository = new FirestoreRepository(ServiceConfig.DATABASE.TABLES.MODEL);
    }

    async getModel(_id: string): Promise<Monica> {
        return await this.modelRepository.get(_id);
    }

    async createModel(data: IMonica): Promise<Monica> {
        let monicaCreate = new Monica(data).export();
        return await this.modelRepository.create(monicaCreate);
    }

    async updateModel(_id: string, data: IMonica): Promise<boolean> {
        return await this.modelRepository.update(_id, data);
    }

    async deleteModel(_id: string): Promise<boolean> {
        return await this.modelRepository.delete(_id);
    }

    async trainModelFromCsv(input: {fileUrl, config, modelId}): Promise<{model}> {
        if (!input || !input.fileUrl || !input.modelId)
            return {model: null};

        let labels_data: any[] = [];
        let features_data: any[] = [];
        // STEP 1: READ FILE FROM URL TO RAM
        let data = await DataHelper.readCsvFromUrl(input.fileUrl);
        if (!input.config) {
            input.config = {};
        };
        if (!input.config.indexFeatures || !input.config.indexLabel) {
            let firstRow = data[0];
            let indexFeatures:  number[] = [];
            input.config.indexLabel = firstRow.length - 1;
            for (let i = 0; i < firstRow.length - 1; i++) {
                indexFeatures.push(i);
            };
            input.config.indexFeatures = indexFeatures;
        }
        data.forEach(row => {
            if (!row || !row.length || !row[0])
                return;
            else {
                let feature_row: any[] = [];
                input.config!.indexFeatures!.forEach(index => {
                    feature_row.push(row[index])
                });
                features_data.push(feature_row);
                labels_data.push(row[input.config!.indexLabel!]);
            }
        });
        // STEP 1.5: GET THE MODEL FROM FIRESTORE
        let result = await this.getModel(input.modelId);
        if (!result)
            return {model: null};
        // STEP 2: CREATE A LINEAR REGRESSION MODEL
        let model = new LinearRegressor(result);
        let iterations = model.config.iterations;
        model.mergeConfig(input.config);
        // STEP 3: NORMALIZE DATASET
        if (result && result.config && result.config.normalize) {
            let {features, labels} = DataHelper.normalizeDataset(features_data, labels_data);
            features_data = features;
            labels_data = labels;
        }
        // STEP 4: TRAIN THE MODEL
        await model.train(features_data, labels_data, (i, cost) => {
            if (i % Math.floor(input.config!.iterations! / 100) === 0)
                console.log(`Epoch ${i} loss is: ${cost}`);
        });
        model.config.iterations += iterations;
        await this.updateModel(model._id!, model.export());
        // STEP 5: RETURN CUSTOMIZED VALUES
        return {
            model: model.export()
        };;
    }
}