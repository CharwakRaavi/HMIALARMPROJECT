package com.hmi.alarmboard.service;

import java.util.Map;

import org.springframework.data.domain.Page;

import com.hmi.alarmboard.entity.AlarmEvent;
import com.hmi.alarmboard.entity.AlarmState;

public interface AlarmEventService {
	AlarmEvent createEvent(AlarmEvent event);

//	List<AlarmEvent> getAllEvents();

	AlarmEvent updateState(Long id, AlarmState state);

	Page<AlarmEvent> filterEvents(String severity, AlarmState state, int page, int size);

	Map<String, Long> getAlarmSummary();

	//Page<AlarmEvent> getEvents(int page, int size); // pagination
}
