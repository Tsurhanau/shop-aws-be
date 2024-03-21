export const mockContext = {
    callbackWaitsForEmptyEventLoop: false,
    functionName: 'test',
    functionVersion: '1.0',
    invokedFunctionArn: 'arn:test',
    memoryLimitInMB: '128',
    awsRequestId: 'test',
    logGroupName: 'test',
    logStreamName: 'test',
    getRemainingTimeInMillis: () => 0,
    done: () => {},
    fail: () => {},
    succeed: () => {},
  };
