package com.doxan.doxan.domain.port.out;

import java.util.function.Supplier;

public interface LockManager {
    <T> T withLock(String lockKey,
                   long waitTimeoutMs,
                   long leaseTimeoutMS,
                   Supplier<T> supplier);

    void initializeModelLocks(Class<?> modelClass);
}
