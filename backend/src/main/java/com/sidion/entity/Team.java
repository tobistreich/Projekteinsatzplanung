import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.Column;

import jakarta.persistence.Table;

@Entity
@Table(name = "team")
public class Team extends PanacheEntity {
    public String name;

    @Column(name = "team_lead")
    public Long teamLead;

}