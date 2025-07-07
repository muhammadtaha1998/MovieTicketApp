import { useQuery } from "@tanstack/react-query";
import { Link } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { colors, radii, spacing, typography } from "../../constants/theme";
import { searchMovies } from "../../utils/api";
import { PLACEHOLDER_IMAGE } from "../../utils/storage";
import { Movie } from "../../utils/types";

const { width } = Dimensions.get("window");

export default function MovieSearchScreen() {
  const [query, setQuery] = useState("");
  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ["search-movies", query],
    queryFn: () => searchMovies(query),
    enabled: !!query,
  });

  const handleSubmit = () => {
    refetch();
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
        padding: spacing.md,
      }}
    >
      <Text style={styles.header}>Search</Text>
      <TextInput
        style={styles.input}
        placeholder="Search movies..."
        placeholderTextColor={colors.placeholder}
        value={query}
        onChangeText={setQuery}
        onSubmitEditing={handleSubmit}
        returnKeyType="search"
      />
      {isLoading || isFetching ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" />
        </View>
      ) : isError ? (
        <View style={styles.center}>
          <Text>Failed to search movies.</Text>
        </View>
      ) : (
        <FlatList
          data={data?.results}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <MovieCard movie={item} />}
          contentContainerStyle={{ paddingTop: 16 }}
          ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
        />
      )}
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
  header: {
    color: colors.text,
    fontFamily: typography.fontFamily,
    fontSize: 28,
    fontWeight: 700,
    marginBottom: spacing.md,
  },
  input: {
    backgroundColor: colors.input,
    color: colors.text,
    borderRadius: radii.md,
    padding: spacing.md,
    fontSize: typography.fontSizeBody,
    fontFamily: typography.fontFamily,
    marginBottom: spacing.md,
  },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#222",
    borderRadius: 12,
    overflow: "hidden",
    padding: 8,
  },
  poster: {
    width: 80,
    height: 120,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: "#444",
  },
  title: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
    flex: 1,
  },
  date: {
    color: "#aaa",
    fontSize: 12,
  },
});
