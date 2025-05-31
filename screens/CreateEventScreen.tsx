import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import axios from "axios";
import { colors } from "../theme";
import useLocation from "../hooks/useLocation";
import { StepOne } from "../components/create-event/StepOne";
import { StepTwo } from "../components/create-event/StepTwo";
import { StepThree } from "../components/create-event/StepThree";
import { StepFour } from "../components/create-event/StepFour";

export default function CreateEventScreen() {
  const navigation = useNavigation();
  const { location, loading: locationLoading, error: locationError, refresh } = useLocation();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Step 1 state
  const [name, setName] = useState("");
  const [placeName, setPlaceName] = useState("");

  // Step 2 state
  const [tags, setTags] = useState<string[]>([]);
  const [description, setDescription] = useState("");

  // Step 3 state
  const [timeType, setTimeType] = useState<"now" | "planned" | "recurring">("now");

  // Step 4 state
  const [peopleLimit, setPeopleLimit] = useState(2);
  const [genderPreference, setGenderPreference] = useState<"any" | "male" | "female" | "other">("any");
  const [ageRange, setAgeRange] = useState({ min: 18, max: 99 });

  const steps = [
    {
      title: "Základní info",
      component: (
        <StepOne
          name={name}
          setName={setName}
          placeName={placeName}
          setPlaceName={setPlaceName}
          loading={locationLoading}
          error={locationError}
        />
      ),
      isValid: () => name.trim().length > 0
    },
    {
      title: "Tagy a popis",
      component: (
        <StepTwo
          tags={tags}
          setTags={setTags}
          description={description}
          setDescription={setDescription}
        />
      ),
      isValid: () => tags.length > 0
    },
    {
      title: "Kdy",
      component: (
        <StepThree
          timeType={timeType}
          setTimeType={setTimeType}
        />
      ),
      isValid: () => true
    },
    {
      title: "Omezení",
      component: (
        <StepFour
          peopleLimit={peopleLimit}
          setPeopleLimit={setPeopleLimit}
          genderPreference={genderPreference}
          onGenderPress={() => {
            const nextPref = {
              any: "male",
              male: "female",
              female: "other",
              other: "any"
            }[genderPreference];
            setGenderPreference(nextPref as any);
          }}
          ageRange={ageRange}
          setAgeRange={setAgeRange}
        />
      ),
      isValid: () => peopleLimit >= 1 && peopleLimit <= 5
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1 && steps[currentStep].isValid()) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    } else {
      navigation.goBack();
    }
  };

  const handleCreate = async () => {
    if (!location || !steps[currentStep].isValid()) return;

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
        gender_preference: genderPreference,
        age_range: ageRange,
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
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Nová událost</Text>
        <View style={styles.backButton} />
      </View>

      <View style={styles.progress}>
        {steps.map((_, index) => (
          <View
            key={index}
            style={[
              styles.progressDot,
              index <= currentStep && styles.progressDotActive,
            ]}
          />
        ))}
      </View>

      <Text style={styles.stepTitle}>{steps[currentStep].title}</Text>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        bounces={false}
      >
        {steps[currentStep].component}
      </ScrollView>

      <View style={styles.footer}>
        {currentStep < steps.length - 1 ? (
          <TouchableOpacity
            style={[
              styles.button,
              !steps[currentStep].isValid() && styles.buttonDisabled
            ]}
            onPress={handleNext}
            disabled={!steps[currentStep].isValid()}
          >
            <Text style={styles.buttonText}>Další</Text>
            <ChevronRight size={20} color={colors.white} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[
              styles.button,
              (isSubmitting || !steps[currentStep].isValid()) && styles.buttonDisabled
            ]}
            onPress={handleCreate}
            disabled={isSubmitting || !steps[currentStep].isValid()}
          >
            {isSubmitting ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.buttonText}>Vytvořit událost</Text>
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.text,
  },
  progress: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginBottom: 24,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.surface + "40",
  },
  progressDotActive: {
    backgroundColor: colors.primary,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  footer: {
    padding: 20,
    paddingBottom: 40,
  },
  button: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
});