import java.util.Scanner;

/*
 * Assignment 9: Exam Score Report
 * Complete every method marked TODO, then write main.
 * Keep the method headers exactly as given.
 */
public class ExamScoreReport {

    // Reads one score. If it is not 0-100, prints "Invalid score: X, enter again"
    // and reads again. Use a do-while loop. Returns the first valid score.
    public static int readScore(Scanner scnr) {
        // TODO
        return 0;
    }

    // Returns the average of the scores
    public static double average(int[] scores) {
        // TODO
        return 0.0;
    }

    // Returns the highest score
    public static int highest(int[] scores) {
        // TODO
        return 0;
    }

    // Returns the lowest score
    public static int lowest(int[] scores) {
        // TODO
        return 0;
    }

    // Returns how many scores are strictly greater than limit
    public static int countAbove(int[] scores, double limit) {
        // TODO
        return 0;
    }

    // Returns 'A' (90+), 'B' (80-89), 'C' (70-79), 'D' (60-69) or 'F' (below 60)
    public static char letterGrade(int score) {
        // TODO: use an if / else-if / else chain
        return 'F';
    }

    // Returns an array of 5 counts: [0] = A, [1] = B, [2] = C, [3] = D, [4] = F
    // Use letterGrade and a switch statement.
    public static int[] gradeCounts(int[] scores) {
        // TODO
        return new int[5];
    }

    // Prints one line per grade, for example:  B (3): * * *
    // Use nested loops. A grade with count 0 prints just "D (0):"
    public static void printHistogram(int[] counts) {
        char[] letters = {'A', 'B', 'C', 'D', 'F'};
        // TODO
    }

    public static void main(String[] args) {
        Scanner scnr = new Scanner(System.in);

        // TODO: read n; if it is not 1-50 print "Number of students must be 1-50" and stop

        // TODO: create the array and fill it with readScore

        // TODO: print the report (see the assignment sheet)
    }
}
