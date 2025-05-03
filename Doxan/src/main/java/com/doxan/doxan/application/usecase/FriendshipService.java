package com.doxan.doxan.application.usecase;

import com.doxan.doxan.domain.dto.mapper.FriendshipDTOMapper;
import com.doxan.doxan.domain.dto.mapper.UserDTOMapper;
import com.doxan.doxan.domain.dto.request.PageRequest;
import com.doxan.doxan.domain.dto.request.friendship.FriendshipRequest;
import com.doxan.doxan.domain.dto.request.friendship.FriendshipUpdateRequest;
import com.doxan.doxan.domain.dto.request.friendship.PageCommonFriendshipRequest;
import com.doxan.doxan.domain.dto.response.friendship.FriendshipResponse;
import com.doxan.doxan.domain.dto.response.user.UserResponse;
import com.doxan.doxan.domain.exception.AppException;
import com.doxan.doxan.domain.exception.ErrorCode;
import com.doxan.doxan.domain.model.Friendship;
import com.doxan.doxan.domain.model.enums.FriendshipStatus;
import com.doxan.doxan.domain.port.in.FriendshipUseCase;
import com.doxan.doxan.domain.port.out.FriendshipRepositoryPort;
import com.doxan.doxan.domain.port.out.UserRepositoryPort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FriendshipService implements FriendshipUseCase {
    private final FriendshipRepositoryPort friendshipRepository;
    private final UserRepositoryPort userRepository;
    private final UserDTOMapper userDTOMapper;
    private final FriendshipDTOMapper friendshipDTOMapper;

    FriendshipService(final FriendshipRepositoryPort friendshipRepository,
                      final UserRepositoryPort userRepository,
                      UserDTOMapper userDTOMapper,
                      FriendshipDTOMapper friendshipDTOMapper) {
        this.friendshipRepository = friendshipRepository;
        this.userRepository = userRepository;
        this.userDTOMapper = userDTOMapper;
        this.friendshipDTOMapper = friendshipDTOMapper;
    }

    @Override
    public List<UserResponse> getAllFriendsFromUserId(String userId) {
        List<Friendship> friends = friendshipRepository.findAllByUserId(userId);
        return friends.stream().filter(friendship -> FriendshipStatus.ACCEPTED.equals(friendship
                .getStatus())).map(friendship -> {
            if (userId.equals(friendship.getAccepter().getId()))
                return friendship.getAccepter();
            return friendship.getRequester();
        }).toList().stream().map(userDTOMapper::toResponse).collect(Collectors.toList());
    }

    @Override
    public List<UserResponse> getRequester(String userId) {
        List<Friendship> friends = friendshipRepository
                .findAllByAccepterIdAndStatus(userId, FriendshipStatus.PENDING);
        return friends.stream().map(Friendship::getRequester).toList().stream()
                .map(userDTOMapper::toResponse).collect(Collectors.toList());
    }

    @Override
    public List<UserResponse> getRequested(String userId) {
        List<Friendship> friends = friendshipRepository
                .findAllByRequesterIdAndStatus(userId, FriendshipStatus.PENDING);
        return friends.stream().map(Friendship::getRequester).toList()
                .stream().map(userDTOMapper::toResponse).collect(Collectors.toList());
    }

    @Override
    public List<UserResponse> getCommonFriends(PageCommonFriendshipRequest request) {
        return friendshipRepository.getCommonFriendIds(request.getUserAId(),
                        request.getUserBId(), request.getOffset(), request.getLimit())
                .stream().map(id -> userRepository.findById(id).orElseThrow(() ->
                        new AppException(ErrorCode.USER_NOT_EXISTED))).toList()
                .stream().map(userDTOMapper::toResponse).collect(Collectors.toList());
    }

    @Override
    public long getNumberOfCommonFriends(FriendshipRequest request) {
        return friendshipRepository.countNumberOfCommonFriends(request.getRequesterId(),
                request.getRequestedId());
    }

    @Override
    public long getNumberOfFriends(String userId) {
        return friendshipRepository.countFriendshipsByUserId(userId);
    }

    @Override
    public long getNumberOfRequesters(String userId) {
        return friendshipRepository
                .findAllByAccepterIdAndStatus(userId, FriendshipStatus.PENDING).size();
    }

    @Override
    public FriendshipResponse getFriendShip(FriendshipRequest request) {
        return friendshipDTOMapper.toResponse(friendshipRepository.findById(request.getRequesterId(),
                request.getRequestedId()).orElseThrow(() -> new AppException(ErrorCode.FRIENDSHIP_NOT_EXISTED)));
    }

    @Override
    public FriendshipResponse create(FriendshipRequest request) {
        return friendshipDTOMapper.toResponse(friendshipRepository.save(Friendship.builder()
                .requester(userRepository.findById(request.getRequesterId())
                        .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED)))
                .accepter(userRepository.findById(request.getRequestedId())
                        .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED)))
                .status(FriendshipStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .build()));
    }

    @Override
    public FriendshipResponse update(FriendshipUpdateRequest request) {
        Friendship friendship = friendshipRepository.findById(request.getUserA(),
                request.getUserB()).orElseThrow(() -> new AppException(ErrorCode.FRIENDSHIP_NOT_EXISTED));
        friendship.setStatus(request.getStatus());
        return friendshipDTOMapper.toResponse(friendshipRepository.save(friendship));
    }

    @Override
    public void delete(FriendshipRequest request) {
        friendshipRepository.deleteById(request.getRequesterId(), request.getRequestedId());
    }

    @Override
    public List<UserResponse> getPageFriends(String userId, PageRequest request) {
        return friendshipRepository.findFriendshipsByUserIdWithPagination(userId, userId,
                        request.getOffset(), request.getLimit())
                .stream().filter(friendship -> FriendshipStatus.ACCEPTED.equals(friendship.getStatus()))
                .map(friendship -> {
                    if (userId.equals(friendship.getAccepter().getId()))
                        return friendship.getAccepter();
                    return friendship.getRequester();
                }).toList().stream().map(userDTOMapper::toResponse).collect(Collectors.toList());
    }
}
