package com.skillservice.service;

import com.skillservice.dto.SkillDto;
import com.skillservice.entities.Skill;
import com.skillservice.exception.ApiException;
import com.skillservice.repository.SkillRepo;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class SkillService {

    @Autowired
    private SkillRepo skillRepo;

    @Autowired
    private ModelMapper modelMapper;

    public List<SkillDto> addSkill(List<SkillDto> skillDto) {
        List<SkillDto> response = new ArrayList<>();
        for (SkillDto dto : skillDto) {
            Skill skill = this.modelMapper.map(skillDto, Skill.class);
            Skill createdSkill = this.skillRepo.save(skill);
            response.add(this.modelMapper.map(createdSkill, SkillDto.class));
        }
        return response;
    }

    public List<SkillDto> getSkillById(List<Integer> id) {
        List<SkillDto> response = new ArrayList<>();
        for (Integer i : id) {
            Skill skill = this.skillRepo.findById(i).orElseThrow(() -> new ApiException("No skills found with id : " + i, HttpStatus.NOT_FOUND.value()));
            response.add(this.modelMapper.map(skill, SkillDto.class));
        }
        return response;
    }

    public void deleteSkillById(Integer id) {
        Skill skill = this.skillRepo.findById(id).orElseThrow(() -> new ApiException("No skills found with id : " + id, HttpStatus.NOT_FOUND.value()));
        this.skillRepo.delete(skill);
    }

    public SkillDto getSkillByName(String name) throws Exception {
        try {
            Skill skill = this.skillRepo.findBySkillNameContainingIgnoreCase(name);
            return this.modelMapper.map(skill, SkillDto.class);
        } catch (Exception e) {
            throw new ApiException(e.getMessage(), HttpStatus.NOT_FOUND.value());
        }
    }
}
