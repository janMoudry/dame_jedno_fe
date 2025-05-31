import React, { useEffect, useState } from "react";
import { View, StyleSheet, ActivityIndicator, Alert, Text } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { BlurView } from "expo-blur";
import axios from "axios";
import useLocation from "../hooks/useLocation";
import { Event } from "../types";
import { FloatingButton } from "../components/FloatingButton";
import { useNavigation } from "@react-navigation/native";
import colors from "../theme/colors";

const MAP_STYLE = [
  {
    elementType: "geometry",
    stylers: [{ color: "#242f3e" }],
  },
  {
    elementType: "labels.text.fill",
    stylers: [{ color: "#746855" }],
  },
  {
    elementType: "labels.text.stroke",
    stylers: [{ color: "#242f3e" }],
  },
  {
    featureType: "poi",
    elementType: "labels",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "transit",
    elementType: "labels",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#17263c" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#515c6d" }],
  },
];

export default function MapScreen() {
  const navigation = useNavigation();
  const { location } = useLocation();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    if (!location) return;

    try {
      const res = await axios.get("http://10.0.1.41:3001/api/events", {
        params: {
          lat: location.latitude,
          lng: location.longitude,
        },
      });

      setEvents(res.data);
    } catch (error) {
      console.log("Chyba při načítání událostí:", error);
      Alert.alert("Chyba při načítání událostí");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (location) fetchEvents();
  }, [location]);

  if (!location) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={StyleSheet.absoluteFillObject}
        showsUserLocation={true}
        showsMyLocationButton={true}
        showsCompass={true}
        showsScale={true}
        customMapStyle={MAP_STYLE}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        {events.map((event) => (
          <Marker 
            key={event.id} 
            coordinate={{ 
              latitude: event.latitude, 
              longitude: event.longitude 
            }} 
            onPress={() => navigation.navigate("EventDetail" as never, { event } as never)}
          >
            <BlurView intensity={80} tint="light" style={styles.markerContainer}>
              <View style={[
                styles.markerContent,
                { backgroundColor: getEventColor(event.type) }
              ]}>
                <Text style={styles.markerText}>
                  {getEventIcon(event.type)}
                </Text>
              </View>
              <View style={styles.markerInfo}>
                <Text style={styles.markerTitle}>
                  {event.type}
                </Text>
                <Text style={styles.markerSubtitle} numberOfLines={1}>
                  {event.description || "Bez popisu"}
                </Text>
              </View>
            </BlurView>
          </Marker>
        ))}
      </MapView>

      <FloatingButton onPress={() => navigation.navigate("Create" as never)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  markerContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 16,
    maxWidth: 200,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  markerContent: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  markerText: {
    fontSize: 18,
    color: colors.text,
  },
  markerInfo: {
    marginLeft: 8,
    flex: 1,
  },
  markerTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
  },
  markerSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});
