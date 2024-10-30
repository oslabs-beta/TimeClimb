interface ASL {
  States: {
    [stateName: string]: {
      Type: string;
    };
  };
}
interface StateContent {
  Type: string;
  Branches?: Branch[];
  Comment?: string;
  ItemProcessor?: ItemProcessor;
}
interface States {
  [stateName: string]: StateContent;
}
interface Branch {
  States: {
    [stateName: string]: StateContent;
  };
}
interface ItemProcessor {
  States: {
    [stateName: string]: StateContent;
  };
}
interface ParsedStates {
  [stateName: string]: {
    type: string;
    comment?: string;
  };
}
/**
 *
 * @param asl The full step function definition parsed a javascript object
 * @returns Promise<ParsedStates> - promise which resolves to an object of
 * states, with key as state names and values an object with a type and
 * comment property.
 */
const parseStepFunction = async (asl: ASL): Promise<ParsedStates> => {
  const states = asl.States;
  const parsedStates: ParsedStates = {};

  const recursiveParser = async (states: States): Promise<void> => {
    for (const [stateName, stateContent] of Object.entries(states)) {
      parsedStates[stateName] = {
        type: stateContent.Type,
        comment: stateContent.Comment,
      };
      if (stateContent.Type === "Parallel") {
        for (const branch of stateContent.Branches) {
          await recursiveParser(branch.States);
        }
      } else if (stateContent.Type === "Map") {
        await recursiveParser(stateContent.ItemProcessor.States);
      }
    }
  };
  await recursiveParser(states);
  return parsedStates;
};
const asl = {
  Comment:
    "A Hello World example demonstrating various state types of the Amazon States Language. It is composed of flow control states only, so it does not need resources to run.",
  StartAt: "Pass",
  States: {
    Pass: {
      Comment:
        "A Pass state passes its input to its output, without performing work. They can also generate static JSON output, or transform JSON input using filters and pass the transformed data to the next state. Pass states are useful when constructing and debugging state machines.",
      Type: "Pass",
      Result: { IsHelloWorldExample: true },
      Next: "Hello World example?",
    },
    "Hello World example?": {
      Comment:
        "A Choice state adds branching logic to a state machine. Choice rules can implement many different comparison operators, and rules can be combined using And, Or, and Not",
      Type: "Choice",
      Choices: [
        {
          Variable: "$.IsHelloWorldExample",
          BooleanEquals: true,
          Next: "Yes",
        },
        {
          Variable: "$.IsHelloWorldExample",
          BooleanEquals: false,
          Next: "No",
        },
      ],
      Default: "Yes",
    },
    Yes: { Type: "Pass", Next: "Wait 3 sec" },
    No: { Type: "Fail", Cause: "Not Hello World" },
    "Wait 3 sec": {
      Comment:
        "A Wait state delays the state machine from continuing for a specified time.",
      Type: "Wait",
      Seconds: 3,
      Next: "Parallel State",
    },
    "Parallel State": {
      Comment:
        "A Parallel state can be used to create parallel branches of execution in your state machine.",
      Type: "Parallel",
      Next: "Hello World",
      Branches: [
        {
          StartAt: "Hello",
          States: { Hello: { Type: "Pass", End: true } },
        },
        {
          StartAt: "Earth",
          States: { Earth: { Type: "Pass", End: true } },
        },
      ],
    },
    "Hello World": { Type: "Pass", End: true },
  },
};

const mapAsl = {
  Comment:
    "Distributed map that reads CSV file for order data and detects delayed orders",
  StartAt: "GenerateCSV",
  States: {
    GenerateCSV: {
      Comment:
        " This step is used to generate CSV file with contains order data",
      Type: "Task",
      Resource: "arn:aws:states:::lambda:invoke",
      OutputPath: "$.Payload",
      Parameters: {
        "Payload.$": "$",
        FunctionName: "MyLambdaFunction",
      },
      Retry: [
        {
          ErrorEquals: [
            "Lambda.ServiceException",
            "Lambda.AWSLambdaException",
            "Lambda.SdkClientException",
            "Lambda.TooManyRequestsException",
          ],
          IntervalSeconds: 2,
          MaxAttempts: 3,
          BackoffRate: 2,
        },
      ],
      Next: "Shipping File Analysis",
    },
    "Shipping File Analysis": {
      Type: "Map",
      ItemProcessor: {
        ProcessorConfig: {
          Mode: "DISTRIBUTED",
          ExecutionType: "EXPRESS",
        },
        StartAt: "DetectDelayedOrders",
        States: {
          DetectDelayedOrders: {
            Type: "Task",
            Resource: "arn:aws:states:::lambda:invoke",
            OutputPath: "$.Payload",
            Parameters: {
              "Payload.$": "$",
              FunctionName: "MyLambdaFunction",
            },
            Retry: [
              {
                ErrorEquals: [
                  "Lambda.ServiceException",
                  "Lambda.AWSLambdaException",
                  "Lambda.SdkClientException",
                  "Lambda.TooManyRequestsException",
                ],
                IntervalSeconds: 2,
                MaxAttempts: 6,
                BackoffRate: 2,
              },
            ],
            Next: "ProcessDelayedOrders",
          },
          ProcessDelayedOrders: {
            Type: "Map",
            ItemProcessor: {
              ProcessorConfig: {
                Mode: "INLINE",
              },
              StartAt: "SendDelayedOrder",
              States: {
                SendDelayedOrder: {
                  Type: "Task",
                  Resource: "arn:aws:states:::sqs:sendMessage",
                  Parameters: {
                    "MessageBody.$": "$",
                    QueueUrl:
                      "https://sqs.REGION.amazonaws.com/ACCOUNT_ID/MyQueue",
                  },
                  End: true,
                  ResultPath: null,
                },
              },
            },
            End: true,
          },
        },
      },
      ItemReader: {
        Resource: "arn:aws:states:::s3:getObject",
        ReaderConfig: {
          InputType: "CSV",
          CSVHeaderLocation: "FIRST_ROW",
        },
        Parameters: {
          Bucket: "<S3_INPUT_BUCKET>",
          Key: "<S3_ORDER_FILE_OBJECT_KEY>",
        },
      },
      MaxConcurrency: 1000,
      Label: "ShippingFileAnalysis",
      End: true,
      ItemBatcher: {
        MaxItemsPerBatch: 10,
      },
      ResultWriter: {
        Resource: "arn:aws:states:::s3:putObject",
        Parameters: {
          Bucket: "<S3_RESULT_BUCKET>",
          Prefix: "results",
        },
      },
    },
  },
};

// test cases
async function whatever() {
  const result = await parseStepFunction(asl);
  console.log("result", result);
  const resultMap = await parseStepFunction(mapAsl);
  console.log("result", resultMap);
}
whatever();
export default parseStepFunction;
