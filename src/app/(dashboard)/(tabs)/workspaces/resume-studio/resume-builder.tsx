import { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { AppText } from "@/components/shared/app-text";
import { useGetTemplateById } from "@/hooks/resume/use-get-template-by-id";
import { useGetResumeById } from "@/hooks/resume/use-get-resume-by-id";
import { useSaveResume } from "@/hooks/resume/use-save-resume";
import { TemplateRenderer } from "@/components/resume/template-renderer";
import { showToast } from "@/utils/show-toast";
import {
  DEFAULT_CERTIFICATION,
  DEFAULT_EDUCATION,
  DEFAULT_EXPERIENCE,
  DEFAULT_LANGUAGE,
  DEFAULT_PROJECT,
  DEFAULT_REFERENCE,
  DEFAULT_SKILL,
  ResumeBuilderFormValues,
  resumeBuilderSchema,
} from "@/schemas/resume-builder/resume-builder";
import { PersonalInfo } from "@/components/resume-studio/resume-builder/personal-info";
import { Experience } from "@/components/resume-studio/resume-builder/experience";
import { Education } from "@/components/resume-studio/resume-builder/education";
import { Skills } from "@/components/resume-studio/resume-builder/skills";
import { Languages } from "@/components/resume-studio/resume-builder/languages";
import { Certifications } from "@/components/resume-studio/resume-builder/certification";
import { Projects } from "@/components/resume-studio/resume-builder/projects";
import { References } from "@/components/resume-studio/resume-builder/references";

const SECTIONS = [
  { id: "personal", label: "Personal Info", icon: "person-outline" },
  { id: "experience", label: "Experience", icon: "briefcase-outline" },
  { id: "education", label: "Education", icon: "school-outline" },
  { id: "skills", label: "Skills", icon: "bulb-outline" },
  { id: "languages", label: "Languages", icon: "chatbubbles-outline" },
  { id: "certifications", label: "Certifications", icon: "ribbon-outline" },
  { id: "projects", label: "Projects", icon: "folder-open-outline" },
  { id: "references", label: "References", icon: "people-outline" },
];

export default function ResumeBuilder() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    templateId?: string;
    resumeId?: string;
  }>();
  const templateId = params.templateId;
  const resumeId = params.resumeId;

  const [activeSection, setActiveSection] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const isEditing = !!resumeId;

  // Fetch template
  const { template, isFetchingTemplate } = useGetTemplateById({
    templateId: templateId || "",
  });

  // Fetch resume if editing
  const { resume, isFetchingResume } = useGetResumeById({
    resumeId: resumeId || "",
  });

  const { saveResume, isSaving } = useSaveResume({ resumeId });

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    getValues,
    reset,
    formState: { errors },
  } = useForm<ResumeBuilderFormValues>({
    resolver: zodResolver(resumeBuilderSchema),
    defaultValues: {
      personalInfo: {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        location: "",
        title: "",
        summary: "",
      },
      experience: [DEFAULT_EXPERIENCE],
      education: [DEFAULT_EDUCATION],
      skills: [DEFAULT_SKILL],
      languages: [DEFAULT_LANGUAGE],
      certifications: [DEFAULT_CERTIFICATION],
      projects: [DEFAULT_PROJECT],
      references: [DEFAULT_REFERENCE],
    },
  });

  const watchValues = watch();

  // Pre-fill form with resume data when editing
  useEffect(() => {
    if (resume && isEditing && resume) {
      reset({
        personalInfo: {
          firstName: resume.personalInfo?.firstName || "",
          lastName: resume.personalInfo?.lastName || "",
          email: resume.personalInfo?.email || "",
          phone: resume.personalInfo?.phone || "",
          location: resume.personalInfo?.location || "",
          title: resume.personalInfo?.title || "",
          summary: resume.personalInfo?.summary || "",
        },
        experience:
          resume.experience && resume.experience.length > 0
            ? resume.experience
            : [DEFAULT_EXPERIENCE],
        education:
          resume.education && resume.education.length > 0
            ? resume.education
            : [DEFAULT_EDUCATION],
        skills:
          resume.skills && resume.skills.length > 0
            ? resume.skills
            : [DEFAULT_SKILL],
        languages:
          resume.languages && resume.languages.length > 0
            ? resume.languages
            : [DEFAULT_LANGUAGE],
        certifications:
          resume.certifications && resume.certifications.length > 0
            ? resume.certifications
            : [DEFAULT_CERTIFICATION],
        projects:
          resume.projects && resume.projects.length > 0
            ? resume.projects
            : [DEFAULT_PROJECT],
        references:
          resume.references && resume.references.length > 0
            ? resume.references
            : [DEFAULT_REFERENCE],
      });
    }
  }, [resume, isEditing]);

  // Field arrays
  const experience = useFieldArray({ control, name: "experience" });
  const education = useFieldArray({ control, name: "education" });
  const skills = useFieldArray({ control, name: "skills" });
  const languages = useFieldArray({ control, name: "languages" });
  const certifications = useFieldArray({ control, name: "certifications" });
  const projects = useFieldArray({ control, name: "projects" });
  const references = useFieldArray({ control, name: "references" });

  const handleNext = function () {
    if (activeSection < SECTIONS.length - 1) {
      setActiveSection(activeSection + 1);
    }
  };

  const handlePrevious = function () {
    if (activeSection > 0) {
      setActiveSection(activeSection - 1);
    }
  };

  const handleSave = function (data: ResumeBuilderFormValues) {
    if (!templateId) {
      showToast("error", "Template not found");
      return;
    }

    const title = isEditing
      ? data.personalInfo?.firstName
        ? `${data.personalInfo.firstName} ${data.personalInfo.lastName || ""}'s Resume`.trim()
        : "My Resume"
      : `${data.personalInfo?.firstName || ""} ${data.personalInfo?.lastName || ""}'s Resume`.trim() ||
        "My Resume";

    saveResume({
      title,
      templateId,
      personalInfo: data.personalInfo,
      experience: data.experience,
      education: data.education,
      skills: data.skills,
      languages: data.languages,
      certifications: data.certifications,
      projects: data.projects,
      references: data.references,
    });
  };

  // Loading state
  if (isFetchingTemplate || (isEditing && isFetchingResume)) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  if (!template) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <AppText className="text-gray-500">Template not found</AppText>
      </View>
    );
  }

  const currentSection = SECTIONS[activeSection];
  const progress = ((activeSection + 1) / SECTIONS.length) * 100;

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between border-b border-gray-100 px-4 py-3">
        <TouchableOpacity onPress={() => router.back()} className="p-1">
          <Ionicons name="arrow-back" size={24} color="#6B7280" />
        </TouchableOpacity>
        <AppText type="title" className="font-semibold text-gray-900">
          {isEditing ? "Edit Resume" : "Build Resume"}
        </AppText>
        <TouchableOpacity
          onPress={() => setShowPreview(!showPreview)}
          className="p-1"
        >
          <Ionicons
            name={showPreview ? "close-outline" : "eye-outline"}
            size={24}
            color="#3B82F6"
          />
        </TouchableOpacity>
      </View>

      {/* Progress Bar */}
      <View className="px-4 py-3">
        <View className="flex-row items-center justify-between">
          <AppText className="text-xs text-gray-500">
            Step {activeSection + 1} of {SECTIONS.length}
          </AppText>
          <AppText className="text-xs text-blue-500">
            {Math.round(progress)}%
          </AppText>
        </View>
        <View className="mt-1 h-1 w-full rounded-full bg-gray-200">
          <View
            className="h-1 rounded-full bg-blue-500"
            style={{ width: `${progress}%` }}
          />
        </View>
      </View>

      <KeyboardAwareScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid
        extraScrollHeight={20}
      >
        <View className="flex-1 p-4">
          {showPreview ? (
            // Preview Mode
            <View className="flex-1">
              <AppText
                type="subtitle"
                className="mb-2 text-sm font-medium text-gray-700"
              >
                Resume Preview
              </AppText>
              <View className="overflow-hidden rounded-xl border border-gray-200">
                <TemplateRenderer
                  template={template}
                  data={{
                    personalInfo: watchValues.personalInfo,
                    experience: watchValues.experience,
                    education: watchValues.education,
                    skills: watchValues.skills,
                    languages: watchValues.languages,
                    certifications: watchValues.certifications,
                    projects: watchValues.projects,
                    references: watchValues.references,
                  }}
                  isThumbnail={false}
                />
              </View>
            </View>
          ) : (
            <View>
              <AppText className="mb-1 text-xl font-bold text-gray-900">
                {currentSection.label}
              </AppText>

              {activeSection === 0 && (
                <PersonalInfo control={control} errors={errors} />
              )}
              {activeSection === 1 && (
                <Experience
                  control={control}
                  errors={errors}
                  fields={experience.fields}
                  append={experience.append}
                  remove={experience.remove}
                />
              )}
              {activeSection === 2 && (
                <Education
                  control={control}
                  errors={errors}
                  fields={education.fields}
                  append={education.append}
                  remove={education.remove}
                  setValue={setValue}
                />
              )}
              {activeSection === 3 && (
                <Skills
                  control={control}
                  errors={errors}
                  fields={skills.fields}
                  append={skills.append}
                  remove={skills.remove}
                />
              )}
              {activeSection === 4 && (
                <Languages
                  control={control}
                  errors={errors}
                  fields={languages.fields}
                  append={languages.append}
                  remove={languages.remove}
                  setValue={setValue}
                />
              )}
              {activeSection === 5 && (
                <Certifications
                  control={control}
                  errors={errors}
                  fields={certifications.fields}
                  append={certifications.append}
                  remove={certifications.remove}
                />
              )}
              {activeSection === 6 && (
                <Projects
                  control={control}
                  errors={errors}
                  fields={projects.fields}
                  append={projects.append}
                  remove={projects.remove}
                />
              )}
              {activeSection === 7 && (
                <References
                  control={control}
                  errors={errors}
                  fields={references.fields}
                  append={references.append}
                  remove={references.remove}
                />
              )}
            </View>
          )}
        </View>
      </KeyboardAwareScrollView>

      {/* Navigation Buttons */}
      <View className="flex-row items-center justify-between border-t border-gray-100 px-4 py-4">
        <TouchableOpacity
          onPress={handlePrevious}
          disabled={activeSection === 0}
          className={`rounded-lg px-6 py-3 ${
            activeSection === 0 ? "opacity-50" : ""
          }`}
        >
          <AppText className="font-semibold text-gray-500">Previous</AppText>
        </TouchableOpacity>

        {activeSection === SECTIONS.length - 1 ? (
          <TouchableOpacity
            onPress={handleSubmit(handleSave)}
            disabled={isSaving}
            className="rounded-lg bg-blue-500 px-8 py-3"
          >
            {isSaving ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <AppText className="font-semibold text-white">
                {isEditing ? "Update Resume" : "Create Resume"}
              </AppText>
            )}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={handleNext}
            className="rounded-lg bg-blue-500 px-8 py-3"
          >
            <AppText className="font-semibold text-white">Next</AppText>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}
