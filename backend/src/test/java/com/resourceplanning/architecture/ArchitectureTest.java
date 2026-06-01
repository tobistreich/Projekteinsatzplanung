package com.resourceplanning.architecture;

import com.tngtech.archunit.core.domain.JavaClasses;
import com.tngtech.archunit.core.importer.ClassFileImporter;
import com.tngtech.archunit.core.importer.ImportOption;
import com.tngtech.archunit.junit.AnalyzeClasses;
import com.tngtech.archunit.junit.ArchTest;
import com.tngtech.archunit.lang.ArchRule;
import com.tngtech.archunit.library.dependencies.SlicesRuleDefinition;
import org.junit.jupiter.api.Test;

import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.classes;
import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.noClasses;
import static com.tngtech.archunit.library.Architectures.layeredArchitecture;

@AnalyzeClasses(
        packages = "com.resourceplanning",
        importOptions = {
                ImportOption.DoNotIncludeTests.class,
                ImportOption.DoNotIncludeJars.class
        }
)
public class ArchitectureTest {

    private static final String ROOT       = "com.resourceplanning";
    private static final String ENTITY     = ROOT + ".entity..";
    private static final String REPOSITORY = ROOT + ".repository..";
    private static final String SERVICE    = ROOT + ".service..";
    private static final String RESOURCE   = ROOT + ".resource..";
    private static final String DTO        = ROOT + ".dto..";
    private static final String MAPPER     = ROOT + ".mapper..";

    // -------------------------------------------------------------------------
    // 1. Schichtenarchitektur
    //    resource   → service, dto
    //    service    → repository, entity, dto, mapper
    //    mapper     → entity, dto
    //    repository → entity
    //    entity     → (nichts intern)
    //    dto        → entity  (ProjectDto/ProjectSummaryDto → ProjectStatus)
    // -------------------------------------------------------------------------

    @ArchTest
    static final ArchRule layerDependencies =
            layeredArchitecture()
                    .consideringOnlyDependenciesInLayers()
                    .layer("Resource")  .definedBy(ROOT + ".resource..")
                    .layer("Service")   .definedBy(ROOT + ".service..")
                    .layer("Mapper")    .definedBy(ROOT + ".mapper..")
                    .layer("Repository").definedBy(ROOT + ".repository..")
                    .layer("Entity")    .definedBy(ROOT + ".entity..")
                    .layer("Dto")       .definedBy(ROOT + ".dto..")
                    .whereLayer("Resource")  .mayOnlyAccessLayers("Service", "Dto")
                    .whereLayer("Service")   .mayOnlyAccessLayers("Repository", "Entity", "Dto", "Mapper")
                    .whereLayer("Mapper")    .mayOnlyAccessLayers("Entity", "Dto")
                    .whereLayer("Repository").mayOnlyAccessLayers("Entity")
                    .whereLayer("Entity")    .mayNotAccessAnyLayer()
                    .whereLayer("Dto")       .mayOnlyAccessLayers("Entity")
                    .as("Schichtenarchitektur: Zugriff nur in erlaubter Richtung");

    @ArchTest
    static final ArchRule resourceMustNotAccessRepository =
            noClasses().that().resideInAPackage(RESOURCE)
                    .should().accessClassesThat().resideInAPackage(REPOSITORY)
                    .as("Resource darf nicht direkt auf Repository zugreifen");

    @ArchTest
    static final ArchRule resourceMustNotAccessEntity =
            noClasses().that().resideInAPackage(RESOURCE)
                    .should().accessClassesThat().resideInAPackage(ENTITY)
                    .as("Resource darf nicht direkt auf Entity zugreifen");

    @ArchTest
    static final ArchRule serviceMustNotAccessResource =
            noClasses().that().resideInAPackage(SERVICE)
                    .should().accessClassesThat().resideInAPackage(RESOURCE)
                    .as("Service darf nicht auf Resource zugreifen");

    @ArchTest
    static final ArchRule repositoryMustNotAccessService =
            noClasses().that().resideInAPackage(REPOSITORY)
                    .should().accessClassesThat().resideInAPackage(SERVICE)
                    .as("Repository darf nicht auf Service zugreifen");

    @ArchTest
    static final ArchRule repositoryMustNotAccessDto =
            noClasses().that().resideInAPackage(REPOSITORY)
                    .should().accessClassesThat().resideInAPackage(DTO)
                    .as("Repository darf nicht auf DTOs zugreifen");

    @ArchTest
    static final ArchRule mapperMustNotAccessService =
            noClasses().that().resideInAPackage(MAPPER)
                    .should().accessClassesThat().resideInAPackage(SERVICE)
                    .as("Mapper darf nicht auf Service zugreifen");

    @ArchTest
    static final ArchRule entityMustNotDependOnInternalLayers =
            noClasses().that().resideInAPackage(ENTITY)
                    .should().accessClassesThat()
                    .resideInAnyPackage(SERVICE, RESOURCE, REPOSITORY, DTO, MAPPER)
                    .as("Entity darf nicht auf andere interne Schichten zugreifen");

    // -------------------------------------------------------------------------
    // 2. Namenskonventionen
    // -------------------------------------------------------------------------

    @ArchTest
    static final ArchRule resourceNaming =
            classes().that().resideInAPackage(RESOURCE).and().areTopLevelClasses()
                    .should().haveSimpleNameEndingWith("Resource")
                    .as("Klassen in ..resource.. müssen auf 'Resource' enden");

    @ArchTest
    static final ArchRule serviceNaming =
            classes().that().resideInAPackage(SERVICE).and().areTopLevelClasses()
                    .should().haveSimpleNameEndingWith("Service")
                    .as("Klassen in ..service.. müssen auf 'Service' enden");

    @ArchTest
    static final ArchRule repositoryNaming =
            classes().that().resideInAPackage(REPOSITORY).and().areTopLevelClasses()
                    .should().haveSimpleNameEndingWith("Repository")
                    .as("Klassen in ..repository.. müssen auf 'Repository' enden");

    @ArchTest
    static final ArchRule mapperNaming =
            classes().that().resideInAPackage(MAPPER).and().areInterfaces()
                    .should().haveSimpleNameEndingWith("Mapper")
                    .as("Mapper-Interfaces in ..mapper.. müssen auf 'Mapper' enden");

    @ArchTest
    static final ArchRule dtoNaming =
            classes().that().resideInAPackage(DTO).and().areTopLevelClasses()
                    .should().haveSimpleNameEndingWith("Dto")
                    .as("Klassen in ..dto.. müssen auf 'Dto' enden");

    // -------------------------------------------------------------------------
    // 3. Annotation-Regeln (Quarkus verwendet jakarta.*, nicht javax.*)
    // -------------------------------------------------------------------------

    @ArchTest
    static final ArchRule resourceHasPathAnnotation =
            classes().that().resideInAPackage(RESOURCE)
                    .should().beAnnotatedWith(jakarta.ws.rs.Path.class)
                    .as("Alle Resource-Klassen müssen @jakarta.ws.rs.Path tragen");

    @ArchTest
    static final ArchRule repositoryImplementsPanacheRepository =
            classes().that().resideInAPackage(REPOSITORY)
                    .should().implement(io.quarkus.hibernate.orm.panache.PanacheRepository.class)
                    .as("Alle Repository-Klassen müssen PanacheRepository implementieren");

    @ArchTest
    static final ArchRule resourceIsApplicationScoped =
            classes().that().resideInAPackage(RESOURCE)
                    .should().beAnnotatedWith(jakarta.enterprise.context.ApplicationScoped.class)
                    .as("Alle Resource-Klassen müssen @ApplicationScoped sein");

    @ArchTest
    static final ArchRule serviceIsApplicationScoped =
            classes().that().resideInAPackage(SERVICE)
                    .should().beAnnotatedWith(jakarta.enterprise.context.ApplicationScoped.class)
                    .as("Alle Service-Klassen müssen @ApplicationScoped sein");

    @ArchTest
    static final ArchRule repositoryIsApplicationScoped =
            classes().that().resideInAPackage(REPOSITORY)
                    .should().beAnnotatedWith(jakarta.enterprise.context.ApplicationScoped.class)
                    .as("Alle Repository-Klassen müssen @ApplicationScoped sein");

    // -------------------------------------------------------------------------
    // 4. Keine Zyklen
    // -------------------------------------------------------------------------

    @ArchTest
    static final ArchRule noCyclesBetweenSlices =
            SlicesRuleDefinition.slices()
                    .matching("com.resourceplanning.(*)..")
                    .should().beFreeOfCycles()
                    .as("Keine Abhängigkeitszyklen zwischen den Sub-Paketen");

    // -------------------------------------------------------------------------
    // Fallback @Test-Methoden — laufen auch ohne ArchUnit-Engine,
    // kein @QuarkusTest nötig (keine Datenbank, kein Container-Start)
    // -------------------------------------------------------------------------

    private static JavaClasses importProductionClasses() {
        return new ClassFileImporter()
                .withImportOption(ImportOption.Predefined.DO_NOT_INCLUDE_TESTS)
                .withImportOption(ImportOption.Predefined.DO_NOT_INCLUDE_JARS)
                .importPackages("com.resourceplanning");
    }

    @Test void test_schichtenarchitektur()         { layerDependencies.check(importProductionClasses()); }
    @Test void test_resourceKeinRepository()       { resourceMustNotAccessRepository.check(importProductionClasses()); }
    @Test void test_resourceKeineEntity()          { resourceMustNotAccessEntity.check(importProductionClasses()); }
    @Test void test_serviceKeinResource()          { serviceMustNotAccessResource.check(importProductionClasses()); }
    @Test void test_repositoryKeinService()        { repositoryMustNotAccessService.check(importProductionClasses()); }
    @Test void test_repositoryKeinDto()            { repositoryMustNotAccessDto.check(importProductionClasses()); }
    @Test void test_mapperKeinService()            { mapperMustNotAccessService.check(importProductionClasses()); }
    @Test void test_entityKeineInternenSchichten() { entityMustNotDependOnInternalLayers.check(importProductionClasses()); }
    @Test void test_resourceNaming()               { resourceNaming.check(importProductionClasses()); }
    @Test void test_serviceNaming()                { serviceNaming.check(importProductionClasses()); }
    @Test void test_repositoryNaming()             { repositoryNaming.check(importProductionClasses()); }
    @Test void test_mapperNaming()                 { mapperNaming.check(importProductionClasses()); }
    @Test void test_dtoNaming()                    { dtoNaming.check(importProductionClasses()); }
    @Test void test_resourceHatPath()              { resourceHasPathAnnotation.check(importProductionClasses()); }
    @Test void test_repositoryPanache()            { repositoryImplementsPanacheRepository.check(importProductionClasses()); }
    @Test void test_resourceScoped()               { resourceIsApplicationScoped.check(importProductionClasses()); }
    @Test void test_serviceScoped()                { serviceIsApplicationScoped.check(importProductionClasses()); }
    @Test void test_repositoryScoped()             { repositoryIsApplicationScoped.check(importProductionClasses()); }
    @Test void test_keineZyklen()                  { noCyclesBetweenSlices.check(importProductionClasses()); }
}
