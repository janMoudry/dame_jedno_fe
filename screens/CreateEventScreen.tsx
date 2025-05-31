Here's the complete file content after applying the diff changes:

import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
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

type EventTimeType = "now" | "planned" | "recurring";
type GenderPreference = "any" | "male" | "female" | "other";

export default function CreateEventScreen() {
  const navigation = useNavigation();
  const { location, loading, error, refresh } = useLocation();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [tags, setTags] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [peopleLimit, setPeopleLimit] = useState(2);
  const [timeType, setTimeType] = useState<EventTimeType>("now");
  const [placeName, setPlaceName] = useState("");
  const [genderPreference, setGenderPreference] = useState<GenderPreference>("any");
  const [ageRange, setAgeRange] = useState({ min: 18, max: 99 });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        gender_preference: genderPreference,
        age_range: ageRange,
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

  const nextStep = useCallback(() => {
    if (currentStep < 3) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleCreate();
    }
  }, [currentStep, handleCreate]);

  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    } else {
      navigation.goBack();
    }
  }, [currentStep, navigation]);

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <StepOne
            name={name}
            setName={setName}
            placeName={placeName}
            setPlaceName={setPlaceName}
            loading={loading}
            error={error}
          />
        );
      case 1:
        return (
          <StepTwo
            tags={tags}
            setTags={setTags}
            description={description}
            setDescription={setDescription}
          />
        );
      case 2:
        return (
          <StepThree
            timeType={timeType}
            setTimeType={setTimeType}
          />
        );
      case 3:
        return (
          <StepFour
            peopleLimit={peopleLimit}
            setPeopleLimit={setPeopleLimit}
            genderPreference={genderPreference}
            onGenderPress={() => setGenderPreference(prev => 
              prev === "any" ? "male" :
              prev === "male" ? "female" :
              prev === "female" ? "other" : "any"
            )}
            ageRange={ageRange}
            setAgeRange={setAgeRange}
          />
        );
      default:
        return null;
    }
  };

  const isNextDisabled = () => {
    switch (currentStep) {
      case 0:
        return !name.trim() || loading;
      case 1:
        return tags.length === 0;
      case 3:
        return peopleLimit < 1;
      default:
        return false;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Vytvořit událost</Text>
        <Text style={styles.step}>Krok {currentStep + 1} ze 4</Text>
      </View>

      <ScrollView 
        style={styles.content} 
        contentContainerStyle={styles.scrollContent}
        bounces={false}
      >
        {renderStep()}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.footerButton}
          onPress={prevStep}
        >
          <ChevronLeft size={24} color={colors.surface} />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.footerButton,
            styles.primaryButton,
            (isNextDisabled() || isSubmitting) && styles.buttonDisabled
          ]}
          onPress={nextStep}
          disabled={isNextDisabled() || isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <>
              <Text style={styles.primaryButtonText}>
                {currentStep === 3 ? "Vytvořit" : "Další"}
              </Text>
              {currentStep < 3 && (
                <ChevronRight size={24} color={colors.white} />
              )}
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background
  },
  header: {
    padding: 20,
    paddingBottom: 0
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 8
  },
  step: {
    fontSize: 16,
    color: colors.surface
  },
  content: {
    flex: 1
  },
  scrollContent: {
    padding: 20
  },
  footer: {
    flexDirection: "row",
    padding: 20,
    gap: 12
  },
  footerButton: {
    flex: 1,
    height: 56,
    borderRadius: 16,
    backgroundColor: colors.card,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 8
  },
  primaryButton: {
    flex: 2,
    backgroundColor: colors.primary
  },
  primaryButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600"
  },
  buttonDisabled: {
    opacity: 0.5
  },
});