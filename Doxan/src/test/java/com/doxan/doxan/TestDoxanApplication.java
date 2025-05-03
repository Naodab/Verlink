package com.doxan.doxan;

import org.springframework.boot.SpringApplication;

public class TestDoxanApplication {

    public static void main(String[] args) {
        SpringApplication.from(DoxanApplication::main).with(TestcontainersConfiguration.class).run(args);
    }

}
