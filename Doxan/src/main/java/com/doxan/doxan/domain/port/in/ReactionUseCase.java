package com.doxan.doxan.domain.port.in;

import com.doxan.doxan.domain.dto.request.reaction.PageReactionRequest;
import com.doxan.doxan.domain.dto.request.reaction.ReactionCreateRequest;
import com.doxan.doxan.domain.dto.request.reaction.ReactionUpdateRequest;
import com.doxan.doxan.domain.dto.response.reaction.ReactionResponse;

import java.util.List;

public interface ReactionUseCase {
    ReactionResponse createReaction(ReactionCreateRequest reactionCreateRequest);
    List<ReactionResponse> getPageReactionsFromTargetIdAndReactionType(PageReactionRequest request);
    void deleteById(String targetId);
    ReactionResponse updateReaction(ReactionUpdateRequest request);
}
