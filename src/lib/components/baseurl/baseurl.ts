import { BASE_URL } from "@lib/constants";
import { Component } from "@lib/managers/ComponentManager";

export function buildBaseUrl(): Component {
  const component: Component = {
    name: "base_url",
    content: BASE_URL.toString(),
    sourceFile: null,
    build: () => {
      return buildBaseUrl();
    }
  }

  return component
}
