const AWS = require('aws-sdk');

AWS.config.update({
  accessKeyId: process.env.AMAZON_ACCESS_KEY_ID,
  secretAccessKey: process.env.AMAZON_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'us-east-1'
});

const sns = new AWS.SNS();
const topicArn = process.env.AWS_SNS_TOPIC_ARN;

async function sendSmsByNumber(toNumber, message) {
  const params = {
    PhoneNumber: toNumber,
    Message: message,
    MessageAttributes: {
      'AWS.SNS.SMS.SenderID' : {
        DataType : 'String',
        StringValue: 'realtracser'
      }
    }
  }
  publishText = sns.publish(params).promise();

  publishText.then((data) => {
    console.log("MessageID is " + data.MessageId);
  }).catch(
    function(err) {
    console.error(err, err.stack);
  });
}

async function sendSmsByTopic(message) {
  const params = {
    Subject: 'NEW HOME(S) LISTED!',
    TopicArn: topicArn,
    Message: message
  }
  publishText = sns.publish(params).promise();

  publishText.then((data) => {
    console.log("MessageID is " + data.MessageId);
  }).catch(
    function(err) {
    console.error(err, err.stack);
  });
}

module.exports = {
  sendSms: sendSmsByNumber,
  sendSmsToTopic: sendSmsByTopic
}