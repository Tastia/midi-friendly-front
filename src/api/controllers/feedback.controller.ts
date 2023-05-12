import Airtable from "airtable";
import { CredentialsProviders } from "~~/src/types/user";

export type FeedbackRecordDto = {
  Email: string;
  AccountType: `${CredentialsProviders}`;
  Rating: 5;
  MostAppreciated: string[];
  SolvesProblematic: boolean;
  BlockingNavElements: string;
  MissingFeatures: string;
  EnhancementSuggestions: string;
};

export const FeedbackController = {
  postFeedback(data: FeedbackRecordDto) {
    const config = useRuntimeConfig();
    const FeedbackTable = new Airtable({ apiKey: config.public.airtableToken }).base(
      config.public.airtableBaseId
    )(config.public.airtableTableName);
    return FeedbackTable.create(data);
  },
};
