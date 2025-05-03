package com.doxan.doxan.adapter.out.fileupload;

import com.doxan.doxan.domain.file.UploadFile;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public class SpringUploadFile implements UploadFile {
    private final MultipartFile file;

    public SpringUploadFile(MultipartFile file) {
        this.file = file;
    }

    @Override
    public String getOriginalFilename() {
        return file.getOriginalFilename();
    }

    @Override
    public String getMimeType() {
        return file.getContentType();
    }

    @Override
    public byte[] getBytes() {
        try {
            return file.getBytes();
        } catch (IOException e) {
            throw new RuntimeException("Cannot read file", e);
        }
    }
}
