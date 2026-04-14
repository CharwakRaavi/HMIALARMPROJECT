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
