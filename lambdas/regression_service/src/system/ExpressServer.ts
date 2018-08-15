import * as express from 'express';
import * as bodyParser from 'body-parser';
// Prepare the server
let app = express();
let router = express.Router();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
// Init All services before registering controllers into routers
import { DatabaseEngines } from './DatabaseEngines';
DatabaseEngines.initialize();
import { ServiceGateway } from './ServiceGateway';
ServiceGateway.initialize();
// Import routers
import { ConsoleColor } from '../application/models/common/ConsoleColor';
import { LinearRegressionController } from '../application/controllers/LinearRegressionController';
// Combining all routers
let _count = 1;
let routes = {
	...LinearRegressionController.getAsRounter(),
};
// Loop to register routers
console.log(ConsoleColor.Green, 'API endpoints: \n');
for (let rtString in routes) {
	let controller: (req) => Promise<any> = routes[rtString];
	let rts = rtString.split('://');
	let path = `/` + rts[1];
	let method = rts[0].toLowerCase();
	console.log(ConsoleColor.Red, `${_count++}.  ${method.toUpperCase()} =>`, ConsoleColor.Cyan, `${path}`);

	app[method](path, async (req, res) => {
		let result, response;
		let isError = false;
		try {
			result = await controller(req);
			response = {
				statusCode: 200,
				body: result
			}
		}
		catch (err) {
			isError = true;
			response = {
				statusCode: 500,
				error: err
			}
		}
		if (!isError)
			return res.json(response);
		else
			return res.status(500).json(response);
	});
};
console.log('\n');
import { ServiceConfig } from './Config';
app.listen(ServiceConfig.EXPRESS_PORT, () => {
	console.log(ConsoleColor.White, `\n Server is listenning on port ${ServiceConfig.EXPRESS_PORT}`);
});