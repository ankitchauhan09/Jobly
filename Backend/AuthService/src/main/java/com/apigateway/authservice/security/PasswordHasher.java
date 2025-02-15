package com.apigateway.authservice.security;

import de.mkammerer.argon2.Argon2;
import de.mkammerer.argon2.Argon2Factory;

public class PasswordHasher {

    private static final int HASH_LENGTH = 32; // 32 bytes
    private static final int MEMORY = 7168; // 7168 KiB
    private static final int PARALLELISM = 1; // 1 thread
    private static final int ITERATIONS = 5; // 5 iterations

    public static String hashPassword(String password) {
        Argon2 argon2 = Argon2Factory.create();
        return argon2.hash(ITERATIONS, MEMORY, PARALLELISM, password);
    }

    public static boolean verifyPassword(String password, String hashedPassword) {
        Argon2 argon2 = Argon2Factory.create();
        return argon2.verify(hashedPassword, password);
    }
}
