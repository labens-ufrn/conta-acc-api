import p from "pomme-ts";
import { z } from "zod";
import { Prisma } from "@prisma/client";

const bodySchema = z.object({
  name: z.string(),
});

export const v1CreateTemplate = p.route.post({
  key: "createTemplate",
  bodySchema,
  async resolver({ body }, ctx) {
    const { name } = body;

    const template = {};

    return template;
  },
});
