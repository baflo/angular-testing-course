import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { setupCourses } from '../common/setup-test-data';
import { CoursesCardListComponent } from './courses-card-list.component';




describe("CoursesCardListComponent", () => {

  let component: CoursesCardListComponent;
  let fixture: ComponentFixture<CoursesCardListComponent>;
  let el: DebugElement;
  let matDialog = jasmine.createSpyObj("MatDialog", ["open"]) as SpyObject<MatDialog>;

  beforeEach(waitForAsync(function () {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: MatDialog,
          useValue: matDialog,
        }
      ],
      declarations: [CoursesCardListComponent]
    }).compileComponents().then(() => {

      fixture = TestBed.createComponent(CoursesCardListComponent);
      component = fixture.componentInstance;
      el = fixture.debugElement;
    });

  }));


  it("should create the component", () => {

    expect(component).toBeTruthy();

  });


  it("should display the course list", () => {

    component.courses = setupCourses();

    // Looks for changes in any ng template expression and if changes are detected then the DOM
    // is going to be updated with the latest data
    fixture.detectChanges();


    const cards = el.queryAll(By.css(".course-card"));

    expect(cards).toBeTruthy("Could not find cards");
    expect(cards.length).toBe(12, "Unexpected number of courses");
  });


  it("should display the first course", () => {

    component.courses = setupCourses();

    fixture.detectChanges();

    const course = component.courses[0];

    const card = el.query(By.css(".course-card:first-child"));
    const title = card.query(By.css("mat-card-title"));
    const image = card.query(By.css("img"));

    expect(card).toBeTruthy("Could not find course card");

    expect(title.nativeElement.textContent).toBe(course.titles.description);
    expect(image.nativeElement.src).toBe(course.iconUrl);
  });

  describe("#editCourse", function () {

    it("opens a dialog", () => {
      // *** This spec does not require `fakeAsync` ***
      // This spec is completely synchronous, as it mocks the `afterClosed`
      // method of `DialogRef` and returns a synchronous observable by using `of`.

      matDialog.open.and.returnValue({
        afterClosed() {
          return of(component.courses[1]);
        }
      } as MatDialogRef<any>);

      component.courses = setupCourses();
      fixture.detectChanges();

      let eventCalled = false;
      component.courseEdited.subscribe(() => {
        eventCalled = true;
      });

      component.editCourse(component.courses[0]);
      expect(eventCalled).toBeTrue();
    });
  });
});


