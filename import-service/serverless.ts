import type { AWS } from '@serverless/typescript';

import importProductsFile from '@functions/importProductsFile';
import importFileParser from '@functions/importFileParser';

const serverlessConfiguration: AWS = {
  service: 'import-service',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild'],
  provider: {
    name: 'aws',
    runtime: 'nodejs20.x',
    region: 'eu-north-1',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      CATALOG_ITEMS_QUEUE_URL: { Ref: 'catalogItemsQueue' },
    },
    iamRoleStatements: [
      {
        Effect: "Allow",
        Action: ["s3:PutObject", "s3:GetObject"],
        Resource: "arn:aws:s3:::s3-integrtion-bucket/upload/*"
      },
      {
        Effect: 'Allow',
        Action: [
          'sqs:SendMessage',
        ],
        Resource: {
          'Fn::GetAtt': [
            'catalogItemsQueue',
            'Arn',
          ],
        },
      },
    ],
  },
  // import the function via paths
  functions: { importProductsFile, importFileParser },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
  resources: {
    Resources: {
      catalogItemsQueue: {
        Type: 'AWS::SQS::Queue',
        Properties: {
          QueueName: 'catalogItemsQueue',
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
