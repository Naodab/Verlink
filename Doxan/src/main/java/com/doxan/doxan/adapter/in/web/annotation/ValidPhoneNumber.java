package com.doxan.doxan.adapter.in.web.annotation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = PhoneNumberValidator.class)
@Target({ElementType.METHOD, ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidPhoneNumber {
    String message() default "INVALID_PHONE_NUMBER";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
