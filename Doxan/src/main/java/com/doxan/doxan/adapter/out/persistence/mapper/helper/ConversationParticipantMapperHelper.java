package com.doxan.doxan.adapter.out.persistence.mapper.helper;

import com.doxan.doxan.adapter.out.persistence.entity.JpaConversationParticipantEntityId;
import com.doxan.doxan.domain.model.ConversationParticipant;
import org.mapstruct.Named;

public class ConversationParticipantMapperHelper {
    ConversationParticipantMapperHelper() {}

    @Named("buildId")
    public static JpaConversationParticipantEntityId buildId(ConversationParticipant participant) {
        return JpaConversationParticipantEntityId.builder()
                .userId(participant.getConversation().getId())
                .conversationId(participant.getConversation().getId())
                .build();
    }
}
