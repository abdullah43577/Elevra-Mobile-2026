import { CoverLetterItem } from "@/components/cover-letters/cover-letter-item";
import { AppText } from "@/components/shared/app-text";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { IconButton } from "@/components/shared/icon-button";
import { useProAction } from "@/components/shared/pro-gate";
import { SearchBar } from "@/components/shared/search-bar";
import { PRO_FEATURES } from "@/constants/entitlements";
import { useDeleteCoverLetter } from "@/hooks/cover-letters/use-delete-cover-letter";
import { useExportCoverLetter } from "@/hooks/cover-letters/use-export-cover-letter";
import { useGetCoverLetters } from "@/hooks/cover-letters/use-get-cover-letters";
import { useDebounce } from "@/hooks/use-debounce";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { showToast } from "@/utils/show-toast";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CoverLetter } from "../../../../../../types/cover-letter";

export default function CoverLetters() {
  const router = useRouter();
  const { contentColor } = useThemeColors();
  const accent = contentColor("letter");

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const debouncedSearch = useDebounce(searchQuery, 400);

  const [deleteTarget, setDeleteTarget] = useState<CoverLetter | null>(null);
  const [exportingId, setExportingId] = useState<string | null>(null);

  const { coverLetters, isFetchingCoverLetters, refetchCoverLetters } =
    useGetCoverLetters({ ...(debouncedSearch && { search: debouncedSearch }) });

  const { exportCoverLetter } = useExportCoverLetter();
  const { allowed: canExport, copy: exportCopy } = useProAction(
    PRO_FEATURES.COVER_LETTER_EXPORT,
  );

  const { deleteCoverLetter, isDeletingCoverLetter } = useDeleteCoverLetter({
    coverLetterId: deleteTarget?.id ?? "",
  });

  const handleCreate = function () {
    router.push("/(dashboard)/(tabs)/workspaces/cover-letters/letter-editor");
  };

  const handleEdit = function (coverLetterId: string) {
    router.push({
      pathname: "/(dashboard)/(tabs)/workspaces/cover-letters/letter-editor",
      params: { coverLetterId },
    });
  };

  /*
    The button stays visible for free users. Tapping it opens the paywall rather
    than just refusing — someone who has written a letter and reached for Export
    is at the highest-intent moment there is. The server rejects with 402
    regardless; this only saves a round trip.
  */
  const handleExport = async function (coverLetter: CoverLetter) {
    if (!canExport) {
      showToast("warning", exportCopy.blurb);
      router.push("/(dashboard)/paywall");
      return;
    }

    setExportingId(coverLetter.id);
    await exportCoverLetter(coverLetter);
    setExportingId(null);
    refetchCoverLetters();
  };

  const handleConfirmDelete = async function () {
    await deleteCoverLetter();
    setDeleteTarget(null);
  };

  const isFirstLoad = isFetchingCoverLetters && coverLetters.length === 0;
  const isFiltering = !!debouncedSearch;

  return (
    <SafeAreaView className="flex-1 bg-canvas">
      <View className="flex-row items-start justify-between px-5 pb-4 pt-2">
        <View className="flex-1 pr-3">
          <AppText type="display">Cover Letters</AppText>
          <AppText type="subtitle" className="mt-1">
            Letters that match the resume you send with them
          </AppText>
        </View>

        <IconButton
          icon={isSearchVisible ? "close-outline" : "search-outline"}
          onPress={() => {
            setIsSearchVisible((previous) => !previous);
            if (isSearchVisible) setSearchQuery("");
          }}
        />
      </View>

      {isSearchVisible && (
        <View className="px-5 pb-3">
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            onClear={() => setSearchQuery("")}
            placeholder="Search company or role..."
            autoFocus
          />
        </View>
      )}

      {isFirstLoad ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color={accent} />
        </View>
      ) : (
        <FlatList
          data={coverLetters}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <CoverLetterItem
              coverLetter={item}
              isExporting={exportingId === item.id}
              onEdit={handleEdit}
              onExport={handleExport}
              onDelete={setDeleteTarget}
            />
          )}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingBottom: 110,
            gap: 12,
            flexGrow: 1,
          }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isFetchingCoverLetters && coverLetters.length > 0}
              onRefresh={() => refetchCoverLetters()}
              tintColor={accent}
            />
          }
          ListEmptyComponent={
            <EmptyState
              icon="mail-outline"
              accentColor={accent}
              title={isFiltering ? "No letters found" : "No cover letters yet"}
              subtitle={
                isFiltering
                  ? "Try a different company or role"
                  : "Write one letter per role and export it as a PDF that matches your resume"
              }
              {...(!isFiltering && {
                buttonText: "Write a letter",
                onButtonPress: handleCreate,
              })}
            />
          }
        />
      )}

      <Pressable
        onPress={handleCreate}
        className="absolute bottom-6 right-5 h-14 w-14 items-center justify-center rounded-full active:opacity-80"
        style={{
          backgroundColor: accent,
          shadowColor: accent,
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.3,
          shadowRadius: 12,
          elevation: 6,
        }}
      >
        <Ionicons name="add" size={26} color="white" />
      </Pressable>

      <ConfirmDialog
        visible={!!deleteTarget}
        title="Delete cover letter"
        message={`"${deleteTarget?.title}" will be permanently deleted.`}
        confirmLabel="Delete"
        variant="delete"
        isLoading={isDeletingCoverLetter}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </SafeAreaView>
  );
}
