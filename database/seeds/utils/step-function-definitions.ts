const definitions = [
  `{
    "Comment": "An example of the Amazon States Language for starting a task and waiting for a callback.",
    "StartAt": "Start Task And Wait For Callback",
    "States": {
      "Start Task And Wait For Callback": {
        "Type": "Task",
        "Resource": "arn:aws:states:::sqs:sendMessage.waitForTaskToken",
        "Parameters": {
          "QueueUrl": "https://sqs.REGION.amazonaws.com/ACCOUNT_ID/MyQueue",
          "MessageBody": {
            "MessageTitle": "Task started by Step Functions. Waiting for callback with task token.",
            "TaskToken.$": "$$.Task.Token"
          }
        },
        "Next": "Notify Success",
        "Catch": [
          {
            "ErrorEquals": [
              "States.ALL"
            ],
            "Next": "Notify Failure"
          }
        ]
      },
      "Notify Success": {
        "Type": "Task",
        "Resource": "arn:aws:states:::sns:publish",
        "Parameters": {
          "Message": "Callback received. Task started by Step Functions succeeded.",
          "TopicArn": "arn:PARTITION:sns:REGION:ACCOUNT_NUMBER:MySnsTopic"
        },
        "End": true
      },
      "Notify Failure": {
        "Type": "Task",
        "Resource": "arn:aws:states:::sns:publish",
        "Parameters": {
          "Message": "Task started by Step Functions failed.",
          "TopicArn": "arn:PARTITION:sns:REGION:ACCOUNT_NUMBER:MySnsTopic"
        },
        "End": true
      }
    }
  }`,
  `{
  "Comment": "A Hello World example demonstrating various state types of the Amazon States Language. It is composed of flow control states only, so it does not need resources to run.",
  "StartAt": "Pass",
  "States": {
    "Pass": {
      "Comment": "A Pass state passes its input to its output, without performing work. They can also generate static JSON output, or transform JSON input using filters and pass the transformed data to the next state. Pass states are useful when constructing and debugging state machines.",
      "Type": "Pass",
      "Result": {
        "IsHelloWorldExample": true
      },
      "Next": "Hello World example?"
    },
    "Hello World example?": {
      "Comment": "A Choice state adds branching logic to a state machine. Choice rules can implement many different comparison operators, and rules can be combined using And, Or, and Not",
      "Type": "Choice",
      "Choices": [
        {
          "Variable": "$.IsHelloWorldExample",
          "BooleanEquals": true,
          "Next": "Yes"
        },
        {
          "Variable": "$.IsHelloWorldExample",
          "BooleanEquals": false,
          "Next": "No"
        }
      ],
      "Default": "Yes"
    },
    "Yes": {
      "Type": "Pass",
      "Next": "Wait 3 sec"
    },
    "No": {
      "Type": "Fail",
      "Cause": "Not Hello World"
    },
    "Wait 3 sec": {
      "Comment": "A Wait state delays the state machine from continuing for a specified time.",
      "Type": "Wait",
      "Seconds": 3,
      "Next": "Parallel State"
    },
    "Parallel State": {
      "Comment": "A Parallel state can be used to create parallel branches of execution in your state machine.",
      "Type": "Parallel",
      "Next": "Hello World",
      "Branches": [
        {
          "StartAt": "Hello",
          "States": {
            "Hello": {
              "Type": "Pass",
              "End": true
            }
          }
        },
        {
          "StartAt": "World",
          "States": {
            "World": {
              "Type": "Pass",
              "End": true
            }
          }
        }
      ]
    },
    "Hello World": {
      "Type": "Pass",
      "End": true
    }
  }
}`,
];

export default definitions;
