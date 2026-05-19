
import jakarta.enterprise.context.ApplicationScoped;
import java.util.List;
import java.util.stream.Collectors;

@ApplicationScoped
public class EmployeeService {

    public List<EmployeeDTO> getAllEmployees() {
        List<Employee> employees = Employee.listAll();
        return employees.stream().map(this::toDTO).collect(Collectors.toList());
    }

    public EmployeeDTO getEmployeeById(Long id) {
        Employee employee = Employee.findById(id);
        if (employee != null) {
            return toDTO(employee);
        }
        return null;
    }

    public EmployeeDTO toDTO(Employee employee) {
        EmployeeDTO dto = new EmployeeDTO();
        dto.firstName = employee.firstName;
        dto.lastName = employee.lastName;
        dto.jobTitle = employee.jobTitle;
        dto.skillIds = employee.skills.stream().map(skill -> skill.id).collect(Collectors.toList());
        return dto;
    }
}