import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { BlurView } from "expo-blur";
import {
  Beer,
  Coffee,
  MessageCircle,
  Dumbbell,
  Music,
  Film,
  Utensils,
  Palette,
  Tag as TagIcon,
  Plus,
} from "lucide-react-native";
import { colors } from "../../theme";

const PREDEFINED_TAGS = [
  { id: "pivo", icon: Beer, label: "Pivo" },
  { id: "kafe", icon: Coffee, label: "Káva" },
  { id: "pokec", icon: MessageCircle, label: "Pokec" },
  { id: "sport", icon: Dumbbell, label: "Sport" },
  { id: "jidlo", icon: Utensils, label: "Jídlo" },
  { id: "kultura", icon: Palette, label: "Kultura" },
  { id: "hudba", icon: Music, label: "Hudba" },
  { id: "film", icon: Film, label: "Film" },
];

type Props = {
  tags: string[];
  setTags: (tags: string[]) => void;
  description: string;
  setDescription: (description: string) => void;
};

export function StepTwo({
  tags,
  setTags,
  description,
  setDescription,
}: Props) {
  const [customTag, setCustomTag] = useState("");

  const toggleTag = (tag: string) => {
    setTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const addCustomTag = () => {
    if (customTag.trim() && !tags.includes(customTag.trim())) {
      setTags(prev => [...prev, customTag.trim()]);
      setCustomTag("");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tagy</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tagsScroll}
        >
          {PREDEFINED_TAGS.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.tagButton,
                tags.includes(item.id) && styles.tagButtonActive
              ]}
              onPress={() => toggleTag(item.id)}
            >
              <item.icon
                size={20}
                color={tags.includes(item.id) ? colors.primary : colors.surface}
              />
              <Text style={[
                styles.tagText,
                tags.includes(item.id) && styles.tagTextActive
              ]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.customTagContainer}>
          <BlurView intensity={60} tint="light" style={styles.customTagInput}>
            <TagIcon size={20} color={colors.surface} />
            <TextInput
              style={styles.input}
              placeholder="Vlastní tag..."
              placeholderTextColor={colors.surface}
              value={customTag}
              onChangeText={setCustomTag}
              onSubmitEditing={addCustomTag}
            />
          </BlurView>
          <TouchableOpacity
            style={[
              styles.addTagButton,
              !customTag.trim() && styles.addTagButtonDisabled
            ]}
            onPress={addCustomTag}
            disabled={!customTag.trim()}
          >
            <Plus size={24} color={colors.white} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Popis</Text>
        <BlurView intensity={60} tint="light" style={styles.descriptionContainer}>
          <TextInput
            style={styles.descriptionInput}
            placeholder="Popiš svoji událost..."
            placeholderTextColor={colors.surface}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            maxLength={500}
          />
          <Text style={styles.charCount}>
            {description.length}/500
          </Text>
        </BlurView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 24,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
  },
  tagsScroll: {
    paddingVertical: 8,
    gap: 8,
  },
  tagButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  tagButtonActive: {
    backgroundColor: colors.primary + "15",
  },
  tagText: {
    fontSize: 14,
    color: colors.surface,
  },
  tagTextActive: {
    color: colors.primary,
    fontWeight: "600",
  },
  customTagContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  customTagInput: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: 16,
    paddingHorizontal: 16,
    gap: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    paddingVertical: 12,
  },
  addTagButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  addTagButtonDisabled: {
    opacity: 0.5,
  },
  descriptionContainer: {
    borderRadius: 16,
    backgroundColor: colors.card,
    padding: 16,
  },
  descriptionInput: {
    fontSize: 16,
    color: colors.text,
    minHeight: 100,
  },
  charCount: {
    fontSize: 12,
    color: colors.surface,
    alignSelf: "flex-end",
    marginTop: 8,
  },
});