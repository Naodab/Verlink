package com.doxan.doxan.adapter.out.fileupload;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.doxan.doxan.domain.exception.AppException;
import com.doxan.doxan.domain.exception.ErrorCode;
import com.doxan.doxan.domain.file.UploadFile;
import com.doxan.doxan.domain.model.Media;
import com.doxan.doxan.domain.model.enums.MediaTargetType;
import com.doxan.doxan.domain.model.enums.MediaType;
import com.doxan.doxan.domain.port.out.MediaUploader;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Component
public class CloudinaryMediaUploader implements MediaUploader {
    private final Cloudinary cloudinary;

    public CloudinaryMediaUploader(final Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    @Override
    public Media upload(UploadFile uploadFile, String targetId, MediaTargetType type) {
        try {
            Map<?, ?> result = cloudinary.uploader().upload(uploadFile.getBytes(), ObjectUtils.emptyMap());
            String url = (String) result.get("secure_url");
            String mimeType = uploadFile.getMimeType();
            String fileName = uploadFile.getOriginalFilename();

            return Media.builder()
                    .targetId(targetId)
                    .url(url)
                    .fileName(fileName)
                    .mimeType(mimeType)
                    .mediaType(resolveMediaType(mimeType))
                    .targetType(type)
                    .build();
        } catch (Exception e) {
            throw new AppException(ErrorCode.UPLOADER_ERROR);
        }
    }

    @Override
    public Media uploadFromInputStream(byte[] inputStream, String fileName, String mimeType) {
        try {
            Map<String, Object> options = new HashMap<>();
            options.put("resource_type", "auto");
            options.put("public_id", "defaults/" + fileName);
            options.put("overwrite", true);

            @SuppressWarnings("unchecked")
            Map<String, Object> result = cloudinary.uploader().upload(inputStream, options);

            return Media.builder()
                    .url((String) result.get("secure_url"))
                    .fileName(fileName)
                    .mimeType(mimeType)
                    .mediaType(MediaType.IMAGE)
                    .targetId("default")
                    .targetType(MediaTargetType.USER)
                    .build();

        } catch (IOException e) {
            throw new RuntimeException("Cloudinary upload failed", e);
        }
    }

    @Override
    public void delete(String publicId) {
        try {
            cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
        } catch (IOException e) {
            throw new AppException(ErrorCode.DELETE_FILE_ERROR);
        }
    }

    private MediaType resolveMediaType(String mimeType) {
        if (mimeType == null) return MediaType.DOCUMENT;
        if (mimeType.startsWith("image/")) return MediaType.IMAGE;
        if (mimeType.startsWith("video/")) return MediaType.VIDEO;
        return MediaType.DOCUMENT;
    }
}
