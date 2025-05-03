package com.doxan.doxan.adapter.out.persistence.repository;

import com.doxan.doxan.adapter.out.persistence.entity.JpaFriendshipEntity;
import com.doxan.doxan.domain.model.enums.FriendshipStatus;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface JpaFriendshipRepository extends JpaRepository<JpaFriendshipEntity,
        JpaFriendshipEntity.FriendshipId> {
    @Query("SELECT f FROM friendships f WHERE f.id.requesterId = :requesterId AND f.status = :status")
    List<JpaFriendshipEntity> findAllById_RequesterIdAndStatus(String requesterId, FriendshipStatus status);

    @Query("SELECT f FROM friendships f WHERE f.id.accepterId = :accepterId AND f.status = :status")
    List<JpaFriendshipEntity> findAllById_AccepterIdAndStatus(String accepterId, FriendshipStatus status);

    @Query("""
        SELECT f FROM friendships f\s
        WHERE (f.id.requesterId = :userA AND f.id.accepterId = :userB)\s
           OR (f.id.requesterId = :userB AND f.id.accepterId = :userA)
   \s""")
    Optional<JpaFriendshipEntity> findFriendshipBetween(@Param("userA") String userA,
                                                        @Param("userB") String userB);

    @Modifying
    @Query("""
        DELETE FROM friendships f\s
        WHERE (f.id.requesterId = :userA AND f.id.accepterId = :userB)\s
           OR (f.id.requesterId = :userB AND f.id.accepterId = :userA)
   \s""")
    void deleteFriendshipBetween(@Param("userA") String userA, @Param("userB") String userB);

    @Query(value = "SELECT f.* FROM friendships f WHERE f.requester_id = :requesterId OR f.accepter_id = :accepterId " +
            "ORDER BY f.created_at DESC LIMIT :limit OFFSET :offset", nativeQuery = true)
    List<JpaFriendshipEntity> findFriendshipsByUserIdWithPagination(
            @Param("requesterId") String requesterId,
            @Param("accepterId") String accepterId,
            @Param("limit") int limit,
            @Param("offset") int offset);

    @Query(value = "SELECT f.* FROM friendships f WHERE f.requester_id = :requesterId " +
            "OR f.accepter_id = :accepterId", nativeQuery = true)
    List<JpaFriendshipEntity> findFriendshipsByUserId(String userId, String accepterId);

    @Query(value = "SELECT COUNT(*) FROM friendships f WHERE f.requester_id = :userId OR f.accepter_id = :userId",
            nativeQuery = true)
    long countFriendshipsByUserId(@Param("userId") String userId);

    @Query(value = "SELECT DISTINCT " +
            "CASE WHEN f.requester_id = u.id THEN f.accepter_id ELSE f.requester_id END AS user_id " +
            "FROM friendships f " +
            "INNER JOIN (" +
            "  SELECT u.id, COUNT(*) as friend_count " +
            "  FROM users u " +
            "  JOIN friendships f ON u.id = f.requester_id OR u.id = f.accepter_id " +
            "  GROUP BY u.id " +
            "  ORDER BY friend_count DESC " +
            "  LIMIT :limit" +
            ") u ON u.id = f.requester_id OR u.id = f.accepter_id",
            nativeQuery = true)
    List<String> findMostConnectedUsers(@Param("limit") int limit);

    @Query(value = """
        SELECT COUNT(*) FROM (
            SELECT CASE\s
                     WHEN f.requester_id = :userA THEN f.accepter_id\s
                     ELSE f.requester_id\s
                   END AS friend_id
            FROM friendships f
            WHERE f.requester_id = :userA OR f.accepter_id = :userA
        ) AS a
        JOIN (
            SELECT CASE\s
                     WHEN f.requester_id = :userB THEN f.accepter_id\s
                     ELSE f.requester_id\s
                   END AS friend_id
            FROM friendships f
            WHERE f.requester_id = :userB OR f.accepter_id = :userB
        ) AS b ON a.friend_id = b.friend_id
       \s""", nativeQuery = true)
    int countMutualFriends(@Param("userA") String userA, @Param("userB") String userB);

    @Query(value = """
    SELECT u.id
    FROM (
        SELECT CASE
                 WHEN f.requester_id = :userA THEN f.accepter_id
                 ELSE f.requester_id
               END AS friend_id
        FROM friendships f
        WHERE f.requester_id = :userA OR f.accepter_id = :userA
    ) AS a
    JOIN (
        SELECT CASE
                 WHEN f.requester_id = :userB THEN f.accepter_id
                 ELSE f.requester_id
               END AS friend_id
        FROM friendships f
        WHERE f.requester_id = :userB OR f.accepter_id = :userB
    ) AS b ON a.friend_id = b.friend_id
    JOIN users u ON u.id = a.friend_id
    ORDER BY u.created_at ASC
    LIMIT :limit OFFSET :offset
    """, nativeQuery = true)
    List<String> getCommonFriends(
            @Param("userA") String userA,
            @Param("userB") String userB,
            @Param("limit") int limit,
            @Param("offset") int offset
    );
}
