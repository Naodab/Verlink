package com.doxan.doxan.adapter.in.web.annotation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.time.LocalDate;

public class DateOfBirthValidator implements ConstraintValidator<ValidDateOfBirth, LocalDate> {
    private int min;

    @Override
    public void initialize(ValidDateOfBirth constraintAnnotation) {
        this.min = constraintAnnotation.min();
    }

    @Override
    public boolean isValid(LocalDate dateOfBirth,
                           ConstraintValidatorContext constraintValidatorContext) {
        if (dateOfBirth == null) return false;
        LocalDate now = LocalDate.now();
        LocalDate threshold = now.minusYears(min);
        return dateOfBirth.isBefore(threshold) || dateOfBirth.isEqual(threshold);
    }
}
