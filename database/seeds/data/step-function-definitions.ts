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
];

export default definitions;
