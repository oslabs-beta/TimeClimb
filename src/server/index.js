import pkg from "@aws-sdk/client-sfn";
import 'dotenv/config';
console.log('AWS_REGION:', process.env.AWS_REGION)
console.log('Key ID:', process.env.AWS_ACCESS_KEY_ID);
console.log('Secret Key:', process.env.AWS_SECRET_ACCESS_KEY);
const {SFNClient, ListExecutionsCommand, GetExecutionHistoryCommand} = pkg;
//load environment variables 
const AWS_REGION = process.env.AWS_REGION;
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
const client = new SFNClient({region: AWS_REGION,
                                credentials: {
                                    accessKeyId: AWS_ACCESS_KEY_ID,
                                    secretAccessKey: AWS_SECRET_ACCESS_KEY
                                }
 });
//input for listExecutions
const listExecutionsInput = {
    //probably need to move this to env file
    stateMachineArn: "arn:aws:states:us-west-2:703671926773:stateMachine:BasicsHelloWorldStateMachine",
}
const listExCommand = new ListExecutionsCommand(listExecutionsInput);
//input for getExecutionHIstory
const getExHistoryInput = {
    //probably need to move these to env file
    executionArn: "arn:aws:states:us-west-2:703671926773:execution:BasicsRequestResponseStateMachine:b976763a-1e2d-4035-9561-39eb718c6d1d",
    includeExecutionData: true,
}
const getExHistoryCommand = new GetExecutionHistoryCommand(getExHistoryInput);

//listExecutions function (currently returns an array of run times for each state machine execution)
async function listExecutionRunTimes(){

try {
    const response = await client.send(listExCommand);
   // console.log('response', response.executions);
   const timesList = response.executions.map((ex) => {
    //retrieve start time and stop time from each execution
   const currentStart = new Date(ex.startDate.getTime());
   const currentEnd = new Date(ex.stopDate.getTime());
    return (currentEnd - currentStart) / 1000
   })
   console.log('timesList', timesList)
} catch(error) {
    console.log("Error:", error)
}
}
listExecutionRunTimes()

async function listExecutionEventInfo(){
    const stepInfo = [];
    let currentObj = {};
    try{

        const response = await client.send(getExHistoryCommand);
       console.log(response.events)
        //iterate through response array
        response.events.forEach((ev) => {
            //if new step is found
            if(ev.type.endsWith('StateEntered')){
                //add its name to currentObj
                currentObj.step = ev.stateEnteredEventDetails.name;
                //set it's start time as prop
                currentObj.startTime = ev.timestamp;
                //if we hit the end of a step
            } else if(ev.type.endsWith('StateExited')){
                //add the end time, push into stepInfo and clear currentObj for next new step
                //still need to add total time as property as well!!!
                currentObj.endTime = ev.timestamp;
                stepInfo.push(currentObj);
                currentObj = {};
            }
        })
    //  const enteredStates = response.events.filter((ev) => ev.type.endsWith('StateEntered'));
    //  console.log('enteredStates:', enteredStates)
        console.log(stepInfo)
    } catch(error){
        console.log("Error:", error)
    }
}
listExecutionEventInfo()

