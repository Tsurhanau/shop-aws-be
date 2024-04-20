import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.basicAuthorizer`,
  events: [
    {
      http: {
        method: 'get',
        path: 'authorize',
        cors: true,
      },
    },
  ],
};
