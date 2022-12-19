declare module "vue3-google-oauth2" {
  import { PluginObject } from "vue";
  const GAuth: PluginObject<{
    clientId: string;
    scope: string;
    prompt: string;
  }>;
  export default GAuth;
}
