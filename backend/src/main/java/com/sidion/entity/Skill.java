import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Entity;

import jakarta.persistence.Table;

@Entity
@Table(name = "skill")
public class Skill extends PanacheEntity {
    public String name;
}