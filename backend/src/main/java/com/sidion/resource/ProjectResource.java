import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Path;
import java.util.List;
import jakarta.transaction.Transactional;


@Path("/api/projects")
public class ProjectResource {

    @GET
    public List<Project> getAll() {
        return Project.listAll();
    }

    @GET
    @Path("/{id}")
    public Project getById(@PathParam("id") Long id) {
        return Project.findById(id);
    }

    @POST
    @Transactional
    public Project addProject(Project project) {
        project.persist();
        return project;
    }
    
    @PUT
    @Transactional
    @Path("/{id}")
    public Project updateProject(@PathParam("id") Long id, Project project) {
        Project existingProject = Project.findById(id);
        if (existingProject != null) {
            existingProject.title = project.title;
            existingProject.startDate = project.startDate;
            existingProject.endDate = project.endDate;
            existingProject.plannedDays = project.plannedDays;
            existingProject.status = project.status;
            existingProject.persist();
        }
        return existingProject;
    }
    @DELETE
    @Transactional
    @Path("/{id}")
    public Project deleteProject(@PathParam("id") Long id) {
        Project project = Project.findById(id);
        if (project != null) {
            project.delete();
        }
        return project;
    }

    @GET
    @Path("/{id}/matching")
    public List<Employee> getMatchingEmployees(@PathParam("id") Long id) {
        Project project = Project.findById(id);
        if (project != null) {
            // TODO: Skill-Matching Logik im Service-Layer implementieren
        return Employee.listAll();
        }
        return null;
    }
}