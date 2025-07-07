import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { colors, radii, spacing, typography } from "../../../constants/theme";
import {
  fetchMovieDetails,
  fetchMovieImages,
  fetchMovieVideos,
} from "../../../utils/api";
import { PLACEHOLDER_IMAGE } from "../../../utils/storage";
import {
  MovieDetails,
  MovieImagesResponse,
  MovieVideosResponse,
} from "../../../utils/types";

const { width } = Dimensions.get("window");

export default function MovieDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const { data: details, isLoading: loadingDetails } = useQuery<MovieDetails>({
    queryKey: ["movie-details", id],
    queryFn: () => fetchMovieDetails(id!),
    enabled: !!id,
  });
  const { data: images, isLoading: loadingImages } =
    useQuery<MovieImagesResponse>({
      queryKey: ["movie-images", id],
      queryFn: () => fetchMovieImages(id!),
      enabled: !!id,
    });
  const { data: videos, isLoading: loadingVideos } =
    useQuery<MovieVideosResponse>({
      queryKey: ["movie-videos", id],
      queryFn: () => fetchMovieVideos(id!),
      enabled: !!id,
    });

  if (loadingDetails || loadingImages || loadingVideos)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  if (!details)
    return (
      <View style={styles.center}>
        <Text>Movie not found.</Text>
      </View>
    );

  const trailer = videos?.results?.find(
    (v) => v.site === "YouTube" && v.type === "Trailer"
  );
  const backdrop = details.backdrop_path
    ? { uri: `https://image.tmdb.org/t/p/w780${details.backdrop_path}` }
    : PLACEHOLDER_IMAGE;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ padding: spacing.md }}
    >
      <Image source={backdrop} style={styles.backdrop} resizeMode="cover" />
      <Text style={styles.title}>{details.title}</Text>
      <Text style={styles.tagline}>{details.tagline}</Text>
      <Text style={styles.overview}>{details.overview}</Text>
      <Text style={styles.info}>
        Release: {details.release_date} | Runtime: {details.runtime} min
      </Text>
      <Text style={styles.info}>
        Genres: {details.genres.map((g) => g.name).join(", ")}
      </Text>
      {trailer && (
        <TouchableOpacity
          style={styles.trailerBtn}
          onPress={() =>
            router.push({ pathname: "/movie/id/trailer", params: { id: id! } })
          }
        >
          <Text style={styles.trailerBtnText}>Watch Trailer</Text>
        </TouchableOpacity>
      )}
      <Text style={styles.section}>Images</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginBottom: spacing.md }}
      >
        {images?.backdrops?.slice(0, 10).map((img) => (
          <Image
            key={img.file_path}
            source={{ uri: `https://image.tmdb.org/t/p/w300${img.file_path}` }}
            style={styles.image}
            resizeMode="cover"
          />
        ))}
      </ScrollView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  backdrop: {
    width: "100%",
    aspectRatio: 16 / 9,
    borderRadius: radii.md,
    marginBottom: spacing.md,
    backgroundColor: colors.placeholder,
  },
  title: {
    color: colors.text,
    fontFamily: typography.fontFamily,
    fontWeight: 700,
    fontSize: 24,
    marginBottom: 2,
  },
  tagline: {
    color: colors.primary,
    fontFamily: typography.fontFamily,
    fontWeight: 500,
    fontSize: 16,
    fontStyle: "italic",
    marginBottom: spacing.sm,
  },
  overview: {
    color: colors.text,
    fontFamily: typography.fontFamily,
    fontWeight: 400,
    fontSize: 16,
    marginBottom: spacing.sm,
  },
  info: {
    color: colors.subtitle,
    fontFamily: typography.fontFamily,
    fontWeight: 400,
    fontSize: 14,
    marginBottom: 2,
  },
  trailerBtn: {
    backgroundColor: colors.primary,
    borderRadius: radii.md,
    padding: spacing.md,
    alignItems: "center",
    marginVertical: spacing.md,
  },
  trailerBtnText: {
    color: colors.text,
    fontFamily: typography.fontFamily,
    fontWeight: 700,
    fontSize: 16,
  },
  section: {
    color: colors.text,
    fontFamily: typography.fontFamily,
    fontWeight: 700,
    fontSize: 18,
    marginVertical: spacing.sm,
  },
  image: {
    width: 120,
    height: 70,
    borderRadius: radii.sm,
    marginRight: spacing.sm,
    backgroundColor: colors.placeholder,
  },
});
