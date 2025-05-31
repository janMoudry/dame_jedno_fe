import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { BlurView } from "expo-blur";
import { RouteProp, useRoute } from "@react-navigation/native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { Event } from "../types";
import colors from "../theme/colors";
import { getEventColor, getEventIcon } from "../utils/eventHelpers";

export default function EventDetailScreen() {
  const route = useRoute<RouteProp<{ params: { event: Event } }, "params">>();
  const { event } = route.params;

  return (
    <ScrollView style={styles.container} bounces={false}>
      <View style={styles.mapContainer}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={{
            latitude: event.latitude,
            longitude: event.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
          scrollEnabled={false}
          zoomEnabled={false}
        >
          <Marker
            coordinate={{
              latitude: event.latitude,
              longitude: event.longitude,
            }}
          >
            <View style={[
              styles.marker,
              { backgroundColor: getEventColor(event.type) }
            ]}>
              <Text style={styles.markerText}>
                {getEventIcon(event.type)}
              </Text>
            </View>
          </Marker>
        </MapView>
      </View>

      <BlurView intensity={80} tint="light" style={styles.detailsContainer}>
        <View style={styles.header}>
          <View style={[
            styles.typeIcon,
            { backgroundColor: getEventColor(event.type) }
          ]}>
            <Text style={styles.typeIconText}>
              {getEventIcon(event.type)}
            </Text>
          </View>
          <View style={styles.headerText}>
            <Text style={styles.title}>{event.type}</Text>
            <Text style={styles.subtitle}>
              {event.description || "Bez popisu"}
            </Text>
          </View>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>Kapacita</Text>
          <Text style={styles.infoValue}>
            {event.people_limit} {event.people_limit === 1 ? "osoba" : event.people_limit < 5 ? "osoby" : "osob"}
          </Text>
        </View>
      </BlurView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  mapContainer: {
    height: 300,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  detailsContainer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
    padding: 24,
    minHeight: 400,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  typeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  typeIconText: {
    fontSize: 24,
  },
  headerText: {
    marginLeft: 16,
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: colors.surface,
  },
  infoContainer: {
    backgroundColor: colors.background,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 14,
    color: colors.surface,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: colors.text,
    fontWeight: "500",
  },
  marker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  markerText: {
    fontSize: 20,
  },
});
