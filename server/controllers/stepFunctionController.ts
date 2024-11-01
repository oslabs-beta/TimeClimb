import Knex from 'knex';
const pg = Knex({
  client: 'pg',
  //needs to be moved to env
  connection: 'postgresql://postgres:Dudeman32%211@localhost:5432/time_climb',
});
import { Request, Response, NextFunction } from 'express';
import 'dotenv/config';
import {
  SFNClient,
  ListStateMachinesCommand,
  ListStateMachinesCommandOutput,
  ListStateMachineVersionsCommand,
  ListStateMachineVersionsCommandOutput,
  DescribeStateMachineCommand,
} from '@aws-sdk/client-sfn';
import { fromEnv } from '@aws-sdk/credential-providers';

//connection to credientials
const sfn = new SFNClient({
  region: process.env.AWS_REGION,
  credentials: fromEnv(),
});

// type Next = (?Function) => void | Promise<void>

//make alias innerface create custom
interface stepFunctionController {
  listStateMachines: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => void | Promise<void>;
}

const stepFunctionController: stepFunctionController = {
  //make request for all state machines from AWS
  listStateMachines: async function (
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const listStateMachines = new ListStateMachinesCommand();
    try {
      const response = await sfn.send(listStateMachines);
      console.log('listSTateMachines response', response);
      //iterate through statemachines array
      //for each machine,
      //get it's details and create an object with properties in database
      response.stateMachines.map((mach) => {
        async function getStateMachineDetails(
          stateMachineArn: string
        ): Promise<undefined> {
          //   const describeStateMachine = getStateMachineDetails({
          //     stateMachineArn,
          //   });
        }
      });
      return next();
    } catch (error) {
      return next(error);
    }
  },
};

// stepFunctionController.hotdog(req, res, next)

//getting state machines from AWS
// stepFunctionController.
export default stepFunctionController;
