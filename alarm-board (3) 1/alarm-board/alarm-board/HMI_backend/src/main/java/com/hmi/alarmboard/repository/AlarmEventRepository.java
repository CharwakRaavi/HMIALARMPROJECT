package com.hmi.alarmboard.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.hmi.alarmboard.entity.AlarmEvent;
import com.hmi.alarmboard.entity.AlarmState;
import com.hmi.alarmboard.entity.Severity;

public interface AlarmEventRepository extends JpaRepository<AlarmEvent, Long> {

	@Override
	Page<AlarmEvent> findAll(Pageable pageable);

	// Custom query with pagination
	@Query("SELECT e FROM AlarmEvent e WHERE " + "(:severity IS NULL OR e.alarm.severity = :severity) AND "
			+ "(:state IS NULL OR e.state = :state)")
	Page<AlarmEvent> filterEvents(@Param("severity") Severity severity, @Param("state") AlarmState state,
			Pageable pageable);
}
