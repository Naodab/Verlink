package com.doxan.doxan.domain.model;

import lombok.*;

import java.time.LocalDateTime;
import java.util.Set;

@Setter
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Event {
    private String id;
    private Set<User> hosts;
    private String title;
    private String location;
    private LocalDateTime eventDate;
    private LocalDateTime createdAt;
    private boolean professed;
}
