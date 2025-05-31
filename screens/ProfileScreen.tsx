import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Modal,
} from "react-native";
import { BlurView } from "expo-blur";
import axios from "axios";
import { User, CircleUser as UserCircle2, ChevronDown, Calendar, X } from "lucide-react-native";
import colors from "../theme/colors";

const GENDER_OPTIONS = [
  { label: "Muž", value: "muž" },
  { label: "Žena", value: "žena" },
  { label: "Jiné", value: "jiné" },
];

const BIRTH_YEARS = Array.from({ length: 100 }, (_, i) => {
  const year = new Date().getFullYear() - i;
  return { label: String(year), value: year };
});

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
  const [birthYear, setBirthYear] = useState<number | null>(null);
  const [showYearModal, setShowYearModal] = useState(false);
  const [showGenderModal, setShowGenderModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get("http://10.0.1.41:3001/api/users/abc123");
      setUser(res.data);
      setName(res.data.name);
      setGender(res.data.gender);
      setBirthYear(new Date().getFullYear() - res.data.age);
    } catch (err) {
      setError("Nepodařilo se načíst uživatelské údaje");
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async () => {
    if (!name || !gender || !birthYear) {
      setError("Vyplňte prosím všechna pole");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      await axios.put("http://10.0.1.41:3001/api/users/abc123", {
        name,
        gender,
        age: new Date().getFullYear() - birthYear,
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

          <TouchableOpacity onPress={() => setShowGenderModal(true)}>
            <BlurView intensity={60} tint="light" style={styles.inputContainer}>
              <User size={20} color={colors.surface} />
              <Text style={[styles.input, !gender && styles.placeholder]}>
                {gender || "Vyberte pohlaví"}
              </Text>
              <ChevronDown size={20} color={colors.surface} />
            </BlurView>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setShowYearModal(true)}>
            <BlurView intensity={60} tint="light" style={styles.inputContainer}>
              <Calendar size={20} color={colors.surface} />
              <Text style={[
                styles.input,
                !birthYear && styles.placeholder
              ]}>
                {birthYear ? String(birthYear) : "Rok narození"}
              </Text>
              <ChevronDown size={20} color={colors.surface} />
            </BlurView>
          </TouchableOpacity>
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

      <Modal
        visible={showGenderModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowGenderModal(false)}
        statusBarTranslucent
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowGenderModal(false)}
        >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Vyberte pohlaví</Text>
              <TouchableOpacity
                onPress={() => setShowGenderModal(false)}
                style={styles.closeButton}
              >
                <X size={24} color={colors.surface} />
              </TouchableOpacity>
            </View>
            <View style={styles.modalContent}>
              {GENDER_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.optionButton,
                    gender === option.value && styles.optionButtonSelected
                  ]}
                  onPress={() => {
                    setGender(option.value);
                    setShowGenderModal(false);
                  }}
                >
                  <Text style={[
                    styles.optionText,
                    gender === option.value && styles.optionTextSelected
                  ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
        </TouchableOpacity>
      </Modal>

      <Modal
        visible={showYearModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowYearModal(false)}
        statusBarTranslucent
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowYearModal(false)}
        >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Rok narození</Text>
              <TouchableOpacity
                onPress={() => setShowYearModal(false)}
                style={styles.closeButton}
              >
                <X size={24} color={colors.surface} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.yearList}>
              {BIRTH_YEARS.map((year) => (
                <TouchableOpacity
                  key={year.value}
                  style={[
                    styles.optionButton,
                    birthYear === year.value && styles.optionButtonSelected
                  ]}
                  onPress={() => {
                    setBirthYear(year.value);
                    setShowYearModal(false);
                  }}
                >
                  <Text style={[
                    styles.optionText,
                    birthYear === year.value && styles.optionTextSelected
                  ]}>
                    {year.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
        </TouchableOpacity>
      </Modal>
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
  placeholder: {
    color: colors.surface,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  modalCard: {
    width: "100%",
    maxHeight: "80%",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: "hidden",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.surface + "20",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
  },
  closeButton: {
    padding: 4,
  },
  modalContent: {
    padding: 12,
  },
  yearList: {
    maxHeight: 400,
    width: 100,
    backgroundColor: colors.white
  },
  optionButton: {
    padding: 14,
    marginVertical: 4,
    borderRadius: 12,
  },
  optionButtonSelected: {
    backgroundColor: colors.primary + "15",
  },
  optionText: {
    fontSize: 16,
    color: colors.text,
  },
  optionTextSelected: {
    color: colors.primary,
    fontWeight: "600",
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