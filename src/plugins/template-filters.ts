import * as TemplateFilters from "~/utils/format";

declare module "vue" {
  interface ComponentCustomProperties {
    $filters: typeof TemplateFilters;
  }
}

export default defineNuxtPlugin((app) => {
  app.provide("$filters", TemplateFilters);
});
