import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";
import { colors, radii, spacing, typography } from "../../constants/theme";

const ROWS = 6;
const COLS = 10;
const reservedSeats = [2, 3, 14, 15, 22, 23, 34, 35, 44, 45];
const selectedSeats = [12, 13];

export default function SeatMappingScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Select Your Seat</Text>
      <View style={styles.screen}>
        <Text style={styles.screenText}>SCREEN</Text>
      </View>
      <View style={styles.grid}>
        {Array.from({ length: ROWS * COLS }).map((_, i) => {
          const isReserved = reservedSeats.includes(i);
          const isSelected = selectedSeats.includes(i);
          return (
            <View
              key={i}
              style={[
                styles.seat,
                isReserved && styles.reserved,
                isSelected && styles.selected,
              ]}
            />
          );
        })}
      </View>
      <View style={styles.legendRow}>
        <View style={[styles.seat, styles.selected]} />
        <Text style={styles.legendText}>Selected</Text>
        <View style={[styles.seat, styles.reserved]} />
        <Text style={styles.legendText}>Reserved</Text>
        <View style={styles.seat} />
        <Text style={styles.legendText}>Available</Text>
      </View>
    </ScrollView>
  );
}

const { width } = Dimensions.get("window");
const seatSize = Math.floor((width - 64) / COLS);

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    padding: spacing.md,
    backgroundColor: colors.background,
  },
  title: {
    color: colors.text,
    fontSize: 24,
    fontWeight: 700,
    fontFamily: typography.fontFamily,
    marginBottom: spacing.md,
  },
  screen: {
    width: "90%",
    height: 24,
    backgroundColor: colors.card,
    borderRadius: radii.md,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.lg,
  },
  screenText: {
    color: colors.text,
    fontWeight: 700,
    fontFamily: typography.fontFamily,
    fontSize: 14,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: seatSize * COLS,
    marginBottom: spacing.lg,
  },
  seat: {
    width: seatSize - 6,
    height: seatSize - 6,
    margin: 3,
    borderRadius: radii.sm,
    backgroundColor: colors.primary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  reserved: {
    backgroundColor: colors.error,
  },
  selected: {
    backgroundColor: colors.accent,
  },
  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  legendText: {
    color: colors.text,
    marginRight: spacing.md,
    fontSize: 14,
    fontFamily: typography.fontFamily,
    fontWeight: 500,
  },
});
