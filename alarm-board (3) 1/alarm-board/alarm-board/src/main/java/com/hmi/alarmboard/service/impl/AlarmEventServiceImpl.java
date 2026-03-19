package com.hmi.alarmboard.service.impl;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.hmi.alarmboard.entity.Alarm;
import com.hmi.alarmboard.entity.AlarmEvent;
import com.hmi.alarmboard.entity.AlarmState;
import com.hmi.alarmboard.entity.Machine;
import com.hmi.alarmboard.entity.Severity;
import com.hmi.alarmboard.repository.AlarmEventRepository;
import com.hmi.alarmboard.repository.AlarmRepository;
import com.hmi.alarmboard.repository.MachineRepository;
import com.hmi.alarmboard.service.AlarmEventService;

@Service
public class AlarmEventServiceImpl implements AlarmEventService {

	@Autowired
	private AlarmEventRepository eventRepo;
	@Autowired
	private AlarmRepository alarmRepo;
	@Autowired
	private MachineRepository machineRepo;

	@Override
	public AlarmEvent createEvent(AlarmEvent event) {
		Alarm alarm = alarmRepo.findById(event.getAlarm().getId())
				.orElseThrow(() -> new RuntimeException("Alarm not found"));

		Machine machine = machineRepo.findById(event.getMachine().getId())
				.orElseThrow(() -> new RuntimeException("Machine not found"));

		event.setAlarm(alarm);
		event.setMachine(machine);

		return eventRepo.save(event);
	}

	@Override
	public List<AlarmEvent> getAllEvents() {
		return eventRepo.findAll();
	}

	@Override
	public AlarmEvent updateState(Long id, AlarmState state) {
		AlarmEvent event = eventRepo.findById(id).orElseThrow(() -> new RuntimeException("Event not Found"));
		event.setState(state);
		return eventRepo.save(event);
	}

	/*
	 * 
	 * @Override public List<AlarmEvent> filterEvents(String severity, AlarmState
	 * state) { return eventRepo.findAll().stream() .filter(e -> (severity == null
	 * || e.getAlarm().getSeverity().name().equals(severity)) && (state == null ||
	 * e.getState() == state)) .toList(); }
	 */

	@Override
	public Page<AlarmEvent> filterEvents(String severity, AlarmState state, int page, int size) {
		Pageable pageable = PageRequest.of(page, size, Sort.by("ts").descending());

		return eventRepo.filterEvents(severity != null ? Severity.valueOf(severity) : null, state, pageable);
	}

	/*
	 * @Override public Map<String, Long> getAlarmSummary() { List<AlarmEvent>
	 * events = eventRepo.findAll(); Map<String, Long> map = new HashMap<>();
	 * 
	 * for (AlarmEvent event : events) { String state = event.getState().name();
	 * map.put(state, map.getOrDefault(state, 0L) + 1); } return map; }
	 */

	@Override
	public Map<String, Long> getAlarmSummary() {
		List<AlarmEvent> events = eventRepo.findAll();
		return events.stream().collect(Collectors.groupingBy(e -> e.getState().name(), // group by state
				Collectors.counting() // count how many
		));
	}

	/*
	 * getContent() → list of entities in the current page. getNumber() → current
	 * page index (0-based). getSize() → size of the page (number of records per
	 * page). getTotalPages() → total number of pages. getTotalElements() → total
	 * number of records in the dataset. hasNext() / hasPrevious() → navigation
	 * helpers. isFirst() / isLast() → check page position. map(Function<T,R>) →
	 * transform content into another type (useful for DTOs).
	 */

	@Override
	public Page<AlarmEvent> getEvents(int page, int size) {
		Pageable pageable = PageRequest.of(page, size, Sort.by("ts").descending());
		return eventRepo.findAll(pageable);
	}

}
