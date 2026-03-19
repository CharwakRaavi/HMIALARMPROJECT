package com.hmi.alarmboard;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class AlarmBoardApplication {

	public static void main(String[] args) {
		SpringApplication.run(AlarmBoardApplication.class, args);
	}
}
