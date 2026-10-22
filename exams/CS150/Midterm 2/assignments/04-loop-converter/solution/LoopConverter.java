import java.util.Scanner;

public class LoopConverter {
    public static void main(String[] args) {
        Scanner scnr = new Scanner(System.in);
        int n = scnr.nextInt();

        // Part 1: for loop rewritten as a while loop
        System.out.print("Squares:");
        int i = 1;
        while (i <= n) {
            System.out.print(" " + (i * i));
            i++;
        }
        System.out.println();

        // Part 2: for loop rewritten as a do-while loop
        int sum = 0;
        int k = n;
        if (k > 0) {
            do {
                sum += k;
                k -= 2;
            } while (k > 0);
        }
        System.out.println("Countdown sum: " + sum);

        // Part 3: for loop with continue rewritten as a while loop
        System.out.print("Skip threes:");
        int j = 1;
        while (j <= n) {
            if (j % 3 == 0) {
                j++;
                continue;
            }
            System.out.print(" " + j);
            j++;
        }
        System.out.println();
    }
}
