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
import com.doxan.doxan.domain.model.Notification;
import com.doxan.doxan.domain.model.User;
import com.doxan.doxan.domain.model.enums.FriendshipStatus;
import com.doxan.doxan.domain.model.enums.NotificationType;
import com.doxan.doxan.domain.port.in.FriendshipUseCase;
import com.doxan.doxan.domain.port.out.FriendshipRepositoryPort;
import com.doxan.doxan.domain.port.out.NotificationRepositoryPort;
import com.doxan.doxan.domain.port.out.event.NotificationSender;
import com.doxan.doxan.domain.port.out.UserRepositoryPort;
import com.doxan.doxan.domain.predefined.UrlPredefined;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class FriendshipService implements FriendshipUseCase {
    private final FriendshipRepositoryPort friendshipRepository;
    private final UserRepositoryPort userRepository;
    private final UserDTOMapper userDTOMapper;
    private final FriendshipDTOMapper friendshipDTOMapper;
    private final NotificationRepositoryPort notificationRepository;
    private final NotificationSender notificationSender;

    FriendshipService(final FriendshipRepositoryPort friendshipRepository,
                      final UserRepositoryPort userRepository,
                      final UserDTOMapper userDTOMapper,
                      final FriendshipDTOMapper friendshipDTOMapper,
                      final NotificationRepositoryPort notificationRepository,
                      final NotificationSender notificationSender) {
        this.friendshipRepository = friendshipRepository;
        this.userRepository = userRepository;
        this.userDTOMapper = userDTOMapper;
        this.friendshipDTOMapper = friendshipDTOMapper;
        this.notificationRepository = notificationRepository;
        this.notificationSender = notificationSender;
    }

    @Override
    public List<UserResponse> getAllFriendsFromUserId(String userId) {
        List<Friendship> friends = friendshipRepository.findAllByUserId(userId);
        return friends.stream().filter(friendship -> FriendshipStatus.ACCEPTED.equals(friendship
                .getStatus())).map(friendship -> {
            if (userId.equals(friendship.getAccepter().getId()))
                return friendship.getAccepter();
            return friendship.getRequester();
        }).toList().stream().map(userDTOMapper::toResponse).toList();
    }

    @Override
    public List<UserResponse> getRequester(String userId) {
        List<Friendship> friends = friendshipRepository
                .findAllByAccepterIdAndStatus(userId, FriendshipStatus.PENDING);
        return friends.stream().map(Friendship::getRequester).toList().stream()
                .map(userDTOMapper::toResponse).toList();
    }

    @Override
    public List<UserResponse> getRequested(String userId) {
        List<Friendship> friends = friendshipRepository
                .findAllByRequesterIdAndStatus(userId, FriendshipStatus.PENDING);
        return friends.stream().map(Friendship::getRequester).toList()
                .stream().map(userDTOMapper::toResponse).toList();
    }

    @Override
    public List<UserResponse> getCommonFriends(PageCommonFriendshipRequest request) {
        return friendshipRepository.getCommonFriendIds(request.getUserAId(),
                        request.getUserBId(), request.getOffset(), request.getLimit())
                .stream().map(id -> userRepository.findById(id).orElseThrow(() ->
                        new AppException(ErrorCode.USER_NOT_EXISTED))).toList()
                .stream().map(userDTOMapper::toResponse).toList();
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
    @Transactional
    public FriendshipResponse create(FriendshipRequest request) {
        if (friendshipRepository.existsById(request.getRequesterId(), request.getRequestedId()))
            throw new AppException(ErrorCode.FRIENDSHIP_EXISTED);

        User requester = userRepository.findById(request.getRequesterId())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        User requested = userRepository.findById(request.getRequestedId())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        Friendship friendship = friendshipRepository.save(Friendship.builder()
                        .requester(requester)
                        .accepter(requested)
                        .createdAt(LocalDateTime.now())
                        .status(FriendshipStatus.PENDING)
                        .build());

        Notification notification = notificationRepository.save(
                Notification.builder()
                        .content(requester.getUsername() + " đã gửi lời mời kết bạn cho bạn.")
                        .senderId(requester.getId())
                        .createdAt(LocalDateTime.now())
                        .url(UrlPredefined.URL_FRIEND_REQUESTER)
                        .targetId(requested.getId())
                        .type(NotificationType.FRIEND_REQUEST)
                        .recipient(requested)
                        .build()
        );

        notificationSender.sendFriendRequestNotification(notification);
        return friendshipDTOMapper.toResponse(friendship);
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
                }).toList().stream().map(userDTOMapper::toResponse).toList();
    }
}
