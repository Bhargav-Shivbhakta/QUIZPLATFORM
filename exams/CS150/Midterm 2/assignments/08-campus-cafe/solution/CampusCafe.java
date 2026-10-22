import java.util.Scanner;

public class CampusCafe {

    public static final double TAX_RATE = 0.0775;
    public static final double DISCOUNT_LIMIT = 20.00;

    public static void printMenu() {
        System.out.println("=== Campus Cafe ===");
        for (int item = 1; item <= 5; item++) {
            System.out.printf("%d. %-10s $%.2f%n", item, itemName(item), itemPrice(item));
        }
        System.out.println("0. Checkout");
    }

    public static String itemName(int item) {
        switch (item) {
            case 1:  return "Coffee";
            case 2:  return "Latte";
            case 3:  return "Bagel";
            case 4:  return "Muffin";
            case 5:  return "Sandwich";
            default: return "";
        }
    }

    public static double itemPrice(int item) {
        switch (item) {
            case 1:  return 2.50;
            case 2:  return 4.50;
            case 3:  return 3.25;
            case 4:  return 2.75;
            case 5:  return 7.95;
            default: return 0.0;
        }
    }

    public static boolean isValidQuantity(int qty) {
        return qty >= 1 && qty <= 10;
    }

    public static double computeDiscount(double subtotal) {
        return (subtotal >= DISCOUNT_LIMIT) ? subtotal * 0.10 : 0.0;
    }

    public static void main(String[] args) {
        Scanner scnr = new Scanner(System.in);
        int[] quantities = new int[6];   // index = item number; index 0 unused
        int choice;

        printMenu();

        do {
            choice = scnr.nextInt();
            if (choice == 0) {
                break;
            }
            if (choice < 0 || choice > 5) {
                System.out.println("Invalid item: " + choice);
                continue;
            }
            int qty = scnr.nextInt();
            if (!isValidQuantity(qty)) {
                System.out.println("Invalid quantity: " + qty);
                continue;
            }
            quantities[choice] += qty;
            System.out.println("Added " + qty + " x " + itemName(choice));
        } while (choice != 0);

        double subtotal = 0.0;
        for (int item = 1; item <= 5; item++) {
            subtotal += quantities[item] * itemPrice(item);
        }

        if (subtotal == 0.0) {
            System.out.println("No items ordered. Goodbye!");
            return;
        }

        System.out.println("--- Receipt ---");
        for (int item = 1; item <= 5; item++) {
            if (quantities[item] > 0) {
                System.out.printf("%s x %d: $%.2f%n", itemName(item), quantities[item],
                                  quantities[item] * itemPrice(item));
            }
        }
        double discount = computeDiscount(subtotal);
        double tax = (subtotal - discount) * TAX_RATE;
        double total = subtotal - discount + tax;

        System.out.printf("Subtotal: $%.2f%n", subtotal);
        System.out.printf("Discount: $%.2f%n", discount);
        System.out.printf("Tax: $%.2f%n", tax);
        System.out.printf("Total: $%.2f%n", total);
    }
}
