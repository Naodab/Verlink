package com.doxan.doxan.adapter.out.persistence.mapper.helper;

import com.doxan.doxan.adapter.out.persistence.entity.JpaConversationParticipantEntityId;
import com.doxan.doxan.domain.model.ConversationParticipant;
import lombok.extern.slf4j.Slf4j;
import org.mapstruct.Named;

@Slf4j
public class ConversationParticipantMapperHelper {
    ConversationParticipantMapperHelper() {}

    @Named("buildId")
    public static JpaConversationParticipantEntityId buildId(ConversationParticipant participant) {
        return JpaConversationParticipantEntityId.builder()
                .userId(participant.getUser().getId())
                .conversationId(participant.getConversation().getId())
                .build();
    }
}
