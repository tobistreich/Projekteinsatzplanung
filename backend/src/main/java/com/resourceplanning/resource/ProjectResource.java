package com.resourceplanning.resource;

import com.resourceplanning.dto.CreateProjectDto;
import com.resourceplanning.dto.ProjectDto;
import com.resourceplanning.dto.UpdateProjectDto;
import com.resourceplanning.service.ProjectService;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;

import java.util.List;

@Path("/api/projects")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@ApplicationScoped
@Tag(name = "Projects")
public class ProjectResource {

    @Inject
    ProjectService projectService;

    @GET
    @Operation(summary = "Get all projects")
    public List<ProjectDto> getAllProjects() {
        return projectService.getAll();
    }

    @GET
    @Path("/{id}")
    @Operation(summary = "Get project by ID")
    public ProjectDto getProjectById(@PathParam("id") Long id) {
        return projectService.getById(id);
    }

    @POST
    @Operation(summary = "Create a new project")
    public Response createProject(CreateProjectDto dto) {
        return Response.status(Response.Status.CREATED)
                .entity(projectService.create(dto))
                .build();
    }

    @PUT
    @Path("/{id}")
    @Operation(summary = "Update a project by ID")
    public ProjectDto updateProject(@PathParam("id") Long id, UpdateProjectDto dto) {
        return projectService.update(id, dto);
    }

    @DELETE
    @Path("/{id}")
    @Operation(summary = "Delete a project by ID")
    public Response deleteProject(@PathParam("id") Long id) {
        projectService.delete(id);
        return Response.noContent().build();
    }
}
