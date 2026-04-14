package com.hmi.alarmboard.exception;

public class MachineNotFoundException extends RuntimeException {
	public MachineNotFoundException(String message) {
		super(message);
	}
}
