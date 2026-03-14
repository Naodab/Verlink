package com.doxan.doxan.domain.utils;

import com.doxan.doxan.domain.exception.AppException;
import com.doxan.doxan.domain.exception.ErrorCode;

public class UrlUtil {
    private UrlUtil() {}

    public static String extractPublicId(String url) {
        try {
            String[] parts = url.split("/");
            String fileName = parts[parts.length - 1];
            return fileName.substring(0, fileName.lastIndexOf("."));
        } catch (Exception e) {
            throw new AppException(ErrorCode.EXTRACT_PUBLIC_ID);
        }
    }
}
