package com.resourceplanning.resource;

import com.resourceplanning.dto.AssignmentDto;
import com.resourceplanning.dto.CreateAssignmentDto;
import com.resourceplanning.service.AssignmentService;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;

import java.util.List;

@Path("/api/assignments")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@ApplicationScoped
@Tag(name = "Assignments")
public class AssignmentResource {

    @Inject
    AssignmentService assignmentService;

    @GET
    @Operation(summary = "Get all assignments")
    public List<AssignmentDto> getAllAssignments() {
        return assignmentService.getAll();
    }

    @GET
    @Path("/{id}")
    @Operation(summary = "Get assignment by ID")
    public AssignmentDto getAssignmentById(@PathParam("id") Long id) {
        return assignmentService.getById(id);
    }

    @GET
    @Path("/employee/{employeeId}")
    @Operation(summary = "Get assignments by employee")
    public List<AssignmentDto> getAssignmentsByEmployee(@PathParam("employeeId") Long employeeId) {
        return assignmentService.getByEmployee(employeeId);
    }

    @GET
    @Path("/project/{projectId}")
    @Operation(summary = "Get assignments by project")
    public List<AssignmentDto> getAssignmentsByProject(@PathParam("projectId") Long projectId) {
        return assignmentService.getByProject(projectId);
    }

    @POST
    @Operation(summary = "Create a new assignment")
    public Response createAssignment(CreateAssignmentDto dto) {
        return Response.status(Response.Status.CREATED)
                .entity(assignmentService.create(dto))
                .build();
    }

    @DELETE
    @Path("/{id}")
    @Operation(summary = "Delete an assignment by ID")
    public Response deleteAssignment(@PathParam("id") Long id) {
        assignmentService.delete(id);
        return Response.noContent().build();
    }
}
