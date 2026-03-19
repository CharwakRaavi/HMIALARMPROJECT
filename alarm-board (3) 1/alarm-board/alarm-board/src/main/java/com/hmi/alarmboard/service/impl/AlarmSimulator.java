package com.hmi.alarmboard.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.hmi.alarmboard.entity.Alarm;
import com.hmi.alarmboard.entity.AlarmEvent;
import com.hmi.alarmboard.entity.AlarmState;
import com.hmi.alarmboard.entity.Machine;
import com.hmi.alarmboard.repository.AlarmEventRepository;
import com.hmi.alarmboard.repository.AlarmRepository;
import com.hmi.alarmboard.repository.MachineRepository;

@Service
public class AlarmSimulator {
	@Autowired
	private AlarmEventRepository eventRepo;
	@Autowired
	private AlarmRepository alarmRepo;
	@Autowired
	private MachineRepository machineRepo;

	private final Random random = new Random();

	@Scheduled(fixedRate = 10000)
	public void generateRandomEvent() {
		List<Machine> machines = machineRepo.findAll();
		List<Alarm> alarms = alarmRepo.findAll();
		/*
		 * if list.size() is 4, so nextInt(4) returns 0, 1, 2, or 3 nextInt(): Returns
		 * any random int (can be negative or positive).
		 * 
		 * nextInt(int bound): Returns a number from 0 up to bound - 1.
		 * 
		 * nextInt(int origin, int bound): (Java 1.7+) Returns a number between a
		 * specific
		 */
		Machine machine = machines.get(random.nextInt(machines.size()));
		Alarm alarm = alarms.get(random.nextInt(alarms.size()));

		AlarmEvent event = new AlarmEvent();
		event.setAlarm(alarm);
		event.setMachine(machine);
		event.setState(AlarmState.ACTIVE);
		event.setTs(LocalDateTime.now());

		eventRepo.save(event);
		System.out.println("Generated event: " + event);
	}
}
