import java.util.Scanner;

public class MovieTicket {
    public static void main(String[] args) {
        Scanner scnr = new Scanner(System.in);
        int age = scnr.nextInt();
        String day = scnr.next();
        int hour = scnr.nextInt();
        char student = scnr.next().charAt(0);

        if (age < 0 || age > 120) {
            System.out.println("Invalid age");
            return;
        }
        if (hour < 0 || hour > 23) {
            System.out.println("Invalid hour");
            return;
        }

        double price;
        if (age < 13) {
            price = 8.00;
        } else if (age >= 65) {
            price = 9.00;
        } else {
            price = 14.00;
        }

        boolean matinee = hour < 17;
        if (matinee) {
            price -= 2.00;
        }
        if (day.equals("Tue")) {
            price -= 1.50;
        }
        if ((student == 'y' || student == 'Y') && age >= 13 && age <= 25) {
            price *= 0.90;
        }
        if (price < 5.00) {
            price = 5.00;
        }

        String showType = matinee ? "Matinee" : "Evening";
        System.out.println("Show type: " + showType);
        System.out.printf("Ticket price: $%.2f%n", price);
    }
}
