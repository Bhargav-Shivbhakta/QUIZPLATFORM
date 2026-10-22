import java.util.Scanner;

public class ExamScoreReport {

    public static int readScore(Scanner scnr) {
        int score;
        do {
            score = scnr.nextInt();
            if (score < 0 || score > 100) {
                System.out.println("Invalid score: " + score + ", enter again");
            }
        } while (score < 0 || score > 100);
        return score;
    }

    public static double average(int[] scores) {
        int sum = 0;
        for (int i = 0; i < scores.length; i++) {
            sum += scores[i];
        }
        return (double) sum / scores.length;
    }

    public static int highest(int[] scores) {
        int max = scores[0];
        for (int i = 1; i < scores.length; i++) {
            if (scores[i] > max) {
                max = scores[i];
            }
        }
        return max;
    }

    public static int lowest(int[] scores) {
        int min = scores[0];
        for (int i = 1; i < scores.length; i++) {
            if (scores[i] < min) {
                min = scores[i];
            }
        }
        return min;
    }

    public static int countAbove(int[] scores, double limit) {
        int count = 0;
        for (int i = 0; i < scores.length; i++) {
            if (scores[i] > limit) {
                count++;
            }
        }
        return count;
    }

    public static char letterGrade(int score) {
        if (score >= 90) {
            return 'A';
        } else if (score >= 80) {
            return 'B';
        } else if (score >= 70) {
            return 'C';
        } else if (score >= 60) {
            return 'D';
        } else {
            return 'F';
        }
    }

    // counts[0] = A, counts[1] = B, counts[2] = C, counts[3] = D, counts[4] = F
    public static int[] gradeCounts(int[] scores) {
        int[] counts = new int[5];
        for (int i = 0; i < scores.length; i++) {
            switch (letterGrade(scores[i])) {
                case 'A': counts[0]++; break;
                case 'B': counts[1]++; break;
                case 'C': counts[2]++; break;
                case 'D': counts[3]++; break;
                default:  counts[4]++; break;
            }
        }
        return counts;
    }

    public static void printHistogram(int[] counts) {
        char[] letters = {'A', 'B', 'C', 'D', 'F'};
        for (int g = 0; g < counts.length; g++) {
            System.out.print(letters[g] + " (" + counts[g] + "):");
            for (int s = 0; s < counts[g]; s++) {
                System.out.print(" *");
            }
            System.out.println();
        }
    }

    public static void main(String[] args) {
        Scanner scnr = new Scanner(System.in);
        int n = scnr.nextInt();

        if (n < 1 || n > 50) {
            System.out.println("Number of students must be 1-50");
            return;
        }

        int[] scores = new int[n];
        for (int i = 0; i < n; i++) {
            scores[i] = readScore(scnr);
        }

        System.out.print("Scores:");
        for (int i = 0; i < scores.length; i++) {
            System.out.print(" " + scores[i]);
        }
        System.out.println();

        double avg = average(scores);
        System.out.printf("Average: %.2f%n", avg);
        System.out.println("Highest: " + highest(scores));
        System.out.println("Lowest: " + lowest(scores));
        System.out.println("Above average: " + countAbove(scores, avg));
        System.out.println("Grade distribution:");
        printHistogram(gradeCounts(scores));
    }
}
