package com.resourceplanning.resource;

import com.resourceplanning.dto.CreateSkillDto;
import com.resourceplanning.dto.SkillDto;
import com.resourceplanning.service.SkillService;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;

import java.util.List;

@Path("/api/skills")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@ApplicationScoped
@Tag(name = "Skills")
public class SkillResource {

    @Inject
    SkillService skillService;

    @GET
    @Operation(summary = "Get all skills")
    public List<SkillDto> getAllSkills() {
        return skillService.getAll();
    }

    @POST
    @Operation(summary = "Create a new skill")
    public Response createSkill(CreateSkillDto dto) {
        return Response.status(Response.Status.CREATED)
                .entity(skillService.create(dto))
                .build();
    }

    @DELETE
    @Path("/{id}")
    @Operation(summary = "Delete a skill by ID")
    public Response deleteSkill(@PathParam("id") Long id) {
        skillService.delete(id);
        return Response.noContent().build();
    }
}
