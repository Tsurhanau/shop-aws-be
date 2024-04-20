import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { REGION, s3Client } from "@libs/s3/s3Client";
import { S3EventRecord } from "aws-lambda";
import { PassThrough, Readable } from 'stream';


export const BUCKET_NAME = "s3-integrtion-bucket";
const CATALOG_PATH = "upload/";

let sqs = new SQSClient({ region: REGION });

class ImportService {

    csvParser = require('csv-parser');

    constructor(private s3Client: S3Client) {}
  
    async importProductsFile(fileName: string) {
      const params = {
        Bucket: BUCKET_NAME,
        Key: CATALOG_PATH + fileName,
        ContentType: "text/csv",
      };

      const command = new PutObjectCommand(params);

      return await getSignedUrl(this.s3Client, command, { expiresIn: 60 });
    }
    
    async importFileParser(record: S3EventRecord): Promise<void> {
      const bucket = record.s3.bucket.name;
    
      const params = {
        Bucket: bucket,
        Key: decodeURIComponent(record.s3.object.key.replace(/\+/g, ' ')),
      };

      const command = new GetObjectCommand(params);
      
      try {
        const response = await this.s3Client.send(command);

        const pass = new PassThrough();
    
        const csvStream = response.Body.pipe(this.csvParser({
          mapHeaders: ({ index }) => ['title', 'description', 'price'][index],
        }));
        
        for await (const data of Readable.from(csvStream)) {
          console.log(`Processing data: ${JSON.stringify(data)}`);
          await this.sendToSQS(data);
          pass.write(JSON.stringify(data) + '\n');
        }
    
        csvStream.on("data", (data) => {
            try {
                console.log(`Processing data: ${JSON.stringify(data)}`);
                const strData = JSON.stringify(data);
                pass.write(strData + '\n');
            } catch (err) {
                console.error(`Error occurred while processing data: ${err}`);
            }
        })
        .on("end",  () => {
            try {
                pass.end();
                console.log(`Done reading from ${params.Key}`);
            } catch (err) {
                console.error(`Error occurred when ending stream: ${err}`);
            }
        })
        .on('error', (error) => {
            console.log(`Error occurred while processing stream: ${error}`);
        });
      }
      catch (err) {
          console.error(`Error occurred when processing file: ${err}`);
      }
    }

    private async sendToSQS(data: any) {
      const sqsParams = {
        QueueUrl: process.env.CATALOG_ITEMS_QUEUE_URL,
        MessageBody: JSON.stringify(data),
      };
  
      await sqs.send(new SendMessageCommand(sqsParams));
    }
}
  
export const importService = new ImportService(s3Client);