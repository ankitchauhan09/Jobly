package com.skillservice.repository;

import com.skillservice.entities.Skill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SkillRepo extends JpaRepository<Skill, Integer> {
    Skill findBySkillNameContainingIgnoreCase(String name);
}
