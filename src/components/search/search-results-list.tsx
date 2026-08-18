import { View } from "react-native";
import { SearchResult } from "../../../types/search";
import { SearchResultRow } from "./search-result-row";

interface Props {
  results: SearchResult[];
  onPressResult: (result: SearchResult) => void;
}

export const SearchResultsList = function ({ results, onPressResult }: Props) {
  return (
    <View className="overflow-hidden rounded-2xl border-hairline border-line bg-surface">
      {results.map((result, index) => (
        <View key={`${result.type}-${result.id}`}>
          {index > 0 && <View className="ml-16 h-px bg-line" />}
          <SearchResultRow result={result} onPress={onPressResult} />
        </View>
      ))}
    </View>
  );
};
