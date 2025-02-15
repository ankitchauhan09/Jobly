package com.mentorship.repositories;

import com.mentorship.entities.Mentor;
import com.mentorship.payload.MentorSessionLoginRequest;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Mono;

@Repository
public interface MentorRepo extends R2dbcRepository<Mentor, String> {

    @Query("INSERT INTO mentors(id, name, email, location, profilePictureUrl, isActive, isVerified, technicalSkills, qualifications, description, languages, certificates, rating, yearsOfExperience) VALUES (:#{#mentor.id},:#{#mentor.id},:#{#mentor.name},:#{#mentor.location},:#{#mentor.profilePictureUrl},:#{#mentor.isActive},:#{#mentor.isVerified},:#{#mentor.technicalSkills},:#{#mentor.qualifications},:#{#mentor.description},:#{#mentor.languages},:#{#mentor.certificates},:#{#mentor.rating},:#{#mentor.yearsOfExperience})")
    public Mono<Mentor> save(Mentor mentor);


}
