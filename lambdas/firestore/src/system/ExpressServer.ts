import { ProjectConfig } from './ProjectConfig';
import { ConsoleColor } from '../app/models/common/ConsoleColor';
import { App } from '../app';
import * as express from 'express';
import * as bodyParser from 'body-parser';
// Prepare the server

export class ExpressServer {
    static async startServer() {
        let app = express();
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true }));

        // Import routers
        let _count = 1;
        let routes = App.getAllRouters();

        // Loop to register routers
        console.log(ConsoleColor.Green, 'API endpoints: \n');

        for (let rtString in routes) {
            let controller: (req) => Promise<any> = routes[rtString];
            let rts = rtString.split('://');
            let path = `/${ProjectConfig.STAGE}/${ProjectConfig.ENGINE}/${ProjectConfig.ALIAS}/${rts[1]}`;
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

        app.listen(ProjectConfig.DEV_PORT, () => {
            console.log(ConsoleColor.White, `\n Server is listenning on port ${ProjectConfig.DEV_PORT}`);
        });
    }
}
