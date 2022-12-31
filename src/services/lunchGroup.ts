import { FormSchema } from "@chronicstone/vue-sweetforms";
import { GetRestaurants } from "./_utils.ts/resolvers";
import { helpers, maxValue } from "@vuelidate/validators";
import { FormDivider, FormSectionTitle } from "./_utils.ts/form";
import { getFutureDate } from "../utils/data/date";

const LunchGroupBaseFormFields = [
  {
    label: "Label",
    key: "label",
    type: "text",
    required: true,
    placeholder: "Afterwork IT",
    size: "9 md:6",
  },
  {
    key: "meetingTime",
    label: "Heure de rendez-vous",
    type: "time",
    required: true,
    default: getFutureDate(30).valueOf(),
    size: "9 md:3",
    fieldParams: {
      format: "HH:mm",
      minuteStep: 5,
    },
    transform: (value: number) => new Date(value).toISOString(),
  },
  {
    key: "description",
    label: "Description",
    type: "textarea",
    required: false,
    placeholder: "Description du groupe (optionnel)",
  },
];

export function LunchGroupFormSchema(): FormSchema {
  return {
    title: "Créer un groupe",
    maxWidth: "650px",
    fieldSize: 9,
    gridSize: 9,
    allowClickOutside: false,
    fields: [...LunchGroupBaseFormFields],
  } as FormSchema;
}

export function LunchGroupPollFormSchema(): FormSchema {
  return {
    title: "Initier un vote",
    maxWidth: "700px",
    fieldSize: 9,
    gridSize: 9,
    allowClickOutside: false,
    fields: [
      FormSectionTitle({ title: "Paramètres du vote", size: 9 }),
      {
        key: "voteDeadline",
        label: "Heure limite de vote",
        type: "time",
        fieldParams: {
          format: "HH:mm",
          minuteStep: 5,
        },
        required: true,
        default: getFutureDate(15).valueOf(),
        size: "9 md:4",
        dependencies: ["meetingTime"],
        transform: (value: number) => new Date(value).toISOString(),
        validators: (dependencies) => {
          const meetingTime = new Date(dependencies?.meetingTime);
          return {
            lowerThanMeetingTime: helpers.withMessage(
              "L'heure de fin du vote ne peut pas être supérieure à l'heure de rendez-vous",
              maxValue(meetingTime.valueOf())
            ),
          };
        },
      },
      {
        key: "allowedRestaurants",
        label: "Restaurants autorisés",
        type: "select",
        required: false,
        placeholder: "Restaurants autorisés (optionnel)",
        size: "9 md:5",
        options: GetRestaurants,
        fieldParams: {
          multiple: true,
        },
      },
      {
        key: "userVote",
        label: "Votre choix de restaurant",
        type: "select",
        required: true,
        placeholder: "Votez pour le restaurant de votre choix",
        size: 9,
        dependencies: ["allowedRestaurants"],
        options: async (dependencies) => {
          console.log("allowed", dependencies?.allowedRestaurants);
          const restaurants = await GetRestaurants();
          if (!dependencies?.allowedRestaurants?.length ?? false)
            return restaurants;
          else
            return restaurants.filter((restaurant) =>
              dependencies?.allowedRestaurants.includes(restaurant.value)
            );
        },
      },
      FormSectionTitle({
        title: "Paramètres du groupe",
        size: 9,
        topPadding: true,
      }),
      ...LunchGroupBaseFormFields,
    ],
  } as FormSchema;
}
