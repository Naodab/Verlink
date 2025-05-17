package com.doxan.doxan.adapter.out.websocket.dto;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class WebSocketResponse<T> {
    String type;
    T data;
}
