import java.util.Scanner;

/*
 * Assignment 6: Pattern Printer
 * main is complete. Complete the four methods using nested for loops.
 * Do not change the method headers or main.
 */
public class PatternPrinter {

    // Pattern 1: row r has r stars
    public static void printRightTriangle(int n) {
        // TODO
    }

    // Pattern 2: row r prints the digits 1 up to (n - r + 1), no spaces
    public static void printNumberTriangle(int n) {
        // TODO
    }

    // Pattern 3: n x n multiplication table, each number printed with %4d
    public static void printTimesTable(int n) {
        // TODO
    }

    // Pattern 4: centered pyramid: row r has (n - r) spaces, then (2r - 1) stars
    // Do not print spaces after the stars.
    public static void printPyramid(int n) {
        // TODO
    }

    public static void main(String[] args) {
        Scanner scnr = new Scanner(System.in);
        int n = scnr.nextInt();

        if (n < 1 || n > 9) {
            System.out.println("Size must be between 1 and 9");
            return;
        }

        printRightTriangle(n);
        System.out.println();
        printNumberTriangle(n);
        System.out.println();
        printTimesTable(n);
        System.out.println();
        printPyramid(n);
    }
}
