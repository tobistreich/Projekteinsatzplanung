import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Path;

@Path("/api/employees")
public class EmployeeResource {

    @GET
    public String getAll() {
        return "Alle Mitarbeiter";
    }

    @GET
    @Path("/{id}")
    public String getById(@PathParam("id") Long id) {
        return "Mitarbeiter mit ID: " + id;
    }

    @POST
    public String addEmployee() {
        return "Mitarbeiter hinzugefügt";
    }
    
    @PUT
    @Path("/{id}")
    public String updateEmployee(@PathParam("id") Long id) {
        return "Mitarbeiter mit ID: " + id + " aktualisiert";
    }
    @DELETE
    @Path("/{id}")
    public String deleteEmployee(@PathParam("id") Long id) {
        return "Mitarbeiter mit ID: " + id + " gelöscht";
    }

    @GET
    @Path("/{id}/workload")
    public String getWorkload(@PathParam("id") Long id) {
        return "Arbeitslast für Mitarbeiter mit ID: " + id;
    }
}