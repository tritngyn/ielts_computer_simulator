export interface IeltsQuestion {
  id: string;
  number: number;
  text: string;
  acceptedAnswers: string[];
}

export interface IeltsQuestionGroup {
  id: string;
  type: string; // "TRUE_FALSE_NOT_GIVEN" | "GAP_FILL" | "MATCHING_HEADINGS" | "MULTIPLE_CHOICE" | "MATCHING_INFORMATION"
  instructions: string;
  sharedOptions: string[] | null;
  questions: IeltsQuestion[];
}

export interface IeltsPassage {
  passageNumber: number;
  title: string;
  subtitle: string | null;
  contentHTML: string;
  questionGroups: IeltsQuestionGroup[];
  error: boolean;
}

export interface IeltsReadingTest {
  id: string;
  testCode: string;
  title: string;
  passages: IeltsPassage[];
}
