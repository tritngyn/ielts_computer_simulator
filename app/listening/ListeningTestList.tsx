import Link from "next/link";
import { Headphones, Clock, FileText, ChevronRight } from "lucide-react";

const cambridgeTests = [
  {
    id: 1,
    book: "Cambridge IELTS 18",
    test: 1,
    sections: 4,
    questions: 40,
    time: 30,
    difficulty: "Intermediate",
  },
  {
    id: 2,
    book: "Cambridge IELTS 18",
    test: 2,
    sections: 4,
    questions: 40,
    time: 30,
    difficulty: "Intermediate",
  },
  {
    id: 3,
    book: "Cambridge IELTS 18",
    test: 3,
    sections: 4,
    questions: 40,
    time: 30,
    difficulty: "Advanced",
  },
  {
    id: 4,
    book: "Cambridge IELTS 18",
    test: 4,
    sections: 4,
    questions: 40,
    time: 30,
    difficulty: "Advanced",
  },
  {
    id: 5,
    book: "Cambridge IELTS 17",
    test: 1,
    sections: 4,
    questions: 40,
    time: 30,
    difficulty: "Intermediate",
  },
  {
    id: 6,
    book: "Cambridge IELTS 17",
    test: 2,
    sections: 4,
    questions: 40,
    time: 30,
    difficulty: "Intermediate",
  },
  {
    id: 7,
    book: "Cambridge IELTS 17",
    test: 3,
    sections: 4,
    questions: 40,
    time: 30,
    difficulty: "Advanced",
  },
  {
    id: 8,
    book: "Cambridge IELTS 17",
    test: 4,
    sections: 4,
    questions: 40,
    time: 30,
    difficulty: "Advanced",
  },
  {
    id: 9,
    book: "Cambridge IELTS 16",
    test: 1,
    sections: 4,
    questions: 40,
    time: 30,
    difficulty: "Intermediate",
  },
  {
    id: 10,
    book: "Cambridge IELTS 16",
    test: 2,
    sections: 4,
    questions: 40,
    time: 30,
    difficulty: "Intermediate",
  },
  {
    id: 11,
    book: "Cambridge IELTS 16",
    test: 3,
    sections: 4,
    questions: 40,
    time: 30,
    difficulty: "Advanced",
  },
  {
    id: 12,
    book: "Cambridge IELTS 16",
    test: 4,
    sections: 4,
    questions: 40,
    time: 30,
    difficulty: "Advanced",
  },
];

export const ListeningTestList = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Headphones className="w-10 h-10 text-purple-600" />
            <h1 className="text-4xl text-gray-900">Listening Tests</h1>
          </div>
          <p className="text-gray-600 text-lg">
            Choose from our collection of official Cambridge IELTS Listening
            tests. Each test includes 4 sections and 40 questions.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Total Tests</p>
                <p className="text-3xl text-gray-900">
                  {cambridgeTests.length}
                </p>
              </div>
              <FileText className="w-12 h-12 text-purple-600 opacity-20" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Test Duration</p>
                <p className="text-3xl text-gray-900">30 min</p>
              </div>
              <Clock className="w-12 h-12 text-purple-600 opacity-20" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Questions per Test</p>
                <p className="text-3xl text-gray-900">40</p>
              </div>
              <Headphones className="w-12 h-12 text-purple-600 opacity-20" />
            </div>
          </div>
        </div>

        {/* Test List */}
        <div className="grid grid-cols-1 gap-4">
          {cambridgeTests.map((test) => (
            <Link
              key={test.id}
              href={`/listening/${test.id}`}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Headphones className="w-8 h-8 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl text-gray-900 mb-2">
                      {test.book} - Test {test.test}
                    </h3>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <FileText className="w-4 h-4" />
                        <span>{test.sections} sections</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Headphones className="w-4 h-4" />
                        <span>{test.questions} questions</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{test.time} minutes</span>
                      </div>
                      <div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs ${
                            test.difficulty === "Advanced"
                              ? "bg-red-100 text-red-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {test.difficulty}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-purple-600 transition-colors" />
              </div>
            </Link>
          ))}
        </div>

        {/* Information Section */}
        <div className="mt-8 bg-purple-50 border border-purple-200 rounded-lg p-6">
          <h3 className="text-xl text-gray-900 mb-3">About Listening Tests</h3>
          <div className="text-gray-700 space-y-2">
            <p>• Each test consists of 4 sections with increasing difficulty</p>
            <p>• You will hear the audio only once - listen carefully!</p>
            <p>
              • You have 30 minutes for the test plus 10 minutes to transfer
              answers
            </p>
            <p>
              • Question types include multiple choice, form completion, map
              labeling, and more
            </p>
            <p>
              • Tests are from official Cambridge IELTS preparation materials
            </p>
            <p>• Make sure your audio is working properly before starting</p>
          </div>
        </div>
      </div>
    </div>
  );
};
