import java.util.Scanner;

/*
 * Assignment 8: Campus Cafe Ordering System
 * Complete every method marked TODO, then write main.
 * Keep the method headers exactly as given.
 */
public class CampusCafe {

    public static final double TAX_RATE = 0.0775;
    public static final double DISCOUNT_LIMIT = 20.00;

    // Prints the menu. Each item line uses: printf("%d. %-10s $%.2f%n", ...)
    public static void printMenu() {
        // TODO: print the title, the 5 item lines (use a loop and the two methods below),
        //       and "0. Checkout"
    }

    // Returns the name of an item (1-5) using a switch. Returns "" for anything else.
    public static String itemName(int item) {
        // TODO
        return "";
    }

    // Returns the price of an item (1-5) using a switch. Returns 0.0 for anything else.
    public static double itemPrice(int item) {
        // TODO
        return 0.0;
    }

    // Returns true if qty is between 1 and 10 inclusive.
    public static boolean isValidQuantity(int qty) {
        // TODO
        return false;
    }

    // Returns 10% of subtotal if subtotal >= DISCOUNT_LIMIT, otherwise 0.0.
    // Use the conditional operator (? :).
    public static double computeDiscount(double subtotal) {
        // TODO
        return 0.0;
    }

    public static void main(String[] args) {
        Scanner scnr = new Scanner(System.in);
        int[] quantities = new int[6];   // index = item number; index 0 unused

        // TODO: print the menu once

        // TODO: do-while loop that reads orders until the item number is 0
        //       - invalid item number: print "Invalid item: X" (do not read a quantity)
        //       - invalid quantity:    print "Invalid quantity: Q"
        //       - otherwise add to quantities and print "Added Q x Name"

        // TODO: compute the subtotal from the quantities array

        // TODO: print "No items ordered. Goodbye!" if nothing was ordered,
        //       otherwise print the receipt (see the assignment sheet)
    }
}
