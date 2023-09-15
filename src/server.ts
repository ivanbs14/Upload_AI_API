import { fastify } from "fastify";
import { getAllPromptsRoute } from "./routes/getAllPrompts";
import { uploadVideosRoute } from "./routes/upload_video";
import { createTranscription } from "./routes/createTranscription";

const app = fastify()

app.register(getAllPromptsRoute);
app.register(uploadVideosRoute);
app.register(createTranscription);

app.listen({
   port: 3333,
}).then(() => {
   console.log('HTTP Server Running!')
})