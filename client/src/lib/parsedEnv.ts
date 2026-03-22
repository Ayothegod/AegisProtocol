import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production"]),
  // CLOUDINARY_APISECRET: z.string(),
});

const parsedEnv = envSchema.parse(process.env);

export default parsedEnv;
