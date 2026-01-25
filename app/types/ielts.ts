export interface Question {
  q_number: number;
  q_html: string;
  options?: string[];
}

export interface QuestionRange {
  start: number;
  end: number;
}

export interface QuestionSection {
  title: string;
  logic_group: "GAP_FILL" | "SELECTOR_FIXED" | "SELECTOR_MCQ" | "MATCHING";
  range: QuestionRange;
  instruction_html: string;
  questions: Question[];
}

export interface Passage {
  url?: string;
  title: string;
  passage: string[];
  question_sections: QuestionSection[];
  all_answers: string[];
  passage_no: number;
  book: string;
  test_no: number;
}

export interface IELTSTestData {
  test_id: string;
  book: string;
  test_number: number;
  passages: Passage[];
}
