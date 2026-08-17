import { useThemeColors } from "@/hooks/use-theme-colors";
import { useState } from "react";
import { View, TouchableOpacity, TextInput } from "react-native";
import {
  Control,
  FieldErrors,
  FieldArrayWithId,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
} from "react-hook-form";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "@/components/shared/app-text";
import {
  DEFAULT_SKILL,
  ResumeBuilderFormValues,
} from "@/schemas/resume-builder/resume-builder";
import { showToast } from "@/utils/show-toast";

interface SkillsProps {
  control: Control<ResumeBuilderFormValues>;
  errors?: FieldErrors<ResumeBuilderFormValues>;
  fields: FieldArrayWithId<ResumeBuilderFormValues, "skills">[];
  append: UseFieldArrayAppend<ResumeBuilderFormValues, "skills">;
  remove: UseFieldArrayRemove;
}

export function Skills({
  control,
  errors,
  fields,
  append,
  remove,
}: SkillsProps) {
  const { foregroundSubtle } = useThemeColors();

  const [skillInput, setSkillInput] = useState("");

  const handleAddSkill = function () {
    const trimmed = skillInput.trim();
    if (!trimmed) {
      showToast("error", "Please enter a skill name");
      return;
    }

    // Check for duplicates
    const exists = fields.some(
      (field) => field.name.toLowerCase() === trimmed.toLowerCase(),
    );
    if (exists) {
      showToast("error", "Skill already added");
      return;
    }

    append({ name: trimmed, level: undefined });
    setSkillInput("");
  };

  const handleRemoveSkill = function (index: number) {
    remove(index);
  };

  return (
    <View className="mt-4 gap-4">
      <AppText type="subtitle" className="text-foreground-muted">
        Add your professional skills
      </AppText>

      {/* Input Row */}
      <View className="flex-row items-center gap-2">
        <View className="flex-1 rounded-xl border border-line bg-surface px-4 py-2">
          <TextInput
            className="text-base text-foreground"
            placeholder="Type a skill and press +"
            value={skillInput}
            onChangeText={setSkillInput}
            onSubmitEditing={handleAddSkill}
            placeholderTextColor={foregroundSubtle}
            returnKeyType="done"
          />
        </View>
        <TouchableOpacity
          onPress={handleAddSkill}
          className="h-12 w-12 items-center justify-center rounded-xl bg-accent"
        >
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Skill Chips */}
      <View className="flex-row flex-wrap gap-2">
        {fields.map((field, index) => (
          <View
            key={field.id}
            className="flex-row items-center rounded-full bg-accent-muted px-3 py-2"
          >
            <AppText className="text-sm text-accent">{field.name}</AppText>
            <TouchableOpacity
              onPress={() => handleRemoveSkill(index)}
              className="ml-1"
            >
              <Ionicons name="close" size={16} color="#3B82F6" />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {fields.length === 0 && (
        <AppText className="text-sm text-foreground-subtle">
          No skills added yet. Type a skill and press + to add.
        </AppText>
      )}
    </View>
  );
}
