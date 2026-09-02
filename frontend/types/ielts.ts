export interface IeltsQuestion {
  id: string;
  number: number;
  text: string;
  options: string[] | null;
}

export interface IeltsQuestionGroup {
  id: string;
  type: string; // "TRUE_FALSE_NOT_GIVEN" | "GAP_FILL" | "MATCHING_HEADINGS" | "MULTIPLE_CHOICE" | "MATCHING_INFORMATION"
  instructions: string;
  groupContentHTML: string | null;
  sharedOptions: string[] | null;
  questions: IeltsQuestion[];
}

export interface IeltsPassage {
  passageNumber: number;
  title: string;
  subtitle: string | null;
  contentHTML: string;
  questionGroups: IeltsQuestionGroup[];
}

export interface IeltsReadingTest {
  id: string;
  testCode?: string;
  title: string;
  passages: IeltsPassage[];
  /** Private answer keys are returned only inside an owned graded attempt. */
  answers?: never;
}
