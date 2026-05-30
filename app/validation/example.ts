import { z } from "zod";

export const exampleValidator = z.strictObject({
  message: z.string().nonempty(),
});
