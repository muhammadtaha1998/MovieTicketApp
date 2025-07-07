import { useQuery } from "@tanstack/react-query";
import { Link } from "expo-router";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { colors, radii, spacing, typography } from "../../constants/theme";
import { fetchUpcomingMovies } from "../../utils/api";
import { PLACEHOLDER_IMAGE } from "../../utils/storage";
import { Movie } from "../../utils/types";

const { width } = Dimensions.get("window");

export default function MovieListScreen() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["upcoming-movies"],
    queryFn: () => fetchUpcomingMovies(),
  });

  if (isLoading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  if (isError)
    return (
      <View style={styles.center}>
        <Text>Failed to load movies.</Text>
      </View>
    );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Text style={styles.header}>Watch</Text>
      <Text style={styles.subheader}>Movies</Text>
      <FlatList
        data={data?.results}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: spacing.md }}
        renderItem={({ item }) => <MovieCard movie={item} />}
        numColumns={2}
        columnWrapperStyle={{ gap: spacing.md }}
        ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

function MovieCard({ movie }: { movie: Movie }) {
  return (
    <Link
      href={{ pathname: "/movie/id", params: { id: movie.id.toString() } }}
      asChild
    >
      <TouchableOpacity style={styles.card}>
        <Image
          source={
            movie.poster_path
              ? { uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}` }
              : PLACEHOLDER_IMAGE
          }
          style={styles.poster}
          resizeMode="cover"
        />
        <Text style={styles.title} numberOfLines={2}>
          {movie.title}
        </Text>
        <Text style={styles.date}>{movie.release_date}</Text>
      </TouchableOpacity>
    </Link>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    color: colors.text,
    fontFamily: typography.fontFamily,
    fontSize: 32,
    fontWeight: 700,
    marginTop: spacing.lg,
    marginLeft: spacing.md,
    marginBottom: 0,
  },
  subheader: {
    color: colors.primary,
    fontFamily: typography.fontFamily,
    fontSize: 32,
    fontWeight: 700,
    marginLeft: spacing.md,
    marginBottom: spacing.md,
  },
  card: {
    flex: 1,
    margin: 4,
    backgroundColor: colors.card,
    borderRadius: radii.md,
    overflow: "hidden",
    alignItems: "center",
    padding: spacing.sm,
    minWidth: width / 2 - 32,
    maxWidth: width / 2 - 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  poster: {
    width: "100%",
    aspectRatio: 2 / 3,
    borderRadius: radii.sm,
    marginBottom: spacing.sm,
    backgroundColor: colors.placeholder,
  },
  title: {
    color: colors.text,
    fontFamily: typography.fontFamily,
    fontWeight: 700,
    fontSize: typography.fontSizeBody,
    marginBottom: 2,
    textAlign: "center",
  },
  date: {
    color: colors.subtitle,
    fontFamily: typography.fontFamily,
    fontSize: typography.fontSizeSmall,
    textAlign: "center",
  },
});
