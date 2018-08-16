import { DatabaseEngines } from './system/DatabaseEngines';
import { ServiceGateway } from './system/ServiceGateway';

async function setup() {
    DatabaseEngines.initialize();
    ServiceGateway.initialize();
}
setup();

import { Serverless } from './system/Serverless';
export = Serverless.getRouters();
