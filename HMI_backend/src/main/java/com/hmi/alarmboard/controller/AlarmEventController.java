package com.hmi.alarmboard.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.hmi.alarmboard.entity.AlarmEvent;
import com.hmi.alarmboard.entity.AlarmState;
import com.hmi.alarmboard.service.AlarmEventService;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = "http://localhost:4200") // The "Bridge" to Angular

public class AlarmEventController {

	@Autowired
	AlarmEventService eventService;

	@PostMapping
	public AlarmEvent createEvent(@RequestBody AlarmEvent event) {
		return eventService.createEvent(event);
	}

//	@GetMapping("/all")
//	public List<AlarmEvent> getAllEvents() {
//		return eventService.getAllEvents();
//	}

	@PutMapping("/{id}/acknowledge")
	public AlarmEvent acknowledgeEvent(@PathVariable Long id) {
		return eventService.updateState(id, AlarmState.ACKNOWLEDGED);
	}

	@PutMapping("/{id}/clear")
	public AlarmEvent clearEvent(@PathVariable Long id) {
		return eventService.updateState(id, AlarmState.CLEARED);
	}

	@GetMapping("/filter")
	public Page<AlarmEvent> filterEvents(@RequestParam(required = false) String severity,
			@RequestParam(required = false) AlarmState state, @RequestParam(defaultValue = "8") int size,
			@RequestParam(defaultValue = "0") int page) {
		return eventService.filterEvents(severity, state, page, size);
	}

	@GetMapping("/alarms/summary")
	public Map<String, Long> getAlarmSummary() {
		return eventService.getAlarmSummary();
	}

//	@GetMapping
//	public Page<AlarmEvent> getEvents(@RequestParam(defaultValue = "0") int page,
//			@RequestParam(defaultValue = "10") int size) {
//		return eventService.getEvents(page, size);
//	}

}
