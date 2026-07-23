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

          {note.content && (
            <Text numberOfLines={2} className="mt-1 text-sm text-gray-600">
              {note.content}
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

            {note.tags?.slice(0, 3).map((tag) => (
              <View
                key={tag.id}
                className="rounded-full bg-blue-100 px-2 py-0.5"
              >
                <Text className="text-xs text-blue-700">#{tag.name}</Text>
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
              <Ionicons name="close-outline" size={18} color="#EF4444" />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Pressable>
  );
}
