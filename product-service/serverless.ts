import type { AWS } from '@serverless/typescript';

import getProductsById from '@functions/getProductsById';
import getProductsList from '@functions/getProductsList';
import createProduct from '@functions/createProduct';
import catalogBatchProcess from '@functions/catalogBatchProcess';

const serverlessConfiguration: AWS = {
  service: 'product-service',
  frameworkVersion: '3',
  plugins: [
    'serverless-esbuild', 
    'serverless-auto-swagger', 
    'serverless-dotenv-plugin'
  ],
  provider: {
    name: 'aws',
    runtime: 'nodejs20.x',
    region: 'eu-north-1',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: process.env.AWS_NODEJS_CONNECTION_REUSE_ENABLED,
      NODE_OPTIONS: process.env.NODE_OPTIONS,
      PRODUCTS_TABLE_NAME: process.env.PRODUCTS_TABLE_NAME,
      STOCKS_TABLE_NAME: process.env.STOCKS_TABLE_NAME,
      CREATE_PRODUCT_TOPIC_ARN: {
        Ref: 'createProductTopic'
      },
    },
    iamRoleStatements: [{
      Effect: 'Allow',
      Action: [
        'dynamodb:DescribeTable',
        'dynamodb:Query',
        'dynamodb:Scan',
        'dynamodb:GetItem',
        'dynamodb:PutItem',
        'dynamodb:UpdateItem',
        'dynamodb:DeleteItem'
      ],
      Resource: [
        'arn:aws:dynamodb:${opt:region, self:provider.region}:*:table/Product',
        'arn:aws:dynamodb:${opt:region, self:provider.region}:*:table/Stock'
      ]
      },
      {
        Effect: 'Allow',
        Action: 'sns:Publish',
        Resource: {
          Ref: 'createProductTopic',
        },
      },
    ],
  },
  functions: { getProductsById, getProductsList, createProduct, catalogBatchProcess },
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
    autoswagger: {
      apiType: "http",
      basePath: "/dev",
    },
  },
  resources: {
    Resources: {
      createProductTopic: {
        Type: 'AWS::SNS::Topic',
        Properties: {
          TopicName: 'createProductTopic', 
        },
      },
      emailSubscription: {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          Endpoint: 'curganovevgenij@gmail.com',
          Protocol: 'email',
          TopicArn: {
            Ref: 'createProductTopic',
          },
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
