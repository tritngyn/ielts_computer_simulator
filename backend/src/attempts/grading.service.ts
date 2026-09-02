import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

export type QuestionStatus = 'correct' | 'incorrect' | 'skipped';

export interface QuestionResult {
  questionNumber: string;
  answerKey: string;
  userAnswer: string;
  acceptedAnswers: string[];
  status: QuestionStatus;
}

export interface GradingResult {
  score: number;
  totalQuestions: number;
  details: { questionResults: Record<string, QuestionResult> };
}

@Injectable()
export class GradingService {
  grade(
    publicContent: Prisma.JsonValue,
    answerKeyValue: Prisma.JsonValue,
    userAnswers: Record<string, string>,
  ): GradingResult {
    const answerKey = this.parseAnswerKey(answerKeyValue);
    const submittedKeys = this.mapSubmittedKeys(publicContent);
    const questionResults: Record<string, QuestionResult> = {};
    let score = 0;

    for (const [questionNumber, acceptedAnswers] of Object.entries(answerKey)) {
      const answerKeyName = submittedKeys[questionNumber] ?? questionNumber;
      const rawAnswer = userAnswers[answerKeyName] ?? '';
      const normalizedAnswer = this.normalize(rawAnswer);
      const isCorrect =
        normalizedAnswer.length > 0 &&
        acceptedAnswers.some(
          (answer) => this.normalize(answer) === normalizedAnswer,
        );
      if (isCorrect) score += 1;

      questionResults[answerKeyName] = {
        questionNumber,
        answerKey: answerKeyName,
        userAnswer: rawAnswer,
        acceptedAnswers,
        status:
          normalizedAnswer.length === 0
            ? 'skipped'
            : isCorrect
              ? 'correct'
              : 'incorrect',
      };
    }

    return {
      score,
      totalQuestions: Object.keys(answerKey).length,
      details: { questionResults },
    };
  }

  private parseAnswerKey(value: Prisma.JsonValue): Record<string, string[]> {
    if (!value || Array.isArray(value) || typeof value !== 'object') {
      throw new BadRequestException('Test answer key is not configured');
    }

    const parsed: Record<string, string[]> = {};
    const entries = Object.entries(value);
    if (entries.length === 0) {
      throw new BadRequestException('Test answer key is invalid');
    }

    for (const [key, answers] of entries) {
      if (
        !Array.isArray(answers) ||
        answers.length === 0 ||
        !answers.every((item) => typeof item === 'string')
      ) {
        throw new BadRequestException('Test answer key is invalid');
      }
      parsed[key] = answers;
    }
    return parsed;
  }

  private mapSubmittedKeys(content: Prisma.JsonValue): Record<string, string> {
    if (!content || Array.isArray(content) || typeof content !== 'object')
      return {};
    const root = content;
    const mapping: Record<string, string> = {};

    const passages = Array.isArray(root.passages) ? root.passages : [];
    passages.forEach((passage, passageIndex) => {
      this.questionsFromSection(passage).forEach((question) => {
        const questionNumber = this.questionNumber(question);
        if (questionNumber !== null) {
          mapping[questionNumber] =
            `passage_${passageIndex}_q${questionNumber}`;
        }
      });
    });

    const parts = Array.isArray(root.parts) ? root.parts : [];
    parts.forEach((part) => {
      this.questionsFromSection(part).forEach((question) => {
        const questionNumber = this.questionNumber(question);
        if (questionNumber !== null) {
          mapping[questionNumber] =
            typeof question.id === 'string' && question.id.length > 0
              ? question.id
              : questionNumber;
        }
      });
    });
    return mapping;
  }

  private questionsFromSection(section: Prisma.JsonValue): Prisma.JsonObject[] {
    if (!section || Array.isArray(section) || typeof section !== 'object')
      return [];
    const groups = Array.isArray(section.questionGroups)
      ? section.questionGroups
      : [];

    return groups.flatMap((group) => {
      if (!group || Array.isArray(group) || typeof group !== 'object')
        return [];
      return Array.isArray(group.questions)
        ? group.questions.filter(
            (question): question is Prisma.JsonObject =>
              Boolean(question) &&
              !Array.isArray(question) &&
              typeof question === 'object',
          )
        : [];
    });
  }

  private normalize(value: string): string {
    return value.trim().replace(/\s+/g, ' ').toLocaleLowerCase('en-US');
  }

  private questionNumber(question: Prisma.JsonObject): string | null {
    const number = question.number;
    return typeof number === 'string' || typeof number === 'number'
      ? String(number)
      : null;
  }
}
