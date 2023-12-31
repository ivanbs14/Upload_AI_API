import { FastifyInstance } from "fastify";
import { createReadStream } from "fs";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { openai } from "../lib/openAI";

export async function createTranscription(app: FastifyInstance) {
   app.post('/video/:videoId/transcription', async (req) => {
      /* validating req, with zod */
      const paramsSchema = z.object({
         videoId: z.string().uuid(),
      })

      const { videoId } = paramsSchema.parse(req.params);

      /* validating prompt, with zod */
      const bodySchema = z.object({
         prompt: z.string(),
      })

      const { prompt } = bodySchema.parse(req.body);

      /* capturing video path */
      const video = await prisma.video.findUniqueOrThrow({
         where: {
            id: videoId,
         }
      })

      const videoPath = video.path;

      /* path for the box to read the transcription file */
      const audioReadStream = createReadStream(videoPath);

      /* asking to AI transcribe the file */
      const response = await openai.audio.transcriptions.create({
         file: audioReadStream,
         model: 'whisper-1',
         language: 'pt',
         response_format: 'json',
         temperature: 0,
         prompt,
      })

      /* saving the transcript to the database */
      const trancription = response.text;

      await prisma.video.update({
         where: {
            id: videoId,
         },
         data: {
            trancription,
         },
      })

      return { trancription }
   })
}