package com.resourceplanning.resource;

import com.resourceplanning.dto.CreateTeamDto;
import com.resourceplanning.dto.TeamDto;
import com.resourceplanning.service.TeamService;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;

import java.util.List;

@Path("/api/teams")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@ApplicationScoped
@Tag(name = "Teams")
public class TeamResource {

    @Inject
    TeamService teamService;

    @GET
    @Operation(summary = "Get all teams")
    public List<TeamDto> getAllTeams() {
        return teamService.getAll();
    }

    @POST
    @Operation(summary = "Create a new team")
    public Response createTeam(CreateTeamDto dto) {
        return Response.status(Response.Status.CREATED)
                .entity(teamService.create(dto))
                .build();
    }
}
