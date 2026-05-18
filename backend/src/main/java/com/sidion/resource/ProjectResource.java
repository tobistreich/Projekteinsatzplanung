import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Path;

@Path("/api/projects")
public class ProjectResource {

    @GET
    public String getAll() {
        return "Alle Projekte";
    }

    @GET
    @Path("/{id}")
    public String getById(@PathParam("id") Long id) {
        return "Projekt mit ID: " + id;
    }

    @POST
    public String addProject() {
        return "Projekt hinzugefügt";
    }
    
    @PUT
    @Path("/{id}")
    public String updateProject(@PathParam("id") Long id) {
        return "Projekt mit ID: " + id + " aktualisiert";
    }
    @DELETE
    @Path("/{id}")
    public String deleteProject(@PathParam("id") Long id) {
        return "Projekt mit ID: " + id + " gelöscht";
    }

    @GET
    @Path("/{id}/matching")
    public String getMatching(@PathParam("id") Long id) {
        return "Übereinstimmungen für Projekt mit ID: " + id;
    }
}