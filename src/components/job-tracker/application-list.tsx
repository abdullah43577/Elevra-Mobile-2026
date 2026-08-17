import { View } from "react-native";
import { JobApplication } from "../../../types/job-application";
import { ApplicationRow } from "./application-row";

interface Props {
  applications: JobApplication[];
  onPressApplication: (application: JobApplication) => void;
}

export const ApplicationList = function ({
  applications,
  onPressApplication,
}: Props) {
  return (
    <View className="overflow-hidden rounded-2xl border-hairline border-line bg-surface">
      {applications.map((application, index) => (
        <View key={application.id}>
          {index > 0 && <View className="ml-16 h-px bg-line" />}
          <ApplicationRow
            application={application}
            onPress={() => onPressApplication(application)}
          />
        </View>
      ))}
    </View>
  );
};
