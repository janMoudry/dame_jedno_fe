import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { BlurView } from "expo-blur";
import { ChevronDown } from "lucide-react-native";
import { colors } from "../../theme";

type Props = {
  peopleLimit: number;
  setPeopleLimit: (limit: number) => void;
  genderPreference: string;
  onGenderPress: () => void;
  ageRange: { min: number; max: number };
  setAgeRange: (range: { min: number; max: number }) => void;
};

export function StepFour({
  peopleLimit,
  setPeopleLimit,
  genderPreference,
  onGenderPress,
  ageRange,
  setAgeRange,
}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Počet lidí</Text>
        <View style={styles.counterContainer}>
          <TouchableOpacity
            style={styles.counterButton}
            onPress={() => setPeopleLimit(Math.max(1, peopleLimit - 1))}
          >
            <Text style={styles.counterButtonText}>-</Text>
          </TouchableOpacity>
          <BlurView intensity={60} tint="light" style={styles.counterDisplay}>
            <Text style={styles.counterText}>{peopleLimit}</Text>
            <Text style={styles.counterLabel}>
              {peopleLimit === 1 ? "osoba" : peopleLimit < 5 ? "osoby" : "osob"}
            </Text>
          </BlurView>
          <TouchableOpacity
            style={styles.counterButton}
            onPress={() => setPeopleLimit(Math.min(5, peopleLimit + 1))}
          >
            <Text style={styles.counterButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preference</Text>
        <TouchableOpacity onPress={onGenderPress}>
          <BlurView intensity={60} tint="light" style={styles.preferenceButton}>
            <Text style={styles.preferenceLabel}>Pohlaví</Text>
            <View style={styles.preferenceValue}>
              <Text style={styles.preferenceText}>{genderPreference}</Text>
              <ChevronDown size={20} color={colors.surface} />
            </View>
          </BlurView>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Věkové rozmezí</Text>
        <View style={styles.ageContainer}>
          <BlurView intensity={60} tint="light" style={styles.ageInput}>
            <TextInput
              style={styles.ageText}
              keyboardType="numeric"
              value={String(ageRange.min)}
              onChangeText={(text) =>
                setAgeRange(prev => ({
                  ...prev,
                  min: Math.min(Math.max(Number(text) || 18, 18), prev.max)
                }))
              }
            />
            <Text style={styles.ageLabel}>let</Text>
          </BlurView>
          <Text style={styles.ageSeparator}>-</Text>
          <BlurView intensity={60} tint="light" style={styles.ageInput}>
            <TextInput
              style={styles.ageText}
              keyboardType="numeric"
              value={String(ageRange.max)}
              onChangeText={(text) =>
                setAgeRange(prev => ({
                  ...prev,
                  max: Math.max(Math.min(Number(text) || 99, 99), prev.min)
                }))
              }
            />
            <Text style={styles.ageLabel}>let</Text>
          </BlurView>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 24,
  },
  section: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
  },
  counterContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  counterButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  counterButtonText: {
    fontSize: 24,
    color: colors.white,
    fontWeight: "600",
  },
  counterDisplay: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: "center",
  },
  counterText: {
    fontSize: 24,
    fontWeight: "600",
    color: colors.text,
  },
  counterLabel: {
    fontSize: 14,
    color: colors.surface,
    marginTop: 4,
  },
  preferenceButton: {
    borderRadius: 16,
    padding: 16,
  },
  preferenceLabel: {
    fontSize: 14,
    color: colors.surface,
    marginBottom: 4,
  },
  preferenceValue: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  preferenceText: {
    fontSize: 16,
    color: colors.text,
  },
  ageContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  ageInput: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    padding: 16,
  },
  ageText: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.text,
    width: 40,
    textAlign: "center",
  },
  ageLabel: {
    fontSize: 14,
    color: colors.surface,
    marginLeft: 8,
  },
  ageSeparator: {
    fontSize: 24,
    color: colors.surface,
  },
});