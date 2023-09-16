import { fastify } from "fastify";
import { fastifyCors } from "@fastify/cors";
import { getAllPromptsRoute } from "./routes/getAllPrompts";
import { uploadVideosRoute } from "./routes/upload_video";
import { createTranscription } from "./routes/createTranscription";
import { generationAICompleteRoute } from "./routes/generationAIComplete";

const app = fastify()

app.register(fastifyCors, {
   origin: '*',
})

app.register(getAllPromptsRoute);
app.register(uploadVideosRoute);
app.register(createTranscription);
app.register(generationAICompleteRoute);

app.listen({
   port: 3333,
}).then(() => {
   console.log('HTTP Server Running!')
})