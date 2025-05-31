import { colors } from "../theme";

export function getEventColor(type: string): string {
  switch (type.toLowerCase()) {
    case "pivo":
      return "#FFA000";
    case "kafe":
      return "#795548";
    case "pokec":
      return "#4285F4";
    case "sport":
      return "#34A853";
    default:
      return colors.primary;
  }
}

export function getEventIcon(type: string): string {
  switch (type.toLowerCase()) {
    case "pivo":
      return "🍺";
    case "kafe":
      return "☕";
    case "pokec":
      return "💬";
    case "sport":
      return "🏃";
    default:
      return "📍";
  }
}