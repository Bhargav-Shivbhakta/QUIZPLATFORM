import java.util.Scanner;

public class TemperatureTracker {

    public static final String[] DAYS = {"Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"};

    public static double average(int[] temps) {
        int sum = 0;
        for (int i = 0; i < temps.length; i++) {
            sum += temps[i];
        }
        return (double) sum / temps.length;
    }

    public static int maxIndex(int[] temps) {
        int best = 0;
        for (int i = 1; i < temps.length; i++) {
            if (temps[i] > temps[best]) {
                best = i;
            }
        }
        return best;
    }

    public static int minIndex(int[] temps) {
        int best = 0;
        for (int i = 1; i < temps.length; i++) {
            if (temps[i] < temps[best]) {
                best = i;
            }
        }
        return best;
    }

    public static int countAbove(int[] temps, double limit) {
        int count = 0;
        for (int i = 0; i < temps.length; i++) {
            if (temps[i] > limit) {
                count++;
            }
        }
        return count;
    }

    public static int countWarmerThanDayBefore(int[] temps) {
        int count = 0;
        for (int i = 1; i < temps.length; i++) {
            if (temps[i] > temps[i - 1]) {
                count++;
            }
        }
        return count;
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
