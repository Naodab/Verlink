package com.doxan.doxan.domain.dto.response.user;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Setter
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class LocationResponse {
    String country;
    String province;
    String city;
    String district;
    String street;
    String address;
}
