import java.util.Scanner;

/*
 * Assignment 7: Temperature Tracker
 * main is complete. Complete the five methods marked TODO.
 * Each method receives the array of 7 daily high temperatures.
 * Do not change the method headers or main.
 */
public class TemperatureTracker {

    public static final String[] DAYS = {"Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"};

    // Returns the average of all temperatures
    public static double average(int[] temps) {
        // TODO
        return 0.0;
    }

    // Returns the INDEX of the highest temperature (first one if tied)
    public static int maxIndex(int[] temps) {
        // TODO
        return 0;
    }

    // Returns the INDEX of the lowest temperature (first one if tied)
    public static int minIndex(int[] temps) {
        // TODO
        return 0;
    }

    // Returns how many temperatures are strictly greater than limit
    public static int countAbove(int[] temps, double limit) {
        // TODO
        return 0;
    }

    // Returns how many days were warmer than the day before (Tue vs Mon, ..., Sun vs Sat)
    public static int countWarmerThanDayBefore(int[] temps) {
        // TODO
        return 0;
    }

    public static void main(String[] args) {
        Scanner scnr = new Scanner(System.in);
        int[] temps = new int[7];

        for (int i = 0; i < temps.length; i++) {
            temps[i] = scnr.nextInt();
        }

        for (int i = 0; i < temps.length; i++) {
            System.out.println(DAYS[i] + ": " + temps[i]);
        }

        double avg = average(temps);
        int hot = maxIndex(temps);
        int cold = minIndex(temps);

        System.out.printf("Average: %.1f%n", avg);
        System.out.println("Hottest: " + DAYS[hot] + " (" + temps[hot] + ")");
        System.out.println("Coldest: " + DAYS[cold] + " (" + temps[cold] + ")");
        System.out.println("Days above average: " + countAbove(temps, avg));
        System.out.println("Days warmer than the day before: " + countWarmerThanDayBefore(temps));
    }
}
