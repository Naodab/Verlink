package com.doxan.doxan.domain.model;

import lombok.*;

@Setter
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Location {
    private String id;
    private String country;
    private String province;
    private String city;
    private String district;
    private String street;
    private String address;
}
