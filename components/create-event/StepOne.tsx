import React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { BlurView } from "expo-blur";
import { MapPin } from "lucide-react-native";
import { colors } from "../../theme";

type Props = {
  name: string;
  setName: (name: string) => void;
  placeName: string;
  setPlaceName: (name: string) => void;
  loading: boolean;
  error: string | null;
};

export function StepOne({
  name,
  setName,
  placeName,
  setPlaceName,
  loading,
  error,
}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Název události</Text>
        <BlurView intensity={60} tint="light" style={styles.inputContainer}>
          <MapPin size={20} color={colors.surface} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Např. Na jedno do centra"
            placeholderTextColor={colors.surface}
            value={name}
            onChangeText={setName}
            maxLength={50}
          />
        </BlurView>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Místo</Text>
        <BlurView intensity={60} tint="light" style={styles.inputContainer}>
          <MapPin size={20} color={colors.surface} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Název místa (nepovinné)"
            placeholderTextColor={colors.surface}
            value={placeName}
            onChangeText={setPlaceName}
          />
        </BlurView>
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color={colors.primary} />
            <Text style={styles.loadingText}>Načítání polohy...</Text>
          </View>
        )}
        {error && (
          <Text style={styles.errorText}>{error}</Text>
        )}
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
  inputContainer: {
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: colors.card,
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
  },
  loadingText: {
    color: colors.surface,
    fontSize: 14,
  },
  errorText: {
    color: colors.error,
    fontSize: 14,
    marginTop: 8,
  },
});