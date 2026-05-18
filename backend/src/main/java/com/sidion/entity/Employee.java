import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;

@Entity
public class Employee extends PanacheEntity {
    @Column(name = "first_name")
    public String firstName;

   @Column(name = "last_name")
    public String lastName;

    @Column(name = "job_title")
    public String jobTitle;}
}