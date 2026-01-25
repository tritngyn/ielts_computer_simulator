 const renderGapFill = (section: QuestionSection) => {
    const questionNumbers: number[] = [];
    for (let i = section.range.start; i <= section.range.end; i++) {
      questionNumbers.push(i);
    }

    return (
      <div className="mb-8">
        <div
          className="mb-4 prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: section.instruction_html }}
        />
        <div className="space-y-3">
          {questionNumbers.map((num) => {
            const status = getAnswerStatus(num);
            return (
              <div key={num} className="flex items-center gap-3">
                <span className="font-semibold min-w-[30px]">{num}.</span>
                <input
                  type="text"
                  value={userAnswers[`passage_${currentPassage}_q${num}`] || ""}
                  onChange={(e) => handleAnswerChange(num, e.target.value)}
                  disabled={isSubmitted}
                  className={`flex-1 px-3 py-2 border rounded ${
                    status === "correct"
                      ? "bg-green-100 border-green-500"
                      : status === "incorrect"
                        ? "bg-red-100 border-red-500"
                        : "bg-blue-50 border-blue-300"
                  }`}
                  placeholder="Your answer"
                />
                {isSubmitted && status === "incorrect" && (
                  <span className="text-green-600 font-medium">
                    ✓ {passage.all_answers[num - 1]}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };
const renderSelectorFixed = (section: QuestionSection) => {
    return (
      <div className="mb-8">
        <div
          className="mb-4 prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: section.instruction_html }}
        />
        <div className="space-y-4">
          {section.questions.map((q) => {
            const status = getAnswerStatus(q.q_number);
            return (
              <div key={q.q_number} className="flex items-start gap-3">
                <div className="flex-1">
                  <div dangerouslySetInnerHTML={{ __html: q.q_html }} />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={
                      userAnswers[`passage_${currentPassage}_q${q.q_number}`] ||
                      ""
                    }
                    onChange={(e) =>
                      handleAnswerChange(q.q_number, e.target.value)
                    }
                    disabled={isSubmitted}
                    className={`w-24 px-3 py-2 border rounded text-center ${
                      status === "correct"
                        ? "bg-green-100 border-green-500"
                        : status === "incorrect"
                          ? "bg-red-100 border-red-500"
                          : "bg-blue-50 border-blue-300"
                    }`}
                    placeholder="Answer"
                  />
                  {isSubmitted && status === "incorrect" && (
                    <span className="text-green-600 font-medium">
                      ✓ {passage.all_answers[q.q_number - 1]}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderSelectorMCQ = (section: QuestionSection) => {
    return (
      <div className="mb-8">
        <div
          className="mb-4 prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: section.instruction_html }}
        />
        <div className="space-y-6">
          {section.questions.map((q) => {
            const status = getAnswerStatus(q.q_number);
            const options = ["A", "B", "C", "D"];
            return (
              <div
                key={q.q_number}
                className={`p-4 rounded ${
                  status === "correct"
                    ? "bg-green-50"
                    : status === "incorrect"
                      ? "bg-red-50"
                      : "bg-white"
                }`}
              >
                <div
                  dangerouslySetInnerHTML={{ __html: q.q_html }}
                  className="mb-3"
                />
                <div className="space-y-2 ml-4">
                  {options.map((option) => (
                    <label
                      key={option}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name={`q${q.q_number}`}
                        value={option}
                        checked={
                          userAnswers[
                            `passage_${currentPassage}_q${q.q_number}`
                          ] === option
                        }
                        onChange={(e) =>
                          handleAnswerChange(q.q_number, e.target.value)
                        }
                        disabled={isSubmitted}
                        className="w-4 h-4"
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
                {isSubmitted && status === "incorrect" && (
                  <div className="mt-3 text-green-600 font-medium">
                    ✓ Correct answer: {passage.all_answers[q.q_number - 1]}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderMatching = (section: QuestionSection) => {
    return (
      <div className="mb-8">
        <div
          className="mb-4 prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: section.instruction_html }}
        />
        <div className="space-y-4">
          {section.questions.map((q) => {
            const status = getAnswerStatus(q.q_number);
            return (
              <div key={q.q_number} className="flex items-start gap-3">
                <div className="flex-1">
                  <div dangerouslySetInnerHTML={{ __html: q.q_html }} />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={
                      userAnswers[`passage_${currentPassage}_q${q.q_number}`] ||
                      ""
                    }
                    onChange={(e) =>
                      handleAnswerChange(q.q_number, e.target.value)
                    }
                    disabled={isSubmitted}
                    className={`w-16 px-3 py-2 border rounded text-center ${
                      status === "correct"
                        ? "bg-green-100 border-green-500"
                        : status === "incorrect"
                          ? "bg-red-100 border-red-500"
                          : "bg-blue-50 border-blue-300"
                    }`}
                    placeholder="A"
                  />
                  {isSubmitted && status === "incorrect" && (
                    <span className="text-green-600 font-medium">
                      ✓ {passage.all_answers[q.q_number - 1]}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderQuestionSection = (section: QuestionSection) => {
    switch (section.logic_group) {
      case "GAP_FILL":
        return renderGapFill(section);
      case "SELECTOR_FIXED":
        return renderSelectorFixed(section);
      case "SELECTOR_MCQ":
        return renderSelectorMCQ(section);
      case "MATCHING":
        return renderMatching(section);
      default:
        return null;
    }
  }; 