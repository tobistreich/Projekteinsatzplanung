import io.quarkus.hibernate.orm.panache.PanacheEntity;
import java.time.LocalDate;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Enumerated;
import jakarta.persistence.EnumType;
import jakarta.persistence.Table;

@Entity
@Table(name = "assignment")
public class Assignment extends PanacheEntity {

    @Column(name = "employee_id")
    public Long employeeId;

    @Column(name = "project_id")
    public Long projectId;

    @Column(name = "start_date")
    public LocalDate startDate;

    @Column(name = "end_date")
    public LocalDate endDate;

    public double allocation;

    @Enumerated(EnumType.STRING)
    public AssignmentType type;
}