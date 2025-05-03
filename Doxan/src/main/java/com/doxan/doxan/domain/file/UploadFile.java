package com.doxan.doxan.domain.file;

public interface UploadFile {
    String getOriginalFilename();
    String getMimeType();
    byte[] getBytes();
}
