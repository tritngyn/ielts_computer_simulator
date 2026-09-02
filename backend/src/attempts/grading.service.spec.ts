import { BadRequestException } from '@nestjs/common';
import { GradingService } from './grading.service';

describe('GradingService', () => {
  const service = new GradingService();

  it('grades reading answers with stable submission keys and normalization', () => {
    const result = service.grade(
      {
        passages: [
          {
            questionGroups: [
              { questions: [{ number: 1 }, { number: '2' }, { number: 3 }] },
            ],
          },
        ],
      },
      {
        '1': ['forty two', '42'],
        '2': ['north'],
        '3': ['answered'],
      },
      {
        passage_0_q1: '  FORTY   TWO ',
        passage_0_q2: 'south',
        passage_0_q3: '   ',
      },
    );

    expect(result).toMatchObject({ score: 1, totalQuestions: 3 });
    expect(result.details.questionResults).toMatchObject({
      passage_0_q1: { status: 'correct', acceptedAnswers: ['forty two', '42'] },
      passage_0_q2: { status: 'incorrect', acceptedAnswers: ['north'] },
      passage_0_q3: { status: 'skipped', acceptedAnswers: ['answered'] },
    });
  });

  it('uses listening question IDs and falls back to the question number', () => {
    const result = service.grade(
      {
        parts: [
          {
            questionGroups: [
              {
                questions: [{ id: 'listen-q1', number: 1 }, { number: 2 }],
              },
            ],
          },
        ],
      },
      { '1': ['station'], '2': ['museum'] },
      { 'listen-q1': 'Station', '2': 'museum' },
    );

    expect(result.score).toBe(2);
    expect(Object.keys(result.details.questionResults)).toEqual([
      '2',
      'listen-q1',
    ]);
  });

  it.each([
    null,
    [],
    {},
    { '1': 'answer' },
    { '1': [] },
    { '1': ['answer', 2] },
  ])('rejects a malformed answer key: %p', (answerKey) => {
    expect(() => service.grade({}, answerKey, {})).toThrow(BadRequestException);
  });
});
