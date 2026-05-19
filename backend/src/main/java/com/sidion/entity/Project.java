import io.quarkus.hibernate.orm.panache.PanacheEntity;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "project")
public class Project extends PanacheEntity {
    public String title;

    @Column(name = "start_date")
    public LocalDate startDate;

    @Column(name = "end_date")
    public LocalDate endDate;

    @Column(name = "planned_days")
    public double plannedDays;

    public String status;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "project_skill",
        joinColumns = @JoinColumn(name = "project_id"),
        inverseJoinColumns = @JoinColumn(name = "skill_id"))
    public List<Skill> skills = new ArrayList<>();
}