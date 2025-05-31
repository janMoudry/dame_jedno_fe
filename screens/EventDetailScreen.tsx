import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { Event } from "../types";
import colors from "../theme/colors";

export default function EventDetailScreen() {
  const route = useRoute<RouteProp<{ params: { event: Event } }, "params">>();
  const { event } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Typ:</Text>
      <Text style={styles.value}>{event.type}</Text>

      <Text style={styles.label}>Popis:</Text>
      <Text style={styles.value}>{event.description || "—"}</Text>

      <Text style={styles.label}>Počet lidí:</Text>
      <Text style={styles.value}>{event.people_limit}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 24,
  },
  label: {
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 12,
    color: colors.surface,
  },
  value: {
    fontSize: 18,
    color: colors.text,
  },
});
