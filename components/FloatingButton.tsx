import React from "react";
import { TouchableOpacity, StyleSheet, Platform } from "react-native";
import { Plus } from "lucide-react-native";
import colors from "../theme/colors";
import { BlurView } from "expo-blur";

type Props = {
  onPress: () => void;
};

export const FloatingButton = ({ onPress }: Props) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.buttonWrapper}
      onPress={onPress}
    >
      <BlurView intensity={60} tint="light" style={styles.blur}>
        <Plus size={26} color={colors.primary} strokeWidth={2.5} />
      </BlurView>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonWrapper: {
    position: "absolute",
    right: 20,
    bottom: 30,
    zIndex: 10,
    backgroundColor: "transparent",
    borderRadius: 32
  },
  
});
