import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Path;

@Path("/api/assignments")
public class AssignmentResource {

    @GET
    public String getAll() {
        return "Alle Zuweisungen";
    }

    @GET
    @Path("/{id}")
    public String getById(@PathParam("id") Long id) {
        return "Zuweisung mit ID: " + id;
    }

    @POST
    public String addAssignment() {
        return "Zuweisung hinzugefügt";
    }
    
    @PUT
    @Path("/{id}")
    public String updateAssignment(@PathParam("id") Long id) {
        return "Zuweisung mit ID: " + id + " aktualisiert";
    }

    @DELETE
    @Path("/{id}")
    public String deleteAssignment(@PathParam("id") Long id) {
        return "Zuweisung mit ID: " + id + " gelöscht";
    }
}