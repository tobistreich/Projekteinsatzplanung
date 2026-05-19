import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Path;
import java.util.List;
import jakarta.transaction.Transactional;

@Path("/api/skills")
public class SkillResource {

    @GET
    public List<Skill> getAll() {
        return Skill.listAll();
    }

    @POST
    @Transactional
    public Skill addSkill(Skill skill) {
        skill.persist();
        return skill;
    }
    
    @DELETE
    @Transactional
    @Path("/{id}")
    public Skill deleteSkill(@PathParam("id") Long id) {
        Skill skill = Skill.findById(id);
        if (skill != null) {
            skill.delete();
        }
        return skill;
    }
}