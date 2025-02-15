// YApi QuickType插件生成，具体参考文档:https://plugins.jetbrains.com/plugin/18847-yapi-quicktype/documentation

package com.sih.notificationservice.payload;
import java.util.List;

import lombok.*;

import java.time.OffsetDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class NotificationPayload {
    private Boolean read;
    private Long id;
    private String type;
    private String title;
    private String message;
    private OffsetDateTime timestamp;
}
