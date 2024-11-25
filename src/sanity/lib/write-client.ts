import "server-only";

import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId, token } from "../env";

export const writeClient = createClient({
  projectId,
  token,
  dataset,
  apiVersion,
  useCdn: false,
});

if (!token) throw new Error("Missing environment variable: SANITY_WRITE_TOKEN");
