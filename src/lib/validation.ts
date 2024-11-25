import { z } from "zod";

export const formSchema = z.object({
  title: z.string().min(3).max(40),
  description: z.string().min(20).max(500),
  category: z.string().min(3).max(20),
  image: z
    .string()
    .url()
    .refine(
      async (url) => {
        try {
          const res = await fetch(url, { method: "HEAD" });
          const contentType = res.headers.get("content-type");

          return contentType?.startsWith("image/");
        } catch (_e) {
          return false;
        }
      },
      {
        message: "Invalid url. Check your image url and try again.",
      },
    ),
  pitch: z.string().min(10),
});
