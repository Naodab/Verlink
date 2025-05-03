package com.doxan.doxan.domain.port.out;

import com.doxan.doxan.domain.file.UploadFile;
import com.doxan.doxan.domain.model.Media;
import com.doxan.doxan.domain.model.enums.MediaTargetType;

public interface MediaUploader {
    Media upload(UploadFile uploadFile, String targetId, MediaTargetType type);
    Media uploadFromInputStream(byte[] inputStream, String fileName, String mimeType);
    void delete(String publicId);
}
