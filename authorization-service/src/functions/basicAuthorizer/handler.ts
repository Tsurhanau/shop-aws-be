export const basicAuthorizer = async (event, ctx, cb) => {
  console.log(`EVENT basicAuthorizer: ${JSON.stringify(event)}`);

  if (event['type'] !== 'TOKEN') cb('Unauthorized');

  try {
    
    const authToken = event.authorizationToken;
    const encodedCreds = authToken.split(' ')[1];

    const buff = Buffer.from(encodedCreds, 'base64');
    const plainCreds = buff.toString('utf-8').split(':');
    const username = plainCreds[0];

    const password = plainCreds[1];

    console.log(`PARSED username: ${username} and password: ${password}`);

    const storedUserPassword = process.env[username];

    const effect = !storedUserPassword || storedUserPassword != password ? 'Deny' : 'Allow';

    const policy = generatePolicy(encodedCreds, event.methodArn, effect);
    console.log(JSON.stringify(policy))
    cb(null, policy);
  } catch (e) {
    cb(`Unauthorized: ${ e.message }`);
  };
}

const generatePolicy = (principalId, resource, effect = 'Allow') => {
  return {
    principalId: principalId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: resource
        }
      ]
    }
  }
}
