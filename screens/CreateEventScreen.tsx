import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Modal,
  Pressable,
  TextInput,
  Animated,
} from "react-native";
import { BlurView } from "expo-blur";

import { useNavigation } from "@react-navigation/native";
import {
  Beer,
  Coffee,
  MessageCircle,
  Dumbbell,
  ChevronRight,
  ChevronLeft,
  Clock,
  MapPin,
  Users as UsersIcon,
  Calendar,
  ChevronDown,
  X,
  Tag,
} from "lucide-react-native";
import axios from "axios";
import { colors } from "../theme";
import useLocation from "../hooks/useLocation";

const CUSTOM_TAGS = [
  "Pivo", "Káva", "Pokec", "Sport", "Jídlo", "Kultura", 
  "Hudba", "Film", "Výlet", "Nákupy", "Hry", "Tanec"
];

type EventTimeType = "now" | "planned" | "recurring";
type GenderPreference = "any" | "male" | "female" | "other";

const GENDER_OPTIONS = [
  { value: "any", label: "Kdokoliv" },
  { value: "male", label: "Muži" },
  { value: "female", label: "Ženy" },
  { value: "other", label: "Ostatní" },
];

const EVENT_TAGS = [
  { id: "pivo", icon: Beer, label: "Na pivo" },
  { id: "kafe", icon: Coffee, label: "Na kávu" },
  { id: "pokec", icon: MessageCircle, label: "Pokec" },
  { id: "sport", icon: Dumbbell, label: "Sport" },
];

export default function CreateEventScreen() {
  const navigation = useNavigation();
  const { location, loading, error, refresh } = useLocation();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [tags, setTags] = useState(["pivo"]);
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [peopleLimit, setPeopleLimit] = useState(2);
  const [timeType, setTimeType] = useState<EventTimeType>("now");
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [placeName, setPlaceName] = useState("");
  const [genderPreference, setGenderPreference] = useState<GenderPreference>("any");
  const [ageRange, setAgeRange] = useState({ min: 18, max: 99 });
  const [isPrivate, setIsPrivate] = useState(false);
  
  const [customTag, setCustomTag] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showGenderModal, setShowGenderModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const toggleTag = (tag: string) => {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const addCustomTag = () => {
    if (customTag.trim() && !tags.includes(customTag.trim())) {
      setTags(prev => [...prev, customTag.trim()]);
      setCustomTag("");
    }
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  const handleCreate = async () => {
    if (!location) return;
    if (peopleLimit < 1 || peopleLimit > 10) return;
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      await axios.post("http://10.0.1.41:3001/api/events", {
        user_id: "abc123",
        created_by: "abc123",
        name,
        description,
        tags,
        place_name: placeName,
        people_limit: peopleLimit,
        latitude: location.latitude,
        longitude: location.longitude,
        time_type: timeType,
        start_time: startTime?.toISOString(),
        end_time: endTime?.toISOString(),
        gender_preference: genderPreference,
        age_range: ageRange,
        is_private: isPrivate,
        participants: [],
        is_active: true,
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
          <MessageCircle size={20} color={colors.surface} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Např. Dáme jedno v centru..."
            placeholderTextColor={colors.surface}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            maxLength={500}
          />
        </BlurView>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Kdy?</Text>
        <View style={styles.typeGrid}>
          {["now", "planned", "recurring"].map((option) => (
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
                  {option === "now" ? "Teď hned" : option === "planned" ? "Naplánovat" : "Opakující se"}
                </Text>
              </BlurView>
            </TouchableOpacity>
          ))}
        </View>
        
        {timeType !== "now" && (
          <View style={styles.dateContainer}>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Calendar size={20} color={colors.surface} />
              <Text style={styles.dateButtonText}>
                {startTime ? startTime.toLocaleDateString() : "Vybrat datum"}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Omezení účasti</Text>
        
        <View style={styles.limitContainer}>
          <View style={styles.limitSection}>
            <Text style={styles.limitLabel}>Počet lidí</Text>
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
          
          <TouchableOpacity
            style={styles.genderButton}
            onPress={() => setShowGenderModal(true)}
          >
            <Text style={styles.genderButtonLabel}>Preference pohlaví</Text>
            <View style={styles.genderButtonContent}>
              <Text style={styles.genderButtonText}>
                {GENDER_OPTIONS.find(opt => opt.value === genderPreference)?.label}
              </Text>
              <ChevronDown size={20} color={colors.surface} />
            </View>
          </TouchableOpacity>
          
          <View style={styles.ageRangeContainer}>
            <Text style={styles.ageRangeLabel}>Věkové rozmezí</Text>
            <View style={styles.ageRangeInputs}>
              <TextInput
                style={styles.ageInput}
                keyboardType="numeric"
                value={String(ageRange.min)}
                onChangeText={(text) => 
                  setAgeRange(prev => ({
                    ...prev,
                    min: Math.min(Math.max(Number(text) || 18, 18), prev.max)
                  }))
                }
              />
              <Text style={styles.ageRangeDash}>-</Text>
              <TextInput
                style={styles.ageInput}
                keyboardType="numeric"
                value={String(ageRange.max)}
                onChangeText={(text) =>
                  setAgeRange(prev => ({
                    ...prev,
                    max: Math.max(Math.min(Number(text) || 99, 99), prev.min)
                  }))
                }
              />
            </View>
          </View>
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
      
      <Modal
        visible={showGenderModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowGenderModal(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowGenderModal(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Preference pohlaví</Text>
              <TouchableOpacity
                onPress={() => setShowGenderModal(false)}
                style={styles.modalCloseButton}
              >
                <X size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            {GENDER_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.modalOption,
                  genderPreference === option.value && styles.modalOptionSelected
                ]}
                onPress={() => {
                  setGenderPreference(option.value as GenderPreference);
                  setShowGenderModal(false);
                }}
              >
                <Text style={[
                  styles.modalOptionText,
                  genderPreference === option.value && styles.modalOptionTextSelected
                ]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
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
  limitContainer: {
    gap: 16,
  },
  limitSection: {
    gap: 8,
  },
  limitLabel: {
    fontSize: 14,
    color: colors.surface,
    marginBottom: 4,
  },
  genderButton: {
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 16,
  },
  genderButtonLabel: {
    fontSize: 14,
    color: colors.surface,
    marginBottom: 4,
  },
  genderButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  genderButtonText: {
    fontSize: 16,
    color: colors.text,
  },
  ageRangeContainer: {
    gap: 8,
  },
  ageRangeLabel: {
    fontSize: 14,
    color: colors.surface,
  },
  ageRangeInputs: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  ageInput: {
    backgroundColor: colors.card,
    padding: 12,
    borderRadius: 12,
    width: 80,
    textAlign: "center",
    fontSize: 16,
    color: colors.text,
  },
  ageRangeDash: {
    fontSize: 20,
    color: colors.surface,
  },
  dateContainer: {
    marginTop: 12,
  },
  dateButton: {
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  dateButtonText: {
    fontSize: 16,
    color: colors.text,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.text,
  },
  modalCloseButton: {
    padding: 8,
  },
  modalOption: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  modalOptionSelected: {
    backgroundColor: colors.primary + "15",
  },
  modalOptionText: {
    fontSize: 16,
    color: colors.text,
    textAlign: "center",
  },
  modalOptionTextSelected: {
    color: colors.primary,
    fontWeight: "600",
  },
});