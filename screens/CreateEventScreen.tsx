import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { colors } from "../theme";
import useLocation from "../hooks/useLocation";
import { useNavigation } from "@react-navigation/native";

const EVENT_TYPES = ["pivo", "kafe", "pokec", "sport"];

export default function CreateEventScreen() {
  const navigation = useNavigation();
  const { location, loading, error, refresh } = useLocation();
  const [type, setType] = useState("pivo");
  const [description, setDescription] = useState("");
  const [peopleLimit, setPeopleLimit] = useState(2);

  const handleCreate = async () => {
    if (!location) {
      Alert.alert("Poloha není dostupná");
      return;
    }

    if (peopleLimit < 1 || peopleLimit > 5) {
      Alert.alert("Počet lidí musí být mezi 1 a 5");
      return;
    }

    try {
      const res = await axios.post("http://10.0.1.41:3001/api/events", {
        user_id: "abc123", // zatím natvrdo
        type,
        description,
        people_limit: peopleLimit,
        latitude: location.latitude,
        longitude: location.longitude,
      });

      Alert.alert("Událost vytvořena");
      navigation.goBack();
    } catch (err) {
      console.log("Chyba při vytváření:", err);
      Alert.alert("Chyba při vytváření události");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Typ události</Text>
      <View style={styles.buttonGroup}>
        {EVENT_TYPES.map((item) => (
          <TouchableOpacity
            key={item}
            style={[styles.button, type === item && styles.buttonActive]}
            onPress={() => setType(item)}
          >
            <Text style={styles.buttonText}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Popis</Text>
      <TextInput
        style={styles.input}
        placeholder="Např. 'Na jedno v centru...'"
        value={description}
        onChangeText={setDescription}
      />

      <Text style={styles.label}>Počet lidí</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={peopleLimit.toString()}
        onChangeText={(val) => setPeopleLimit(Number(val))}
      />

      {error && <Text style={styles.error}>{error}</Text>}

      <TouchableOpacity
        style={[
          styles.createButton,
          (!location || loading) && { opacity: 0.5 },
        ]}
        onPress={handleCreate}
        disabled={!location || loading}
      >
        <Text style={styles.createButtonText}>
          {loading ? "Načítání polohy..." : "Vytvořit"}
        </Text>
      </TouchableOpacity>

      {error && (
        <TouchableOpacity onPress={refresh}>
          <Text style={styles.retry}>Zkusit znovu získat polohu</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.background,
  },
  label: {
    fontSize: 16,
    marginVertical: 8,
    color: colors.text,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.surface,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    backgroundColor: colors.white,
  },
  buttonGroup: {
    flexDirection: "row",
    marginBottom: 10,
    flexWrap: "wrap",
    gap: 10,
  },
  button: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.surface,
    backgroundColor: colors.white,
  },
  buttonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  buttonText: {
    color: colors.text,
    fontSize: 14,
  },
  createButton: {
    marginTop: 20,
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
  },
  createButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  error: {
    color: "red",
    marginTop: 10,
    textAlign: "center",
  },
  retry: {
    marginTop: 10,
    textAlign: "center",
    color: colors.accent,
  },
});
