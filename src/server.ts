import { fastify } from "fastify";
import { getAllPromptsRoute } from "./routes/getAllPrompts";
import { uploadVideosRoute } from "./routes/upload_video";

const app = fastify()

app.register(getAllPromptsRoute);
app.register(uploadVideosRoute);

app.listen({
   port: 3333,
}).then(() => {
   console.log('HTTP Server Running!')
})