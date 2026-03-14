package com.doxan.doxan.adapter.out.persistence.adapter;

import com.doxan.doxan.adapter.out.persistence.entity.JpaFriendshipEntity;
import com.doxan.doxan.adapter.out.persistence.mapper.FriendshipMapper;
import com.doxan.doxan.adapter.out.persistence.repository.JpaFriendshipRepository;
import com.doxan.doxan.domain.model.Friendship;
import com.doxan.doxan.domain.model.enums.FriendshipStatus;
import com.doxan.doxan.domain.port.out.FriendshipRepositoryPort;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class FriendshipRepositoryAdapter implements FriendshipRepositoryPort {
    private final JpaFriendshipRepository jpaFriendshipRepository;
    private final FriendshipMapper friendshipMapper;

    public FriendshipRepositoryAdapter(final FriendshipMapper friendshipMapper,
                                       final JpaFriendshipRepository jpaFriendshipRepository) {
        this.friendshipMapper = friendshipMapper;
        this.jpaFriendshipRepository = jpaFriendshipRepository;
    }

    @Override
    public Friendship save(Friendship friendship) {
        return friendshipMapper.toDomain(jpaFriendshipRepository
                .save(friendshipMapper.toEntity(friendship)));
    }

    @Override
    public Optional<Friendship> findById(String requesterId, String accepterId) {
        return jpaFriendshipRepository.findFriendshipBetween(requesterId, accepterId)
                .map(friendshipMapper::toDomain);
    }

    @Override
    public void deleteById(String requesterId, String accepterId) {
        jpaFriendshipRepository.deleteFriendshipBetween(requesterId, accepterId);
    }

    @Override
    public List<Friendship> findAllByRequesterIdAndStatus(String requesterId, FriendshipStatus status) {
        return jpaFriendshipRepository.findAllById_RequesterIdAndStatus(requesterId, status)
                .stream().map(friendshipMapper::toDomain).collect(Collectors.toList());
    }

    @Override
    public List<Friendship> findAllByAccepterIdAndStatus(String accepterId, FriendshipStatus status) {
        return jpaFriendshipRepository.findAllById_AccepterIdAndStatus(accepterId, status)
                .stream().map(friendshipMapper::toDomain).collect(Collectors.toList());
    }

    @Override
    public List<Friendship> findFriendshipsByUserIdWithPagination(String userId,
                                                                  String accepterId,
                                                                  int offset,
                                                                  int limit) {
        return jpaFriendshipRepository.findFriendshipsByUserIdWithPagination(userId, accepterId, offset, limit)
                .stream().map(friendshipMapper::toDomain).toList();
    }

    @Override
    public List<Friendship> findAllByUserId(String userId) {
        return jpaFriendshipRepository.findFriendshipsByUserId(userId, userId)
                .stream().map(friendshipMapper::toDomain).collect(Collectors.toList());
    }

    @Override
    public List<String> getCommonFriendIds(String userA, String userB, int offset, int limit) {
        return jpaFriendshipRepository.getCommonFriends(userA, userB, offset, limit);
    }

    @Override
    public long countFriendshipsByUserId(String userId) {
        return jpaFriendshipRepository.countFriendshipsByUserId(userId);
    }

    @Override
    public long countNumberOfCommonFriends(String userA, String userB) {
        return jpaFriendshipRepository.countMutualFriends(userA, userB);
    }

    @Override
    public boolean existsById(String requesterId, String accepterId) {
        return jpaFriendshipRepository.existsById(JpaFriendshipEntity.FriendshipId.builder()
                        .requesterId(requesterId)
                        .accepterId(accepterId)
                        .build())
                ||
                jpaFriendshipRepository.existsById(JpaFriendshipEntity.FriendshipId.builder()
                        .requesterId(accepterId)
                        .accepterId(requesterId)
                        .build());
    }
}
