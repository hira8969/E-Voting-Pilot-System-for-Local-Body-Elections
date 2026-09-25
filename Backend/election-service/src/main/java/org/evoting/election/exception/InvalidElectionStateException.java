package org.evoting.election.exception;

public class InvalidElectionStateException extends RuntimeException {
    public InvalidElectionStateException(String message) {
        super(message);
    }
}
