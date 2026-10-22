import java.util.Scanner;

public class PatternPrinter {

    // Pattern 1: row r has r stars
    public static void printRightTriangle(int n) {
        for (int r = 1; r <= n; r++) {
            for (int c = 1; c <= r; c++) {
                System.out.print("*");
            }
            System.out.println();
        }
    }

    // Pattern 2: row r prints 1 up to (n - r + 1)
    public static void printNumberTriangle(int n) {
        for (int r = 1; r <= n; r++) {
            for (int c = 1; c <= n - r + 1; c++) {
                System.out.print(c);
            }
            System.out.println();
        }
    }

    // Pattern 3: n x n multiplication table, each number in a field of width 4
    public static void printTimesTable(int n) {
        for (int r = 1; r <= n; r++) {
            for (int c = 1; c <= n; c++) {
                System.out.printf("%4d", r * c);
            }
            System.out.println();
        }
    }

    // Pattern 4: centered pyramid, row r has (n - r) spaces then (2r - 1) stars
    public static void printPyramid(int n) {
        for (int r = 1; r <= n; r++) {
            for (int s = 1; s <= n - r; s++) {
                System.out.print(" ");
            }
            for (int c = 1; c <= 2 * r - 1; c++) {
                System.out.print("*");
            }
            System.out.println();
        }
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
