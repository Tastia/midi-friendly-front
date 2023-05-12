import { NDivider } from "naive-ui";
import { buildFieldSchema } from "@chronicstone/vue-sweettools";

export const FormDivider = (text?: string) =>
  buildFieldSchema({
    key: "#divider#",
    type: "info",
    content: () => (text ? <NDivider>{text}</NDivider> : <NDivider />),
  });

export const FormSectionTitle = ({
  title,
  size = 8,
  topPadding = false,
}: {
  title: string;
  size?: number | string;
  topPadding?: boolean;
}) =>
  buildFieldSchema({
    type: "info",
    size,
    key: "______",
    content: () => (
      <div class={topPadding && "pt-8"}>
        <div class="text-lg font-semibold mb-4">{title}</div>
        <NDivider class={`!m-0`} />
      </div>
    ),
  });
