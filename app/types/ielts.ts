// types/ielts.ts

export type LogicGroup =
  | "SELECTOR_MCQ"
  | "SELECTOR_FIXED"
  | "MATCHING"
  | "GAP_FILL";

export interface IeltsQuestion {
  q_number: number;
  q_html: string;
  options: string[]; // Chỉ dành cho SELECTOR_MCQ
}

export interface IeltsSection {
  title: string;
  logic_group: LogicGroup;
  range: { start: number; end: number };
  instruction_html: string;
  questions: IeltsQuestion[];
}

export interface IeltsPassageData {
  url: string;
  title: string;
  passage_html: string[];
  question_sections: IeltsSection[];
  all_answers: string[]; // Mảng đáp án phẳng đồng bậc với section
}
