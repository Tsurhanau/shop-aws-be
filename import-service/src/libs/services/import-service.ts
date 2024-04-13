import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client } from "@libs/s3/s3Client";
import { S3EventRecord } from "aws-lambda";
import { PassThrough } from 'stream';


export const BUCKET_NAME = "s3-integrtion-bucket";
const CATALOG_PATH = "upload/";

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
    
        const csvStream = response.Body.pipe(this.csvParser());
    
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
}
  
export const importService = new ImportService(s3Client);