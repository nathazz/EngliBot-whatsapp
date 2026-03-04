import { SlangApiSchema } from "../types/slangApi.schema";
import axios from "axios";

export async function getRandomSlangs() {
  const response = await axios.get(`${process.env.NEW_URBAN_API}`);

  const validData = SlangApiSchema.safeParse(response.data);

  if (!validData.success) {
    throw new Error(`Invalid Urban API response: ${validData.error.message}`);
  }

  const { word, example, definition } = validData.data.list[0];

  return { word, definition, example };
}