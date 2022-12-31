import { NDivider } from "naive-ui";

export const FormDivider = (text?: string) => ({
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
}) => ({
  type: "info",
  size,
  content: () => (
    <div class={topPadding && "pt-8"}>
      <div class="text-lg font-semibold mb-4">{title}</div>
      <NDivider class={`!m-0`} />
    </div>
  ),
});
