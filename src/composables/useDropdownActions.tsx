import { ComputedRef, VNodeChild } from "vue";
import { computed } from "vue";
import { RouteLocationRaw } from "vue-router";
import { renderIcon } from "~/utils/vue/renderIcon";

export interface DropdownAction {
  label: string | (() => VNodeChild);
  icon?: string;
  action?: () => void;
  link?: string | RouteLocationRaw;
  disable?: boolean | (() => boolean);
  show?: boolean | (() => boolean);
  permissions?: (string | string[])[];
}

export interface MappedDropdownAction {
  label: string | (() => VNodeChild);
  icon?: () => VNodeChild;
  disabled: boolean;
  hidden: boolean;
  props: {
    onClick: () => void;
  };
}

export const useDropdownActions: (actions: DropdownAction[]) => ComputedRef<MappedDropdownAction[]> = (
  actions
) => {
  return computed(() =>
    actions
      .map((action: DropdownAction) => ({
        label: action.link ? () => <nuxt-link to={action.link}>{action.label}</nuxt-link> : action.label,
        ...(action.icon && { icon: renderIcon(action.icon) }),
        disabled: typeof action.disable === "function" ? action.disable() : action?.disable ?? false,
        hidden: typeof action.show === "function" ? !action.show() : false,
        props: {
          onClick: () => action?.action?.(),
        },
      }))
      .filter((action: { hidden: boolean }) => !action.hidden)
  );
};
