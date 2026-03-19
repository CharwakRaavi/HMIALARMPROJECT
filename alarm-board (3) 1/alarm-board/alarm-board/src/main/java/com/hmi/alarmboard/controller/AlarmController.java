package com.hmi.alarmboard.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hmi.alarmboard.entity.Alarm;
import com.hmi.alarmboard.exception.AlarmNotFoundException;
import com.hmi.alarmboard.repository.AlarmRepository;

@RestController
@RequestMapping("/api/alarm")
@CrossOrigin(origins = "http://localhost:4200") // The "Bridge" to Angular
public class AlarmController {
	@Autowired
	private AlarmRepository alarmRepo;

	@GetMapping("/getAlarm/{id}")
	public Alarm getAlarm(@PathVariable Long id) {
		return alarmRepo.findById(id).orElseThrow(() -> new AlarmNotFoundException("Alarm not found"));
	}
}
