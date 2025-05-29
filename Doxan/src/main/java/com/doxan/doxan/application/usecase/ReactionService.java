package com.doxan.doxan.application.usecase;

import com.doxan.doxan.domain.dto.mapper.ReactionDTOMapper;
import com.doxan.doxan.domain.dto.request.reaction.PageReactionRequest;
import com.doxan.doxan.domain.dto.request.reaction.ReactionCreateRequest;
import com.doxan.doxan.domain.dto.request.reaction.ReactionUpdateRequest;
import com.doxan.doxan.domain.dto.response.reaction.ReactionResponse;
import com.doxan.doxan.domain.exception.AppException;
import com.doxan.doxan.domain.exception.ErrorCode;
import com.doxan.doxan.domain.model.Reaction;
import com.doxan.doxan.domain.model.User;
import com.doxan.doxan.domain.port.in.ReactionUseCase;
import com.doxan.doxan.domain.port.out.UserRepositoryPort;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReactionService implements ReactionUseCase {
    private final UserRepositoryPort userRepository;
    private final ReactionDTOMapper reactionMapper;

    public ReactionService(UserRepositoryPort userRepositoryAdapter, ReactionDTOMapper reactionDTOMapper) {
        this.userRepository = userRepositoryAdapter;
        this.reactionMapper = reactionDTOMapper;
    }

    @Override
    public ReactionResponse createReaction(ReactionCreateRequest reactionCreateRequest) {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        Reaction reaction = reactionMapper.fromCreateRequest(reactionCreateRequest);
        reaction.setUser(user);
        reaction.setCreatedAt(LocalDateTime.now());
        return null;
    }

    @Override
    public List<ReactionResponse> getPageReactionsFromTargetIdAndReactionType(PageReactionRequest request) {
        return List.of();
    }

    @Override
    public void deleteById(String targetId) {

    }

    @Override
    public ReactionResponse updateReaction(ReactionUpdateRequest request) {
        return null;
    }
}
