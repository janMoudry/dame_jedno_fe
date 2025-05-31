import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { Plus } from "lucide-react-native";
import colors from "../theme/colors";
import { BlurView } from "expo-blur";

type Props = {
  onPress: () => void;
};

export const FloatingButton = ({ onPress }: Props) => {
  return (
    <TouchableOpacity style={styles.buttonWrapper} onPress={onPress}>
      <BlurView intensity={80} tint="light" style={styles.button}>
        <Plus size={24} color={colors.primary} strokeWidth={2.5} />
      </BlurView>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonWrapper: {
    position: "absolute",
    right: 16,
    bottom: 30,
    shadowColor: "transparent"
  },
  button: {
    backgroundColor: colors.card,
    borderRadius: 30,
    width: 56,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    
    shadowRadius: 30,
  },
});
