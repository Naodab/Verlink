package com.doxan.doxan.adapter.out.persistence.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.Set;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity(name = "events")
@Table(name = "events")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class JpaEventEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    String title;
    String location;

    @Column(name = "event_date")
    LocalDateTime eventDate;

    @Column(name = "created_at")
    LocalDateTime createdAt;

    boolean professed;

    @ManyToMany
    @JoinTable(
        name = "event_hosts",
        joinColumns = @JoinColumn(name = "event_id"),
        inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    Set<JpaUserEntity> hosts;
}
