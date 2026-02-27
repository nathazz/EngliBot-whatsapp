import { SlangApiSchema } from "../types/slangApi.schema";
import axios from "axios";

export async function getRandomSlangs() {
  const response = await axios.get(
    `${process.env.URBAN_API}random?limit=1`,
  );

  const validData = SlangApiSchema.safeParse(response.data);

  if (!validData.success) {
    throw new Error(`Invalid Urban API response: ${validData.error.message}`);
  }

  const { word, meaning, example } = validData.data.data[0];

  return { word, meaning, example };
}