package org.evoting.election.entity;

public enum ElectionStatus {
    DRAFT,
    UPCOMING,
    ACTIVE,    // Frontend-facing status name; equivalent to ONGOING
    ONGOING,   // Legacy alias; treated same as ACTIVE in voting validation
    COMPLETED,
    CANCELLED;

    /** Returns true if this status allows voting. */
    public boolean isVotingOpen() {
        return this == ACTIVE || this == ONGOING;
    }
}
