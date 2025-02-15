package com.skillservice.controller;

import com.skillservice.dto.SkillDto;
import com.skillservice.exception.ApiException;
import com.skillservice.response.ApiResponse;
import com.skillservice.service.SkillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/skills")
public class SkillController {

    @Autowired
    private SkillService skillService;

    @PostMapping("/add")
    public ResponseEntity<?> addNewSkill(@RequestBody List<SkillDto> skillDto) {
        try {
            List<SkillDto> response = this.skillService.addSkill(skillDto);
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (ApiException e) {
            return new ResponseEntity<>(new ApiResponse(e.getMessage(), e.getStatusCode(), false), HttpStatusCode.valueOf(e.getStatusCode()));
        } catch (Exception e) {
            return new ResponseEntity<>(new ApiResponse(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR.value(), false), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Handle GET request for fetching skills by IDs
    @GetMapping("/by-ids")
    public ResponseEntity<List<SkillDto>> getSkillsByIds(@RequestParam("ids") List<Integer> skillIds) {
        List<SkillDto> skills = skillService.getSkillById(skillIds);
        return ResponseEntity.ok(skills);
    }

    @GetMapping("/")
    public ResponseEntity<?> getSKillsByName(@RequestParam("skillName") String skillName) {
        try {
            SkillDto skill = this.skillService.getSkillByName(skillName);
            return new ResponseEntity<>(skill, HttpStatus.OK);
        } catch (ApiException e) {
            return new ResponseEntity<>(new ApiResponse(e.getMessage(), e.getStatusCode(), false), HttpStatusCode.valueOf(e.getStatusCode()));
        } catch (Exception e) {
            return new ResponseEntity<>(new ApiResponse(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR.value(), false), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSkillById(@PathVariable("id") Integer id) {
        try {
            this.skillService.deleteSkillById(id);
            return new ResponseEntity<>(new ApiResponse("SKill Deleted Successfully..", HttpStatus.OK.value(), true), HttpStatus.OK);
        } catch (ApiException e) {
            return new ResponseEntity<>(new ApiResponse(e.getMessage(), e.getStatusCode(), false), HttpStatusCode.valueOf(e.getStatusCode()));
        } catch (Exception e) {
            return new ResponseEntity<>(new ApiResponse(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR.value(), false), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
