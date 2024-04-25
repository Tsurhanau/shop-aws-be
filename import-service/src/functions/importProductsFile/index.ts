import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: 'import/{name}',
        cors: true,
        authorizer: {
          name: "basicAuthorizer",
          arn: "arn:aws:lambda:eu-north-1:688537007113:function:authorization-service-dev-basicAuthorizer",
          resultTtlInSeconds: 0,
          identitySource: "method.request.header.Authorization",
        },
        request: {
          parameters: {
            paths: {
              name: true
            }
          }
        }
      },
    },
  ],
};
