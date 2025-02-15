package com.mentorship.utils;

public class EMAIL_TEMPLATE {
    public static String getSessionJoinDetailTemplate(String username, Integer password) {
        return
                "<!DOCTYPE html>\n" +
                        "<html lang=\"en\">\n" +
                        "<head>\n" +
                        "    <meta charset=\"UTF-8\">\n" +
                        "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n" +
                        "    <title>Mentor Session Reminder</title>\n" +
                        "    <style>\n" +
                        "        body {\n" +
                        "            font-family: Arial, sans-serif;\n" +
                        "            margin: 0;\n" +
                        "            padding: 0;\n" +
                        "            background-color: #f4f4f4;\n" +
                        "            color: #333;\n" +
                        "        }\n" +
                        "        .container {\n" +
                        "            max-width: 600px;\n" +
                        "            margin: 20px auto;\n" +
                        "            background: #fff;\n" +
                        "            padding: 20px;\n" +
                        "            border-radius: 8px;\n" +
                        "            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);\n" +
                        "        }\n" +
                        "        .header {\n" +
                        "            background-color: #0073e6;\n" +
                        "            color: #fff;\n" +
                        "            padding: 10px;\n" +
                        "            text-align: center;\n" +
                        "            border-radius: 8px 8px 0 0;\n" +
                        "        }\n" +
                        "        .content {\n" +
                        "            padding: 20px;\n" +
                        "        }\n" +
                        "        .content h2 {\n" +
                        "            color: #0073e6;\n" +
                        "        }\n" +
                        "        .credentials {\n" +
                        "            margin: 20px 0;\n" +
                        "            padding: 10px;\n" +
                        "            background-color: #f9f9f9;\n" +
                        "            border: 1px solid #ddd;\n" +
                        "            border-radius: 4px;\n" +
                        "        }\n" +
                        "        .footer {\n" +
                        "            text-align: center;\n" +
                        "            padding: 10px;\n" +
                        "            font-size: 0.9em;\n" +
                        "            color: #666;\n" +
                        "        }\n" +
                        "    </style>\n" +
                        "</head>\n" +
                        "<body>\n" +
                        "    <div class=\"container\">\n" +
                        "        <div class=\"header\">\n" +
                        "            <h1>Mentor Session Reminder</h1>\n" +
                        "        </div>\n" +
                        "        <div class=\"content\">\n" +
                        "            <h2>Hello,</h2>\n" +
                        "            <p>This is a friendly reminder that your session with the mentor is scheduled to start in one hour.</p>\n" +
                        "            <p>Please use the following credentials to join the session:</p>\n" +
                        "            <div class=\"credentials\">\n" +
                        "                <p><strong>Username:</strong> "+username+"</p>\n" +
                        "                <p><strong>Password:</strong> "+password+"</p>\n" +
                        "            </div>\n" +
                        "            <p>We look forward to seeing you there!</p>\n" +
                        "        </div>\n" +
                        "        <div class=\"footer\">\n" +
                        "            <p>&copy; 2024 Mentor Platform. All rights reserved.</p>\n" +
                        "        </div>\n" +
                        "    </div>\n" +
                        "</body>\n" +
                        "</html>\n";
    }
}
