import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { formatDistanceToNow } from "date-fns";
import { Note } from "../../../types/notes";

interface NoteCardProps {
  note: Note;
  onPress: () => void;
  onDelete: () => void;
  onArchive: () => void;
  onPin: () => void;
  isDeleting?: boolean;
  isTogglingArchive?: boolean;
  isTogglingPin?: boolean;
}

// Helper function to strip HTML tags and decode HTML entities
const stripHtml = function (html: string) {
  if (!html) return "";

  // Remove HTML tags
  let text = html.replace(/<[^>]*>/g, " ");

  // Decode common HTML entities
  text = text.replace(/&nbsp;/g, " ");
  text = text.replace(/&amp;/g, "&");
  text = text.replace(/&lt;/g, "<");
  text = text.replace(/&gt;/g, ">");
  text = text.replace(/&quot;/g, '"');
  text = text.replace(/&#39;/g, "'");

  // Remove extra whitespace
  text = text.replace(/\s+/g, " ").trim();

  return text;
};

export function NoteCard({
  note,
  onPress,
  onDelete,
  onArchive,
  onPin,
  isDeleting = false,
  isTogglingArchive = false,
  isTogglingPin = false,
}: NoteCardProps) {
  // Get plain text preview (max 100 characters)
  const contentPreview = note.content ? stripHtml(note.content) : "";
  const truncatedContent =
    contentPreview.length > 100
      ? contentPreview.slice(0, 100) + "..."
      : contentPreview;

  return (
    <Pressable
      onPress={onPress}
      className="mx-4 my-1.5 rounded-xl border border-gray-100 bg-gray-50 p-4"
      style={({ pressed }) => ({
        opacity: pressed ? 0.7 : 1,
      })}
    >
      <View className="flex-row items-start justify-between">
        <View className="flex-1">
          <View className="flex-row items-center gap-2">
            {note.isPinned && <Ionicons name="pin" size={16} color="#F59E0B" />}
            {note.isArchived && (
              <Ionicons name="archive-outline" size={16} color="#9CA3AF" />
            )}
            <Text className="flex-1 text-base font-semibold text-gray-900">
              {note.title}
            </Text>
          </View>

          {/* Content Preview - Plain text only, no HTML tags */}
          {truncatedContent && (
            <Text numberOfLines={2} className="mt-1 text-sm text-gray-600">
              {truncatedContent}
            </Text>
          )}

          <View className="mt-2 flex-row flex-wrap items-center gap-2">
            {note.folder && (
              <View
                className="rounded-full px-2 py-0.5"
                style={{
                  backgroundColor: note.folder.color || "#E5E7EB",
                }}
              >
                <Text className="text-xs text-gray-700">
                  {note.folder.name}
                </Text>
              </View>
            )}

            {note.tags?.slice(0, 3).map((tagItem) => (
              <View
                key={tagItem.id}
                className="rounded-full bg-blue-100 px-2 py-0.5"
              >
                <Text className="text-xs text-blue-700">
                  #{tagItem.tag.name}
                </Text>
              </View>
            ))}

            {note.tags && note.tags.length > 3 && (
              <Text className="text-xs text-gray-400">
                +{note.tags.length - 3}
              </Text>
            )}
          </View>

          <Text className="mt-2 text-xs text-gray-400">
            Updated{" "}
            {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}
          </Text>
        </View>

        <View className="flex-row gap-1">
          <TouchableOpacity
            onPress={onPin}
            className="p-1"
            disabled={isTogglingPin}
          >
            {isTogglingPin ? (
              <ActivityIndicator size="small" color="#F59E0B" />
            ) : (
              <Ionicons
                name={note.isPinned ? "pin" : "pin-outline"}
                size={18}
                color={note.isPinned ? "#F59E0B" : "#9CA3AF"}
              />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onArchive}
            className="p-1"
            disabled={isTogglingArchive}
          >
            {isTogglingArchive ? (
              <ActivityIndicator size="small" color="#3B82F6" />
            ) : (
              <Ionicons
                name={note.isArchived ? "archive" : "archive-outline"}
                size={18}
                color={note.isArchived ? "#3B82F6" : "#9CA3AF"}
              />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onDelete}
            className="p-1"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <ActivityIndicator size="small" color="#EF4444" />
            ) : (
              <Ionicons name="trash-outline" size={18} color="#EF4444" />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Pressable>
  );
}
