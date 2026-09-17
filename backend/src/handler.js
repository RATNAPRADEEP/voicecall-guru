import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  GetItemCommand,
  PutItemCommand,
} from '@aws-sdk/client-dynamodb';
import { createLearnerProfile, fromDynamoItem, toDynamoItem } from './learnerProfile.js';

const client = new DynamoDBClient({});
const TABLE_NAME = process.env.LEARNER_TABLE;

function response(statusCode, body) {
  return {
    statusCode,
    headers: { 'content-type': 'application/json', 'access-control-allow-origin': '*' },
    body: JSON.stringify(body),
  };
}

export async function handler(event) {
  const learnerId = event?.pathParameters?.learnerId || 'demo-learner';

  if (!TABLE_NAME) return response(500, { error: 'LEARNER_TABLE is not configured' });

  try {
    if ((event.requestContext?.http?.method || event.httpMethod) === 'GET') {
      const result = await client.send(new GetItemCommand({
        TableName: TABLE_NAME,
        Key: { learnerId: { S: learnerId } },
      }));

      return response(200, fromDynamoItem(result.Item ? unmarshall(result.Item) : null)
        || createLearnerProfile({ learnerId }));
    }

    if ((event.requestContext?.http?.method || event.httpMethod) === 'PUT') {
      const body = JSON.parse(event.body || '{}');
      const profile = createLearnerProfile({ ...body, learnerId });
      const item = toDynamoItem(profile);

      await client.send(new PutItemCommand({
        TableName: TABLE_NAME,
        Item: marshall(item),
      }));

      return response(200, profile);
    }

    return response(405, { error: 'Method not allowed' });
  } catch (error) {
    console.error('learner profile request failed', error);
    return response(500, { error: 'Unable to persist learner profile' });
  }
}

// Small local helpers keep the Lambda contract explicit without adding a framework.
function marshall(item) {
  return {
    learnerId: { S: item.learnerId },
    language: { S: item.language },
    assistance: { N: String(item.assistance) },
    masteredSkills: { L: item.masteredSkills.map((value) => ({ S: value })) },
    attempts: { N: String(item.attempts) },
    mistakes: { N: String(item.mistakes) },
  };
}

function unmarshall(item) {
  return {
    learnerId: item.learnerId?.S,
    language: item.language?.S,
    assistance: item.assistance?.N,
    masteredSkills: item.masteredSkills?.L?.map((value) => value.S) || [],
    attempts: item.attempts?.N,
    mistakes: item.mistakes?.N,
  };
}
