import { BASE_URL } from "@lib/constants";
import { addToTemp } from "@lib/utils/files";

export function buildHeader() {


  const component = `<header><a href="${BASE_URL}">neocities.borey</a></header>`

  addToTemp('header', component, 'component')

}
