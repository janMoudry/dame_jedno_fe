import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { BlurView } from "expo-blur";
import { Clock } from "lucide-react-native";
import { colors } from "../../theme";

type Props = {
  timeType: "now" | "planned" | "recurring";
  setTimeType: (type: "now" | "planned" | "recurring") => void;
};

export function StepThree({ timeType, setTimeType }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Kdy?</Text>
      <TouchableOpacity
        style={[
          styles.timeButton,
          timeType === "now" && styles.timeButtonActive
        ]}
        onPress={() => setTimeType("now")}
      >
        <BlurView
          intensity={timeType === "now" ? 90 : 60}
          tint="light"
          style={styles.timeButtonContent}
        >
          <Clock
            size={24}
            color={timeType === "now" ? colors.primary : colors.surface}
          />
          <View style={styles.timeTextContainer}>
            <Text style={[
              styles.timeTitle,
              timeType === "now" && styles.timeTitleActive
            ]}>
              Teď hned
            </Text>
            <Text style={styles.timeDescription}>
              Událost začne okamžitě po vytvoření
            </Text>
          </View>
        </BlurView>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
  },
  timeButton: {
    borderRadius: 16,
    overflow: "hidden",
  },
  timeButtonActive: {
    transform: [{ scale: 1.02 }],
  },
  timeButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    gap: 16,
  },
  timeTextContainer: {
    flex: 1,
  },
  timeTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.surface,
    marginBottom: 4,
  },
  timeTitleActive: {
    color: colors.primary,
  },
  timeDescription: {
    fontSize: 14,
    color: colors.surface,
  },
});