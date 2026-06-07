export interface IeltsListeningQuestion {
  id?: string | null;
  number: number;
  text: string;
  options?: string[] | null;
}

export interface IeltsListeningQuestionGroup {
  id?: string | null;
  type: string; // "COMPLETION" | "MULTIPLE_CHOICE" | "PLAN_MAP_DIAGRAM_LABELLING" | "MATCHING"
  instructions: string;
  groupContentHTML?: string | null;
  sharedOptions?: string[] | null;
  questions: IeltsListeningQuestion[];
}

export interface IeltsListeningPart {
  partNumber: number;
  title: string;
  audioPath?: string | null;
  questionGroups: IeltsListeningQuestionGroup[];
}

export interface IeltsListeningTest {
  id: string;
  testCode?: string;
  title: string;
  parts: IeltsListeningPart[];
  answers: Record<string, string[]>;
}
