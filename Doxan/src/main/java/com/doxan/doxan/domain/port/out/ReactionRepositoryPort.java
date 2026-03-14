package com.doxan.doxan.domain.port.out;

import com.doxan.doxan.domain.model.Reaction;
import com.doxan.doxan.domain.model.enums.ReactionType;

import java.util.List;

public interface ReactionRepositoryPort {
    Reaction save(Reaction reaction);
    void deleteById(String userId, String targetId);
    boolean existsById(String userId, String targetId);
    List<Reaction> findByTargetIdAndReactionTypeWithPagination(String targetId,
           ReactionType reactionType, int offset, int limit);

}
