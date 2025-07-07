import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { WebView } from "react-native-webview";
import { colors, radii, spacing, typography } from "../../../constants/theme";
import { fetchMovieVideos } from "../../../utils/api";
import { MovieVideosResponse } from "../../../utils/types";

export default function TrailerScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data, isLoading } = useQuery<MovieVideosResponse>({
    queryKey: ["movie-videos", id],
    queryFn: () => fetchMovieVideos(id!),
    enabled: !!id,
  });

  const trailer = data?.results?.find(
    (v) => v.site === "YouTube" && v.type === "Trailer"
  );
  const videoUrl = trailer
    ? `https://www.youtube.com/embed/${trailer.key}?autoplay=1`
    : null;

  // For YouTube, use a WebView fallback if expo-video can't play YouTube links directly
  // Here, we use WebView for YouTube trailers
  if (isLoading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  if (!videoUrl)
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>No trailer found.</Text>
      </View>
    );

  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: videoUrl }}
        style={styles.video}
        allowsFullscreenVideo
        javaScriptEnabled
        domStorageEnabled
        startInLoadingState
        onNavigationStateChange={(navState) => {
          // If the video ends or user closes, go back
          if (
            navState.url.includes("youtube.com") &&
            navState.title === "YouTube"
          ) {
            // Could add logic to auto-close
          }
        }}
      />
      <TouchableOpacity style={styles.doneBtn} onPress={() => router.back()}>
        <Text style={styles.doneText}>Done</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  video: { width: "100%", height: "100%", backgroundColor: colors.background },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  doneBtn: {
    position: "absolute",
    top: spacing.lg,
    right: spacing.lg,
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.lg,
    zIndex: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  doneText: {
    color: colors.text,
    fontFamily: typography.fontFamily,
    fontWeight: 700,
    fontSize: 16,
  },
  errorText: {
    color: colors.error,
    fontFamily: typography.fontFamily,
    fontWeight: 700,
    fontSize: 18,
  },
});
