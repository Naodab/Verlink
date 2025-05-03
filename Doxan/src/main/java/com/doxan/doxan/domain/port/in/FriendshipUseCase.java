package com.doxan.doxan.domain.port.in;

import com.doxan.doxan.domain.dto.request.PageRequest;
import com.doxan.doxan.domain.dto.request.friendship.FriendshipRequest;
import com.doxan.doxan.domain.dto.request.friendship.FriendshipUpdateRequest;
import com.doxan.doxan.domain.dto.request.friendship.PageCommonFriendshipRequest;
import com.doxan.doxan.domain.dto.response.friendship.FriendshipResponse;
import com.doxan.doxan.domain.dto.response.user.UserResponse;

import java.util.List;

public interface FriendshipUseCase {
    List<UserResponse> getAllFriendsFromUserId(String userId);
    List<UserResponse> getRequester(String userId);
    List<UserResponse> getRequested(String userId);
    List<UserResponse> getCommonFriends(PageCommonFriendshipRequest request);
    long getNumberOfCommonFriends(FriendshipRequest request);
    long getNumberOfFriends(String userId);
    long getNumberOfRequesters(String userId);
    FriendshipResponse getFriendShip(FriendshipRequest request);
    FriendshipResponse create(FriendshipRequest request);
    FriendshipResponse update(FriendshipUpdateRequest request);
    void delete(FriendshipRequest request);
    List<UserResponse> getPageFriends(String userId, PageRequest request);
}
