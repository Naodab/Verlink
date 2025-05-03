package com.doxan.doxan.domain.dto.request.user;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class LocationRequest {
    String country;
    String province;
    String city;
    String district;
    String street;
    String address;
}
