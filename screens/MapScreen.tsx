import React, { useEffect, useState } from "react";
import { View, StyleSheet, ActivityIndicator, Alert } from "react-native";
import MapView, { Marker } from "react-native-maps";
import axios from "axios";
import useLocation from "../hooks/useLocation";
import { Event } from "../types";
import { FloatingButton } from "../components/FloatingButton";
import { useNavigation } from "@react-navigation/native";
import colors from "../theme/colors";

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
        style={StyleSheet.absoluteFillObject}
        showsUserLocation={true}
        showsMyLocationButton={true}
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
              longitude: event.longitude,
            }}
            title={event.type}
            description={event.description}
            onPress={() => {
              navigation.navigate("EventDetail" as never, { event } as never);
            }}
          />
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
});
