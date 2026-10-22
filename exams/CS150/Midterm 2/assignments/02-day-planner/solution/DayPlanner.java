import java.util.Scanner;

public class DayPlanner {
    public static void main(String[] args) {
        Scanner scnr = new Scanner(System.in);
        int day = scnr.nextInt();

        if (day < 1 || day > 7) {
            System.out.println("Invalid day");
            return;
        }

        String name;
        switch (day) {
            case 1:  name = "Monday";    break;
            case 2:  name = "Tuesday";   break;
            case 3:  name = "Wednesday"; break;
            case 4:  name = "Thursday";  break;
            case 5:  name = "Friday";    break;
            case 6:  name = "Saturday";  break;
            default: name = "Sunday";    break;
        }
        System.out.println(name);

        switch (day) {
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
                System.out.println("Weekday");
                break;
            default:
                System.out.println("Weekend");
        }

        switch (day) {
            case 1:
            case 3:
                System.out.println("CS 150 lecture at 2:00 PM");
                break;
            case 2:
            case 4:
                System.out.println("CS 150L lab at 10:00 AM");
                break;
            case 5:
                System.out.println("Office hours at 12:30 PM");
                break;
            default:
                System.out.println("No classes");
        }
    }
}
