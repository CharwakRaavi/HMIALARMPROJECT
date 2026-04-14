package com.hmi.alarmboard.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hmi.alarmboard.entity.Machine;
import com.hmi.alarmboard.exception.MachineNotFoundException;
import com.hmi.alarmboard.repository.MachineRepository;

@RestController
@RequestMapping("/api/machine")
@CrossOrigin(origins = "http://localhost:4200") // The "Bridge" to Angular
public class MachineController {
	@Autowired
	MachineRepository machineRepo;

	@GetMapping("/getMachineById/{id}")
	public Machine getMachineByMachineId(@PathVariable Long id) {
		return machineRepo.findById(id).orElseThrow(() -> new MachineNotFoundException("not found"));
	}
}
