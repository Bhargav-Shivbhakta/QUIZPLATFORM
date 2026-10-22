import java.util.Scanner;

public class NumberAnalyzer {
    public static void main(String[] args) {
        Scanner scnr = new Scanner(System.in);

        int count = 0;
        int sum = 0;
        int min = 0;
        int max = 0;
        int evenCount = 0;
        int skipped = 0;

        int value = scnr.nextInt();
        while (value != 0) {
            if (value > 1000) {
                System.out.println("Value too large: " + value);
                break;
            }
            if (value < 0) {
                skipped++;
                value = scnr.nextInt();
                continue;
            }

            count++;
            sum += value;
            if (count == 1 || value < min) {
                min = value;
            }
            if (count == 1 || value > max) {
                max = value;
            }
            if (value % 2 == 0) {
                evenCount++;
            }

            value = scnr.nextInt();
        }

        if (count == 0) {
            System.out.println("No numbers entered");
        } else {
            System.out.println("Count: " + count);
            System.out.println("Sum: " + sum);
            System.out.println("Minimum: " + min);
            System.out.println("Maximum: " + max);
            System.out.printf("Average: %.2f%n", (double) sum / count);
            System.out.println("Even numbers: " + evenCount);
        }
        System.out.println("Skipped negatives: " + skipped);
    }
}
