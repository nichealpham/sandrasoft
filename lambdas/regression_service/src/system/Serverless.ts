import {ServiceLoader} from '../system/ServiceLoader';
ServiceLoader.init();
import {LinearRegressionController} from '../application/controllers/LinearRegressionController';

export = {
    createModel: LinearRegressionController.createModel.mainfunc,
    trainLinearModel: LinearRegressionController.trainModel.mainfunc,
}
