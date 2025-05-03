package com.doxan.doxan.adapter.out.persistence.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "locations")
@Entity(name = "locations")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class JpaLocationEntity {
    @Id
    String id;
    String country;
    String province;
    String city;
    String district;
    String street;
    String address;
}
