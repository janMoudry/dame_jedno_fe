import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import axios from "axios";
import colors from "../theme/colors";

type User = {
  name: string;
  gender: string;
  age: number;
};

export default function ProfileScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");

  const fetchUser = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://10.0.1.41:3001/api/users/abc123");
      setUser(res.data);
      setName(res.data.name);
      setGender(res.data.gender);
      setAge(String(res.data.age));
    } catch (err) {
      console.log("Chyba při načítání uživatele:", err);
      Alert.alert("Chyba při načítání uživatelských údajů");
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async () => {
    if (!name || !gender || !age) {
      Alert.alert("Vyplň všechna pole");
      return;
    }

    setSaving(true);
    try {
      await axios.put("http://10.0.1.41:3001/api/users/abc123", {
        name,
        gender,
        age: Number(age),
      });
      Alert.alert("Uživatel aktualizován");
    } catch (err) {
      console.log("Chyba při ukládání:", err);
      Alert.alert("Chyba při ukládání změn");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Jméno</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />

      <Text style={styles.label}>Pohlaví</Text>
      <TextInput style={styles.input} value={gender} onChangeText={setGender} />

      <Text style={styles.label}>Věk</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={age}
        onChangeText={setAge}
      />

      <TouchableOpacity
        style={styles.saveButton}
        onPress={updateUser}
        disabled={saving}
      >
        <Text style={styles.saveButtonText}>
          {saving ? "Ukládání..." : "Uložit změny"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  label: {
    fontSize: 16,
    color: colors.surface,
    marginBottom: 4,
    marginTop: 12,
  },
  input: {
    backgroundColor: colors.white,
    borderColor: colors.surface,
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
  saveButton: {
    marginTop: 24,
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
  },
  saveButtonText: {
    fontSize: 16,
    color: colors.white,
  },
});
