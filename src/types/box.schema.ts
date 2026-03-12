import z from "zod";

export const CreateWordSchema = z.object({
  word: z.string().min(2).max(45),
  definition: z.string().min(2).max(200).optional(),
  example: z.string().min(10).max(200).optional(),
});

const AddSchema = z.tuple([
  z.literal("add"),
  z.string().min(2),
  z.string().optional(),
  z.string().optional(),
]);

const GetSchema = z.tuple([z.literal("get"), z.coerce.number()]);
const ListSchema = z.tuple([z.literal("list")]);
const DeleteSchema = z.tuple([z.literal("delete"), z.coerce.number()]);

const UpdateSchema = z.tuple([
  z.literal("update"),
  z.coerce.number(),
  z.enum(["word", "definition", "example"]),
  z.string().min(1),
]);

const GetByWordSchema = z.tuple([
  z.literal("get"),
  z.literal("--word"),
  z.string(),
]);

const DeleteByWordSchema = z.tuple([
  z.literal("delete"),
  z.literal("--word"),
  z.string(),
]);

const UpdateByWordSchema = z.tuple([
  z.literal("update"),
  z.literal("--word"),
  z.string(),
  z.enum(["word", "definition", "example"]),
  z.string().min(1),
]);

export const BoxCommandSchema = z.union([
  AddSchema,
  GetSchema,
  ListSchema,
  DeleteSchema,
  UpdateSchema,
  GetByWordSchema,
  UpdateByWordSchema,
  DeleteByWordSchema,
]);

export const boxUpdateSchema = CreateWordSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  {
    message: "At least one field must be provided",
  },
);

export type AddCommand = z.infer<typeof AddSchema>;
export type GetCommand = z.infer<typeof GetSchema>;
export type DeleteCommand = z.infer<typeof DeleteSchema>;
export type UpdateCommand = z.infer<typeof UpdateSchema>;
export type GetByWordCommand = z.infer<typeof GetByWordSchema>;
export type DeleteByWordCommand = z.infer<typeof DeleteByWordSchema>;
export type UpdateByWordCommand = z.infer<typeof UpdateByWordSchema>;

export type BoxCommand = z.infer<typeof BoxCommandSchema>;
export type BoxUpdateFn = z.infer<typeof boxUpdateSchema>;
export type BoxWordFn = z.infer<typeof CreateWordSchema>;
