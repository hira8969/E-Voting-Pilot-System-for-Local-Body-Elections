package org.evoting.election.entity;

import java.util.Set;

public enum ElectionStatus {
    DRAFT,
    SCHEDULED,
    ACTIVE,
    PAUSED,
    COMPLETED,
    CANCELLED;

    public boolean canTransitionTo(ElectionStatus next) {
        if (this == next) return true;
        return switch (this) {
            case DRAFT -> Set.of(SCHEDULED, CANCELLED).contains(next);
            case SCHEDULED -> Set.of(ACTIVE, CANCELLED).contains(next);
            case ACTIVE -> Set.of(PAUSED, COMPLETED, CANCELLED).contains(next);
            case PAUSED -> Set.of(ACTIVE, CANCELLED).contains(next);
            case COMPLETED, CANCELLED -> false; // Terminal states
        };
    }

    public static ElectionStatus fromString(String statusStr) {
        if (statusStr == null) return DRAFT;
        String upper = statusStr.trim().toUpperCase();
        return switch (upper) {
            case "UPCOMING" -> SCHEDULED;
            case "ONGOING" -> ACTIVE;
            default -> valueOf(upper);
        };
    }
}
