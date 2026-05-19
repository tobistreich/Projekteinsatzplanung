import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Path;
import java.util.List;
import jakarta.transaction.Transactional;

@Path("/api/assignments")
public class AssignmentResource {

    @GET
    public List<Assignment> getAll() {
        return Assignment.listAll();
    }

    @GET
    @Path("/{id}")
    public Assignment getById(@PathParam("id") Long id) {
        return Assignment.findById(id);
    }

    @POST
    @Transactional
    public Assignment addAssignment(Assignment assignment) {
        assignment.persist();
        return assignment;
    }
    
    @PUT
    @Path("/{id}")
    @Transactional
    public Assignment updateAssignment(@PathParam("id") Long id, Assignment assignment) {
        Assignment existingAssignment = Assignment.findById(id);
        if (existingAssignment != null) {
            existingAssignment.employeeId = assignment.employeeId;
            existingAssignment.projectId = assignment.projectId;
            existingAssignment.startDate = assignment.startDate;
            existingAssignment.endDate = assignment.endDate;
            existingAssignment.allocation = assignment.allocation;
            existingAssignment.type = assignment.type;
            existingAssignment.persist();
        }
        return existingAssignment;
    }

    @DELETE
    @Path("/{id}")
    @Transactional
    public Assignment deleteAssignment(@PathParam("id") Long id) {
        Assignment assignment = Assignment.findById(id);
        if (assignment != null) {
            assignment.delete();
        }
        return assignment;
    }
}