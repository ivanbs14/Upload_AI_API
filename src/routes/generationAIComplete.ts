import { FastifyInstance } from "fastify";
import { createReadStream } from "fs";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { openai } from "../lib/openAI";

export async function generationAICompleteRoute(app: FastifyInstance) {
   app.post('/ai/complete', async (req, reply) => {
      /* validating req, with zod */
      const bodySchema = z.object({
         videoId: z.string().uuid(),
         template: z.string(),
         temperature: z.number().min(0).max(1).default(0.5),
      })

      const { videoId, template, temperature } = bodySchema.parse(req.body);

      /* Search transcription the movie and database */
      const video = await prisma.video.findUniqueOrThrow({
         where: {
            id: videoId,
         }
      })

      if (!video.trancription) {
         return reply.status(400).send({error: `Video transcription was not generated yet`})
      }

      const prompontMessege = template.replace('{transcription}', video.trancription)

      /* executing call to openAI */
      const response = await openai.chat.completions.create({
         model: 'gpt-3.5-turbo-16k',
         temperature,
         messages: [
            { role: 'user', content: prompontMessege },
         ],
      })

      return response
   })
}