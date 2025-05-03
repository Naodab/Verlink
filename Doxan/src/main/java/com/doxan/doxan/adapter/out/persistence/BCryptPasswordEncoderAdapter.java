package com.doxan.doxan.adapter.out.persistence;

import com.doxan.doxan.domain.port.security.PasswordEncoder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class BCryptPasswordEncoderAdapter implements PasswordEncoder {
    private final BCryptPasswordEncoder bcrypt;

    public BCryptPasswordEncoderAdapter(final BCryptPasswordEncoder bcrypt) {
        this.bcrypt = bcrypt;
    }

    @Override
    public String encode(String rawPassword) {
        return bcrypt.encode(rawPassword);
    }

    @Override
    public boolean matches(String rawPassword, String encodedPassword) {
        return bcrypt.matches(rawPassword, encodedPassword);
    }
}
