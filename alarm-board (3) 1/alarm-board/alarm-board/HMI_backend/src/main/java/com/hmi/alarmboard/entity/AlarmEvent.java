package com.hmi.alarmboard.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "alarm_events	")
public class AlarmEvent {


	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne
	@JoinColumn(name = "alarmId", nullable = false)
	private Alarm alarm;

	

	@ManyToOne
	@JoinColumn(name = "machineId", nullable = false)
	private Machine machine;

	@Column(nullable = false, insertable = false, updatable = false)
	private LocalDateTime ts;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private AlarmState state; // ACTIVE, CLEARED, ACKNOWLEDGED

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Alarm getAlarm() {
		return alarm;
	}

	public void setAlarm(Alarm alarm) {
		this.alarm = alarm;
	}

	public Machine getMachine() {
		return machine;
	}

	public void setMachine(Machine machine) {
		this.machine = machine;
	}

	public LocalDateTime getTs() {
		return ts;
	}

	public void setTs(LocalDateTime ts) {
		this.ts = ts;
	}

	public AlarmState getState() {
		return state;
	}

	public void setState(AlarmState state) {
		this.state = state;
	}

}
