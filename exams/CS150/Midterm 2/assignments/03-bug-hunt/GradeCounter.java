import java.util.Scanner;

/*
 * Assignment 3: Bug Hunt
 * This program is supposed to read n, then n exam scores (0-100), and print
 * how many A/B/C/D/F grades there are, the average, and the highest score.
 *
 * It contains SIX bugs: 2 compile errors and 4 logic errors.
 * Fix each bug and add a comment on that line: // FIX: what was wrong
 * Do not rewrite the program from scratch.
 */
public class GradeCounter {
    public static void main(String[] args) {
        Scanner scnr = new Scanner(System.in);
        int n = scnr.nextInt()

        int aCount = 0, bCount = 0, cCount = 0, dCount = 0, fCount = 0;
        int highest = 0;

        for (int i = 0; i <= n; i++) {
            int sum = 0;
            int score = scnr.nextInt();
            sum += score;

            if (score >= 90) {
                aCount++;
            } else if (score > 80) {
                bCount++;
            } else if (score >= 70) {
                cCount++;
            } else if (score >= 60) {
                dCount++;
            } else {
                fCount++;
            }

            if (score > highest);
                highest = score;
        }

        double average = sum / n;

        System.out.println("A: " + aCount);
        System.out.println("B: " + bCount);
        System.out.println("C: " + cCount);
        System.out.println("D: " + dCount);
        System.out.println("F: " + fCount);
        System.out.printf("Average: %.2f%n", average);
        System.out.println("Highest: " + highest);
    }
}
