package com.hmi.alarmboard.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hmi.alarmboard.entity.Machine;

public interface MachineRepository extends JpaRepository<Machine, Long> {

}
