import { DebugElement } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { MockProvider } from "ng-mocks";
import { of } from "rxjs";
import { COURSES } from "../../../../server/db-data";
import { CoursesModule } from "../courses.module";
import { Course } from "../model/course";
import { CoursesService } from "../services/courses.service";
import { CourseDialogComponent } from "./course-dialog.component";

describe("CourseDialogComponent", function () {

  let fixture: ComponentFixture<CourseDialogComponent>;
  let component: CourseDialogComponent;
  let el: DebugElement;

  let coursesService: SpyObject<Pick<CoursesService, "saveCourse">>;
  let matDialogRef: SpyObject<MatDialogRef<Course>>;
  
  beforeEach(async function () {
    coursesService = jasmine.createSpyObj("CoursesService", ["saveCourse"]);
    coursesService.saveCourse.and.callFake((courseId, changes) => of({
      ...COURSES[courseId],
      ...changes,
    }));
    matDialogRef = jasmine.createSpyObj("MatDialogRef", ["close"])

    TestBed.configureTestingModule({
      imports: [CoursesModule, NoopAnimationsModule],
      declarations: [CourseDialogComponent],
      providers: [
        MockProvider(CoursesService, coursesService),
        MockProvider(MatDialogRef, matDialogRef),
        {
          provide: MAT_DIALOG_DATA, 
          useValue: COURSES["12"],
        },
      ]
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(CourseDialogComponent);
      component = fixture.componentInstance;
      el = fixture.debugElement;
    });
  });

  it("is created", function () {
    expect(component).toBeTruthy();
  });

  it("is initialized", function () {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });


  it("closes the dialog", function () {
    fixture.detectChanges();
    component.close();
    expect(matDialogRef.close).toHaveBeenCalledTimes(1);
  });

  it("saves the course and closes the dialog", function () {
    fixture.detectChanges();
    component.save();

    expect(coursesService.saveCourse).toHaveBeenCalled();
    expect(matDialogRef.close).toHaveBeenCalledTimes(1);
  });
});