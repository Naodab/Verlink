package com.doxan.doxan.adapter.out.kafka.adapter;

public enum KafkaTopic {
    NOTIFICATIONS,
    MESSAGES;

    @Override
    public String toString() {
        return super.toString().toLowerCase();
    }
}
