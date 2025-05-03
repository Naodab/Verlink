package com.doxan.doxan.domain.predefined;

import com.doxan.doxan.domain.model.Permission;
import lombok.Getter;

import java.util.HashSet;
import java.util.Set;

public class PermissionPredefined {
    PermissionPredefined() {}

    @Getter
    private static final Set<Permission> adminPermissions = new HashSet<>();

    @Getter
    private static final Set<Permission> userPermissions = new HashSet<>();

    static {
        adminPermissions.add(Permission.builder()
                .name("MANAGE_USERS")
                .description("Manage all users of entire system.")
                .build());
        adminPermissions.add(Permission.builder()
                .name("MANAGE_ROLES")
                .description("Manage all roles of systems.")
                .build());
        adminPermissions.add(Permission.builder()
                .name("MANAGE_PERMISSIONS")
                .description("Manage all permissions of entire system.")
                .build());
        adminPermissions.add(Permission.builder()
                .name("MANAGE_POSTS")
                .description("Manage all posts of systems.")
                .build());
        adminPermissions.add(Permission.builder()
                .name("MANAGE_COMMENTS")
                .description("Manage all comments of entire system.")
                .build());
        adminPermissions.add(Permission.builder()
                .name("MANAGE_EVENTS")
                .description("Manage all events of systems.")
                .build());
        adminPermissions.add(Permission.builder()
                .name("MANAGE_GROUPS")
                .description("Manage all groups of entire system.")
                .build());
        adminPermissions.add(Permission.builder()
                .name("MANAGE_STICKER_PACKS")
                .description("Manage all sticker packs of systems.")
                .build());
        adminPermissions.add(Permission.builder()
                .name("MANAGE_STICKER_ITEMS")
                .description("Manage all sticker items of systems.")
                .build());
        adminPermissions.add(Permission.builder()
                .name("MANAGE_NOTIFICATIONS")
                .description("Manage all notifications of systems.")
                .build());

        userPermissions.add(Permission.builder()
                .name("MAKE_FRIENDS")
                .description("Connect and have a relationship with another user.")
                .build());
        userPermissions.add(Permission.builder()
                .name("UNFRIEND")
                .description("Unfriend with another user.")
                .build());
        userPermissions.add(Permission.builder()
                .name("FOLLOW")
                .description("Follow other users or pages, groups, events.")
                .build());
        userPermissions.add(Permission.builder()
                .name("UNFOLLOW")
                .description("Unfollow other users or pages, groups, events.")
                .build());
        userPermissions.add(Permission.builder()
                .name("BLOCK")
                .description("Block other users.")
                .build());
        userPermissions.add(Permission.builder()
                .name("UNBLOCK")
                .description("Unblock other users.")
                .build());
        userPermissions.add(Permission.builder()
                .name("HIDDEN_CONTENTS")
                .description("Hidden contents from a user, page, group, event, .....")
                .build());
        userPermissions.add(Permission.builder()
                .name("UNHIDDEN_CONTENTS")
                .description("Unhidden contents from a user, page, group, event, .....")
                .build());
        userPermissions.add(Permission.builder()
                .name("CREATE_COMMENT")
                .description("Comment to a post of users' friends.")
                .build());
        userPermissions.add(Permission.builder()
                .name("EDIT_COMMENTS")
                .description("Edit the comments users have made.")
                .build());
        userPermissions.add(Permission.builder()
                .name("DELETE_COMMENTS")
                .description("Delete the comments users have made.")
                .build());
        userPermissions.add(Permission.builder()
                .name("CREATE_EVENT")
                .description("Create an event with others.")
                .build());
        userPermissions.add(Permission.builder()
                .name("DELETE_EVENT")
                .description("Cancel an event with others.")
                .build());
        userPermissions.add(Permission.builder()
                .name("CREATE_GROUP")
                .description("Create a group with others.")
                .build());
        userPermissions.add(Permission.builder()
                .name("DELETE_GROUP")
                .description("Dissolve a group whose admins are them.")
                .build());
        userPermissions.add(Permission.builder()
                .name("JOIN_GROUP")
                .description("Become a member of a group.")
                .build());
        userPermissions.add(Permission.builder()
                .name("LEAVE_GROUP")
                .description("Leave a group.")
                .build());
        userPermissions.add(Permission.builder()
                .name("CREATE_PAGE")
                .description("Create a page.")
                .build());
        userPermissions.add(Permission.builder()
                .name("DELETE_PAGE")
                .description("Delete a page whose the admins are them.")
                .build());
        userPermissions.add(Permission.builder()
                .name("CREATE_POST")
                .description("Create a post.")
                .build());
        userPermissions.add(Permission.builder()
                .name("EDIT_POST")
                .description("Edit a post.")
                .build());
        userPermissions.add(Permission.builder()
                .name("DELETE_POST")
                .description("Delete a post.")
                .build());
        userPermissions.add(Permission.builder()
                .name("MAKE_REACTION")
                .description("React to a post of users' friends.")
                .build());
        userPermissions.add(Permission.builder()
                .name("UNMAKE_REACTION")
                .description("Delete reaction to a post of users' friends.")
                .build());
        userPermissions.add(Permission.builder()
                .name("USE_STICKER")
                .description("Use stickers.")
                .build());
    }
}
