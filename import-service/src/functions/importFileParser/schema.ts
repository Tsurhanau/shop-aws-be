export default {
  type: "object",
  properties: {
    queryStringParameters: {
      type: 'object',
      properties: {
        name: {
          type: 'string'
        }
      },
      required: ['name']
    }
  }
} as const;