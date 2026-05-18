import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Path;

@Path("/api/skills")
public class SkillResource {

    @GET
    public String getAll() {
        return "Alle Fähigkeiten";
    }

    @POST
    public String addSkill() {
        return "Fähigkeit hinzugefügt";
    }
    
    @DELETE
    @Path("/{id}")
    public String deleteSkill(@PathParam("id") Long id) {
        return "Fähigkeit mit ID: " + id + " gelöscht";
    }
}