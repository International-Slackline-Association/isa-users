import { AWSError } from 'aws-sdk';
import { InputLogEvent } from 'aws-sdk/clients/cloudwatchlogs';
import { cwLogs } from 'core/aws/clients';

import { LogObject } from './types';

const APPLICATION_LOG_GROUP_NAME = process.env.APPLICATION_LOG_GROUP_NAME;

export async function writeLogs(logs: LogObject[]) {
  const date = new Date().toISOString().split('T')[0];
  await writeToStream(date, logs);
}

async function writeToStream(streamName: string, logs: LogObject[], sequenceToken?: string) {
  if (logs.length > 0) {
    const formattedLogEvents = logs.map<InputLogEvent>((l) => {
      const { timestamp, ...rest } = l;
      return { timestamp: new Date(timestamp).getTime(), message: JSON.stringify(rest) };
    });
    await cwLogs
      .putLogEvents({
        logGroupName: APPLICATION_LOG_GROUP_NAME,
        logStreamName: streamName,
        sequenceToken: sequenceToken,
        logEvents: formattedLogEvents,
      })
      .promise()
      .then((r) => {
        if (r.rejectedLogEventsInfo) {
          console.warn('Log Event is rejected', { info: r.rejectedLogEventsInfo });
        }
      })
      .catch(async (err: AWSError) => {
        if (err.code === 'ResourceNotFoundException') {
          const isStreamCreated = await ensureStreamExists(streamName);
          if (isStreamCreated) {
            await writeToStream(streamName, logs);
          }
        } else if (err.code === 'InvalidSequenceTokenException') {
          // Message = The given sequenceToken is invalid. The next expected sequenceToken is: XXXX
          const token = err.message.split(':')[1].trim();
          if (token) {
            await writeToStream(streamName, logs, token);
          }
        } else {
          throw err;
        }
      });
  }
}

async function ensureStreamExists(streamName: string) {
  const streamNotExists = await cwLogs
    .describeLogStreams({ logGroupName: APPLICATION_LOG_GROUP_NAME, logStreamNamePrefix: streamName })
    .promise()
    .then((data) => data.logStreams.length === 0)
    .catch(() => true);
  if (streamNotExists) {
    await cwLogs.createLogStream({ logGroupName: APPLICATION_LOG_GROUP_NAME, logStreamName: streamName }).promise();
    return true;
  }
  return false;
}
