import java.util.Scanner;

/*
 * Assignment 4: Loop Converter
 * This program works, but it uses three for loops.
 * Rewrite it so that:
 *   Part 1 uses a while loop
 *   Part 2 uses a do-while loop
 *   Part 3 uses a while loop
 * The output must stay EXACTLY the same for every input, including n = 0
 * and negative n. Your final program must not contain the keyword "for".
 */
public class LoopConverter {
    public static void main(String[] args) {
        Scanner scnr = new Scanner(System.in);
        int n = scnr.nextInt();

        // Part 1: convert to a while loop
        System.out.print("Squares:");
        for (int i = 1; i <= n; i++) {
            System.out.print(" " + (i * i));
        }
        System.out.println();

        // Part 2: convert to a do-while loop
        int sum = 0;
        for (int k = n; k > 0; k -= 2) {
            sum += k;
        }
        System.out.println("Countdown sum: " + sum);

        // Part 3: convert to a while loop
        System.out.print("Skip threes:");
        for (int j = 1; j <= n; j++) {
            if (j % 3 == 0) {
                continue;
            }
            System.out.print(" " + j);
        }
        System.out.println();
    }
}
