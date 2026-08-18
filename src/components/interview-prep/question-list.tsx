import { View } from "react-native";
import { InterviewQuestion } from "../../../types/interview-prep";
import { QuestionRow } from "./question-row";

interface Props {
  questions: InterviewQuestion[];
  onSelectQuestion: (question: InterviewQuestion) => void;
}

export const QuestionList = function ({ questions, onSelectQuestion }: Props) {
  return (
    <View className="overflow-hidden rounded-2xl border-hairline border-line bg-surface">
      {questions.map((question, index) => (
        <View key={question.id}>
          {index > 0 && <View className="ml-12 h-px bg-line" />}
          <QuestionRow
            question={question}
            onPress={() => onSelectQuestion(question)}
          />
        </View>
      ))}
    </View>
  );
};
