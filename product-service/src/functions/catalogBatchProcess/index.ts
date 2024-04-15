import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      sqs: {
        batchSize: 5,
        arn: "arn:aws:sqs:eu-north-1:688537007113:catalogItemsQueue"
      },
    },
  ],
};
