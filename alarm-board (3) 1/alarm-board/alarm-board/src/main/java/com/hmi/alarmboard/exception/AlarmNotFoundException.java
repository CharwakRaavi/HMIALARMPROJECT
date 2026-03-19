package com.hmi.alarmboard.exception;

public class AlarmNotFoundException extends RuntimeException {
	public AlarmNotFoundException(String message) {
		super(message);
	}
}
