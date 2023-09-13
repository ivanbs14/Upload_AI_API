import { FastifyInstance } from "fastify";
import { fastifyMultipart} from "@fastify/multipart";
import path from "node:path";
import { randomUUID } from "node:crypto";
import fs from "node:fs";
import { pipeline } from "node:stream";
import { promisify } from "node:util";
import { prisma } from "../lib/prisma";

// transforming old function to use promisify
const pump = promisify(pipeline)

export async function uploadVideosRoute(app: FastifyInstance) {
   app.register(fastifyMultipart, {
      limits: {
         fileSize: 1_048_576 * 50, // 50mb
      }
   })

   app.post('/video', async (request, reply) => {
      const data = await request.file()

      if (!data) {
         return reply.status(400).send({ error: 'Missing file input.'})
      };

      const extensionFile = path.extname(data.filename);

      if (extensionFile !== '.mp3') {
         return reply.status(400).send({ error: 'Invalid input type, please upload a MP3.'})
      };

      const fileBaseName = path.basename(data.filename, extensionFile);
      const fileUploadNewName = `${fileBaseName}-${randomUUID()}${extensionFile}`;
      const uploadDestination = path.resolve(__dirname, '../../tmp', fileUploadNewName);

      await pump(data.file, fs.createWriteStream(uploadDestination));

      const video = await prisma.video.create({
         data: {
            name: data.filename,
            path: uploadDestination,
         }
      })

      return {
         video,
      }
   })
}