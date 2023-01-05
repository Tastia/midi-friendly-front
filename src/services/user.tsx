import { FormSchema } from "@chronicstone/vue-sweetforms";

export function UserSatisfactionSchema(): FormSchema {
  return {
    maxWidth: "600px",
    gridSize: 8,
    fieldSize: 8,
    requiredMessage: "Ce champ est obligatoire",
    steps: [
      {
        fields: [
          {
            key: "info",
            type: "info",
            content: () => (
              <div class="flex flex-col gap-4">
                <span>
                  Laissez votre avis ! <br /> Répondez à ces quelques questions,
                  afin de nous aider à améliorer notre produit !
                </span>
              </div>
            ),
          },
        ],
      },
      {
        fields: [
          {
            key: "userRating",
            label: "How satisfied are you with our service?",
            type: "rating",
            required: true,
          },
        ],
      },
      {
        fields: [
          {
            key: "mostAppreciated",
            label: "What do you appreciate the most?",
            type: "checkbox-group",
            gridSize: "1",
            options: [
              {
                label: "Listing des restaurants",
                value: "Listing des restaurants",
              },
              {
                label: "Création / gestion des groupes",
                value: "Création / gestion des groupes",
              },
            ],
          },
          {
            key: "mostAppreciatedOther",
            label: "Autre",
            type: "textarea",
          },
        ],
      },
      {
        fields: [
          {
            key: "solveProblem",
            label:
              "Est-ce que Midi Friendly résout une problématique du quotidien ?",
            type: "radio",
            options: [
              { label: "Oui", value: "Oui" },
              { label: "Non", value: "Non" },
            ],
            required: true,
          },
        ],
      },
      {
        fields: [
          {
            key: "question5",
            label:
              "Avez-vous trouvé des éléments bloquants lors de votre navigation  ?",
            type: "radio",
            options: [
              { label: "Oui", value: "Oui" },
              { label: "Non", value: "Non" },
            ],
            required: true,
          },
          {
            key: "question5_1",
            label: "Si oui, lesquels ?",
            type: "textarea",
            placeholder: "Citez les éléments bloquants",
          },
        ],
      },
      {
        fields: [
          {
            key: "question6",
            label: "Quelles fonctionnalités sont manquantes selon vous ?",
            type: "textarea",
          },
          {
            key: "question7",
            label: "Avez-vous des suggestions d'amélioration ?",
            type: "textarea",
          },
        ],
      },
    ],
  };
}

export async function CollectUserSatisfaction() {
  try {
    const { formApi } = useReactifiedApi();
    const { formData, isCompleted } = await formApi.createForm(
      UserSatisfactionSchema()
    );

    if (!isCompleted) return false;
    console.log(formData);
  } catch (error) {
    console.error(error);
  }
}
