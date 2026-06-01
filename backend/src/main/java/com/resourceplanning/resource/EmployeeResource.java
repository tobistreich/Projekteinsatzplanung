package com.resourceplanning.resource;

import com.resourceplanning.dto.CreateEmployeeDto;
import com.resourceplanning.dto.EmployeeDto;
import com.resourceplanning.dto.UpdateEmployeeDto;
import com.resourceplanning.service.EmployeeService;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;

import java.util.List;

@Path("/api/employees")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@ApplicationScoped
@Tag(name = "Employees")
public class EmployeeResource {

    @Inject
    EmployeeService employeeService;

    @GET
    @Operation(summary = "Get all employees")
    public List<EmployeeDto> getAllEmployees() {
        return employeeService.getAll();
    }

    @GET
    @Path("/{id}")
    @Operation(summary = "Get employee by ID")
    public EmployeeDto getEmployeeById(@PathParam("id") Long id) {
        return employeeService.getById(id);
    }

    @POST
    @Operation(summary = "Create a new employee")
    public Response createEmployee(CreateEmployeeDto dto) {
        return Response.status(Response.Status.CREATED)
                .entity(employeeService.create(dto))
                .build();
    }

    @PATCH
    @Path("/{id}")
    @Operation(summary = "Update an employee by ID")
    public EmployeeDto updateEmployee(@PathParam("id") Long id, UpdateEmployeeDto dto) {
        return employeeService.update(id, dto);
    }

    @DELETE
    @Path("/{id}")
    @Operation(summary = "Delete an employee by ID")
    public Response deleteEmployee(@PathParam("id") Long id) {
        employeeService.delete(id);
        return Response.noContent().build();
    }
}