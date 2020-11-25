import { DebugElement } from "@angular/core";
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from "@angular/core/testing";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { ActivatedRoute } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { MockProvider } from "ng-mocks";
import { of } from "rxjs";
import { COURSES, findLessonsForCourse } from "../../../../server/db-data";
import { CoursesModule } from "../courses.module";
import { Lesson } from "../model/lesson";
import { CoursesService } from "../services/courses.service";
import { CourseComponent } from "./course.component";

describe("CourseComponent", function () {

  let component: CourseComponent;
  let fixture: ComponentFixture<CourseComponent>;
  let el: DebugElement;
  let coursesService: SpyObject<Pick<CoursesService, "findLessons">>;

  beforeEach(waitForAsync(function () {
    coursesService = jasmine.createSpyObj("CoursesService", ["findLessons"]);
    coursesService.findLessons.and.callFake((courseId) => of(findLessonsForCourse(courseId)));

    TestBed.configureTestingModule({
      imports: [
        CoursesModule,
        RouterTestingModule,
        NoopAnimationsModule,
      ],
      providers: [
        MockProvider(CoursesService, coursesService),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                course: COURSES["12"],
              }
            }
          }
        }
      ],
      declarations: [CourseComponent]
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(CourseComponent);
      component = fixture.componentInstance;
      el = fixture.debugElement;
    });
  }));

  it("is created", function () {
    expect(component).toBeTruthy();
  });

  it("is initialized", async function () {
    fixture.detectChanges();

    let lessons: Lesson[];
    component.dataSource.connect({} as any).subscribe(data => {
      lessons = data;
    });

    expect(lessons).toEqual(findLessonsForCourse(12), "Unexpected list of lessons");
  });

  it("resets page index on sort change", function () {
    fixture.detectChanges();

    component.paginator.nextPage();
    expect(component.paginator.pageIndex).toBe(1);

    component.sort.sort({
      id: "description",
      start: "asc",
      disableClear: false,
    });

    expect(component.paginator.pageIndex).toBe(0);
  });


it("resets page index on search", fakeAsync(function () {
    fixture.detectChanges();

    let lessons: Lesson[];
    component.dataSource.connect({} as any).subscribe(data => {
      lessons = data;
    });

    component.paginator.nextPage();
    expect(component.paginator.pageIndex).toBe(1);

    const input: HTMLInputElement = component.input.nativeElement;
    input.value = "testing";
    input.dispatchEvent(new Event("keyup"));
    // tick(149);
    tick(150);

    expect(component.paginator.pageIndex).toBe(0);
    expect(coursesService.findLessons).toHaveBeenCalledWith(12, "testing", "asc", 0 , 3);
  }));
});