package com.hmi.alarmboard.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hmi.alarmboard.entity.Alarm;

public interface AlarmRepository extends JpaRepository<Alarm, Long> {

}
