package com.doxan.doxan.domain.port.out;

import com.doxan.doxan.domain.model.Friendship;
import com.doxan.doxan.domain.model.enums.FriendshipStatus;

import java.util.List;
import java.util.Optional;

public interface FriendshipRepositoryPort {
    Friendship save(Friendship friendship);
    Optional<Friendship> findById(String requesterId, String accepterId);
    void deleteById(String requesterId, String accepterId);
    List<Friendship> findAllByRequesterIdAndStatus(String requesterId, FriendshipStatus status);
    List<Friendship> findAllByAccepterIdAndStatus(String accepterId, FriendshipStatus status);
    List<Friendship> findFriendshipsByUserIdWithPagination(String userId, String accepterId, int offset, int limit);
    List<Friendship> findAllByUserId(String userId);
    List<String> getCommonFriendIds(String userA, String userB, int offset, int limit);
    long countFriendshipsByUserId(String userId);
    long countNumberOfCommonFriends(String userA, String userB);
}
