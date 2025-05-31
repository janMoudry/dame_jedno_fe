import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { BlurView } from "expo-blur";
import { useNavigation } from "@react-navigation/native";
import {
  Beer,
  Coffee,
  MessageCircle,
  FileWarning as Running,
  Clock,
  MapPin,
  Users,
} from "lucide-react-native";
import axios from "axios";
import { colors } from "../theme";
import useLocation from "../hooks/useLocation";

const EVENT_TAGS = [
  { id: "pivo", icon: Beer, label: "Na pivo" },
  { id: "kafe", icon: Coffee, label: "Na kávu" },
  { id: "pokec", icon: MessageCircle, label: "Pokec" },
  { id: "sport", icon: Running, label: "Sport" },
];

export default function CreateEventScreen() {
  const navigation = useNavigation();
  const { location, loading, error, refresh } = useLocation();
  const [tags, setTags] = useState(["pivo"]);
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [peopleLimit, setPeopleLimit] = useState(2);
  const [timeType, setTimeType] = useState("now");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleTag = (tag: string) => {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleCreate = async () => {
    if (!location) return;
    if (peopleLimit < 1 || peopleLimit > 10) return;
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      await axios.post("http://10.0.1.41:3001/api/events", {
        user_id: "abc123",
        name,
        description,
        tags,
        people_limit: peopleLimit,
        latitude: location.latitude,
        longitude: location.longitude,
        time_type: timeType,
      });
      navigation.goBack();
    } catch (err) {
      console.log("Chyba při vytváření:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} bounces={false}>
      <Text style={styles.title}>Vytvořit událost</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Název události</Text>
        <BlurView intensity={60} tint="light" style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Např. Na jedno do centra"
            placeholderTextColor={colors.surface}
            value={name}
            onChangeText={setName}
          />
        </BlurView>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tagy</Text>
        <View style={styles.typeGrid}>
          {EVENT_TAGS.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.typeButton, tags.includes(item.id) && styles.typeButtonActive]}
              onPress={() => toggleTag(item.id)}
            >
              <BlurView
                intensity={tags.includes(item.id) ? 90 : 60}
                tint="light"
                style={styles.typeButtonContent}
              >
                <item.icon
                  size={24}
                  color={tags.includes(item.id) ? colors.primary : colors.surface}
                  strokeWidth={2}
                />
                <Text style={[styles.typeButtonText, tags.includes(item.id) && styles.typeButtonTextActive]}>
                  {item.label}
                </Text>
              </BlurView>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Popis</Text>
        <BlurView intensity={60} tint="light" style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Např. Dáme jedno v centru..."
            placeholderTextColor={colors.surface}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
          />
        </BlurView>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Počet lidí</Text>
        <View style={styles.counterContainer}>
          <TouchableOpacity
            style={styles.counterButton}
            onPress={() => setPeopleLimit(Math.max(1, peopleLimit - 1))}
          >
            <Text style={styles.counterButtonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.counterText}>{peopleLimit}</Text>
          <TouchableOpacity
            style={styles.counterButton}
            onPress={() => setPeopleLimit(Math.min(10, peopleLimit + 1))}
          >
            <Text style={styles.counterButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Kdy?</Text>
        <View style={styles.typeGrid}>
          {["now", "planned"].map((option) => (
            <TouchableOpacity
              key={option}
              style={[styles.typeButton, timeType === option && styles.typeButtonActive]}
              onPress={() => setTimeType(option)}
            >
              <BlurView
                intensity={timeType === option ? 90 : 60}
                tint="light"
                style={styles.typeButtonContent}
              >
                <Clock size={20} color={timeType === option ? colors.primary : colors.surface} />
                <Text style={[styles.typeButtonText, timeType === option && styles.typeButtonTextActive]}>
                  {option === "now" ? "Teď hned" : "Naplánovat"}
                </Text>
              </BlurView>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={refresh} style={styles.retryButton}>
            <Text style={styles.retryText}>Zkusit znovu</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity
        style={[styles.createButton, (loading || isSubmitting || !location || !name) && styles.createButtonDisabled]}
        onPress={handleCreate}
        disabled={loading || isSubmitting || !location || !name}
      >
        {isSubmitting ? (
          <ActivityIndicator color={colors.white} />
        ) : (
          <Text style={styles.createButtonText}>
            {loading ? "Načítání polohy..." : "Vytvořit událost"}
          </Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 20
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 12,
  },
  typeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  typeButton: {
    flex: 1,
    minWidth: "45%",
    borderRadius: 16,
    overflow: "hidden",
  },
  typeButtonActive: {
    transform: [{ scale: 1.02 }],
  },
  typeButtonContent: {
    padding: 16,
    alignItems: "center",
    gap: 8,
  },
  typeButtonText: {
    fontSize: 14,
    color: colors.surface,
    fontWeight: "500",
  },
  typeButtonTextActive: {
    color: colors.primary,
    fontWeight: "600",
  },
  inputContainer: {
    borderRadius: 16,
    overflow: "hidden",
  },
  input: {
    padding: 16,
    fontSize: 16,
    color: colors.text,
    minHeight: 100,
  },
  counterContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },
  counterButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  counterButtonText: {
    fontSize: 24,
    color: colors.white,
    fontWeight: "600",
  },
  counterText: {
    fontSize: 24,
    fontWeight: "600",
    color: colors.text,
    width: 40,
    textAlign: "center",
  },
  errorContainer: {
    backgroundColor: colors.error + "15",
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  errorText: {
    color: colors.error,
    fontSize: 14,
    textAlign: "center",
    marginBottom: 8,
  },
  retryButton: {
    alignItems: "center",
  },
  retryText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "500",
  },
  createButton: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 8,
  },
  createButtonDisabled: {
    opacity: 0.5,
  },
  createButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
});