import React, { useEffect, useState } from "react";
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
import axios from "axios";
import { User, CircleUser as UserCircle2, Mail, Calendar } from "lucide-react-native";
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
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get("http://10.0.1.41:3001/api/users/abc123");
      setUser(res.data);
      setName(res.data.name);
      setGender(res.data.gender);
      setAge(String(res.data.age));
    } catch (err) {
      setError("Nepodařilo se načíst uživatelské údaje");
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async () => {
    if (!name || !gender || !age) {
      setError("Vyplňte prosím všechna pole");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      await axios.put("http://10.0.1.41:3001/api/users/abc123", {
        name,
        gender,
        age: Number(age),
      });
      setUser({ name, gender, age: Number(age) });
    } catch (err) {
      setError("Nepodařilo se uložit změny");
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
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.content}
      bounces={false}
    >
      <View style={styles.header}>
        <UserCircle2 
          size={80} 
          color={colors.primary}
          strokeWidth={1.5}
        />
        <Text style={styles.title}>Můj profil</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Osobní údaje</Text>
        
        <View style={styles.inputGroup}>
          <BlurView intensity={60} tint="light" style={styles.inputContainer}>
            <User size={20} color={colors.surface} />
            <TextInput
              style={styles.input}
              placeholder="Jméno"
              placeholderTextColor={colors.surface}
              value={name}
              onChangeText={setName}
            />
          </BlurView>

          <BlurView intensity={60} tint="light" style={styles.inputContainer}>
            <Mail size={20} color={colors.surface} />
            <TextInput
              style={styles.input}
              placeholder="Pohlaví"
              placeholderTextColor={colors.surface}
              value={gender}
              onChangeText={setGender}
            />
          </BlurView>

          <BlurView intensity={60} tint="light" style={styles.inputContainer}>
            <Calendar size={20} color={colors.surface} />
            <TextInput
              style={styles.input}
              placeholder="Věk"
              placeholderTextColor={colors.surface}
              keyboardType="numeric"
              value={age}
              onChangeText={setAge}
            />
          </BlurView>
        </View>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={fetchUser}
          disabled={loading || saving}
        >
          <Text style={styles.secondaryButtonText}>Zrušit změny</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.primaryButton, saving && styles.buttonDisabled]}
          onPress={updateUser}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.primaryButtonText}>Uložit změny</Text>
          )}
        </TouchableOpacity>
      </View>
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
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.text,
    marginTop: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 16,
  },
  inputGroup: {
    gap: 12,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    overflow: "hidden",
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    padding: 16,
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
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
  },
  actions: {
    flexDirection: "row",
    gap: 12,
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  primaryButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    backgroundColor: colors.surface + "20",
  },
  secondaryButtonText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: "600",
  },
});