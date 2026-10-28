package org.evoting.election.entity;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import java.util.Set;

public enum ElectionStatus {
    DRAFT,
    SCHEDULED,
    ACTIVE,
    PAUSED,
    COMPLETED,
    PUBLISHED,
    CANCELLED;

    public boolean canTransitionTo(ElectionStatus next) {
        if (this == next) return true;
        return switch (this) {
            case DRAFT -> Set.of(SCHEDULED, ACTIVE, CANCELLED).contains(next);
            case SCHEDULED -> Set.of(ACTIVE, CANCELLED).contains(next);
            case ACTIVE -> Set.of(PAUSED, COMPLETED, CANCELLED).contains(next);
            case PAUSED -> Set.of(ACTIVE, CANCELLED).contains(next);
            case COMPLETED -> Set.of(PUBLISHED, ACTIVE).contains(next);
            case PUBLISHED -> Set.of(COMPLETED).contains(next);
            case CANCELLED -> false; // Terminal states
        };
    }

    @JsonCreator
    public static ElectionStatus fromString(String statusStr) {
        if (statusStr == null) return DRAFT;
        String upper = statusStr.trim().toUpperCase();
        return switch (upper) {
            case "UPCOMING" -> SCHEDULED;
            case "ONGOING" -> ACTIVE;
            default -> {
                try {
                    yield valueOf(upper);
                } catch (Exception e) {
                    yield DRAFT;
                }
            }
        };
    }

    @JsonValue
    public String toValue() {
        return this.name();
    }
}
