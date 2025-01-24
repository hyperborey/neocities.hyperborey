import { BASE_URL } from "@lib/constants";

export function buildHeader(): string {
  const component = `<header><a href="${BASE_URL}">neocities.borey</a></header>`
  return component
}
