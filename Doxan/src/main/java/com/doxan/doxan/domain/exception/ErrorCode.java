package com.doxan.doxan.domain.exception;

import lombok.Getter;

@Getter
public enum ErrorCode {
    UNKNOWN_ERROR(9999,  "Unknown error, some thing went wrong", StatusCode.INTERNAL_SERVER_ERROR),

    LOCATION_NOT_EXISTS(1001, "Location does not exist", StatusCode.BAD_REQUEST),

    PERMISSION_NOT_EXISTS(1011, "Permission does not exist", StatusCode.BAD_REQUEST),

    ROLE_NOT_EXISTS(1021, "Role does not exist", StatusCode.BAD_REQUEST),

    USER_EXISTED(1031, "User already exists", StatusCode.BAD_REQUEST),
    USER_NOT_EXISTED(1032, "User not existed", StatusCode.BAD_REQUEST),

    FRIENDSHIP_NOT_EXISTED(1041, "Friendship not existed", StatusCode.BAD_REQUEST),
    FRIENDSHIP_EXISTED(1042, "Friendship existed", StatusCode.BAD_REQUEST),

    POST_NOT_EXISTED(1051, "Post not existed", StatusCode.BAD_REQUEST),
    POST_EDITING_NOT_PERMITTED(1052, "User don't have permission to edit this post", StatusCode.BAD_REQUEST),

    MEDIA_NOT_EXISTED(1061, "Media not existed", StatusCode.BAD_REQUEST),

    UNAUTHENTICATED(1201, "Unauthenticated", StatusCode.UNAUTHENTICATED),
    CONCURRENT_MODIFICATION(2301, "User is updating", StatusCode.BAD_REQUEST),
    DATABASE_ERROR(3301, "Database error" , StatusCode.BAD_REQUEST ),

    UPLOADER_ERROR(4001, "Can't upload file", StatusCode.BAD_REQUEST),
    DELETE_FILE_ERROR(4002, "Can't delete this media", StatusCode.BAD_REQUEST),
    EXTRACT_PUBLIC_ID(4003, "Have errors when extracting public id", StatusCode.INTERNAL_SERVER_ERROR),;

    private final int code;
    private final String message;
    private final StatusCode statusCode;

    ErrorCode(int code, String message, StatusCode statusCode) {
        this.code = code;
        this.message = message;
        this.statusCode = statusCode;
    }

}
