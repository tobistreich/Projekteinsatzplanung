import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Path;
import java.util.List;
import jakarta.transaction.Transactional;
import jakarta.inject.Inject;

@Inject
EmployeeService employeeService;

@Path("/api/employees")
public class EmployeeResource {

    

    @GET
    public List<Employee> getAll() {
    return Employee.listAll();
    }


    @GET
    @Path("/{id}")
    public Employee getById(@PathParam("id") Long id) {
        return Employee.findById(id);
    }

    @POST
    @Transactional
    public Employee addEmployee(Employee employee) {
        employee.persist();
        return employee;
    }
    
    @PUT
    @Transactional
    @Path("/{id}")
    public Employee updateEmployee(@PathParam("id") Long id, Employee employee) {
        Employee existingEmployee = Employee.findById(id);
        if (existingEmployee != null) {
            existingEmployee.firstName = employee.firstName;
            existingEmployee.lastName = employee.lastName;
            existingEmployee.jobTitle = employee.jobTitle;
            existingEmployee.persist();
        }
        return existingEmployee;
    }

    @DELETE
    @Transactional
    @Path("/{id}")
    public Employee deleteEmployee(@PathParam("id") Long id) {
        Employee employee = Employee.findById(id);
        if (employee != null) {
            employee.delete();
        }
        return employee;
    }

    @GET
    @Path("/{id}/workload")
    public double getWorkload(@PathParam("id") Long id) {
        List<Assignment> assignments = Assignment.find("employeeId", id).list();
        double totalWorkload = 0;
        for (Assignment assignment : assignments) {
            totalWorkload += assignment.allocation;
        }
        return totalWorkload;
    }
}