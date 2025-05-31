import React from "react";
import { TouchableOpacity, StyleSheet, View } from "react-native";
import { Plus } from "lucide-react-native";
import colors from "../theme/colors";

type Props = {
  onPress: () => void;
};

export const FloatingButton = ({ onPress }: Props) => {
  return (
    <TouchableOpacity style={styles.buttonWrapper} onPress={onPress}>
      <View style={styles.button}>
        <Plus size={28} color={colors.white} strokeWidth={2.5} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonWrapper: {
    position: "absolute",
    right: 16,
    bottom: 30,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 30,
    width: 56,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
  },
});
