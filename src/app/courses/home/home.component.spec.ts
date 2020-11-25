import { async, ComponentFixture, fakeAsync, flush, flushMicrotasks, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { CoursesModule } from '../courses.module';
import { DebugElement } from '@angular/core';

import { HomeComponent } from './home.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CoursesService } from '../services/courses.service';
import { HttpClient } from '@angular/common/http';
import { COURSES } from '../../../../server/db-data';
import { setupCourses } from '../common/setup-test-data';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { click } from '../common/test-utils';
import { fake } from 'cypress/types/sinon';




describe('HomeComponent', () => {

  let fixture: ComponentFixture<HomeComponent>;
  let component: HomeComponent;
  let el: DebugElement;

  let coursesService: SpyObject<CoursesService>;

  const advancedCourses = setupCourses().filter(course => course.category === "ADVANCED");
  const beginnerCourses = setupCourses().filter(course => course.category === "BEGINNER");

  beforeEach(waitForAsync(() => {
    let coursesServiceSpy: SpyObject<CoursesService> = jasmine.createSpyObj("CoursesService", ["findAllCourses"]);

    TestBed.configureTestingModule({
      imports: [
        CoursesModule,
        NoopAnimationsModule,
      ],
      providers: [
        {
          provide: CoursesService,
          useValue: coursesServiceSpy,
        }
      ]
    }).compileComponents().then(() => {

      fixture = TestBed.createComponent(HomeComponent);
      component = fixture.componentInstance;
      el = fixture.debugElement;

      coursesService = TestBed.inject(CoursesService) as any;
    })

  }));

  it("should create the component", () => {

    expect(component).toBeTruthy();

  });


  it("should display only beginner courses", () => {
    // `of` creates an observable that **immediately** emits its value. All of this is done
    // synchronously, the emission and the completion. This is, this spec can be completely
    // synchronous!!!
    coursesService.findAllCourses.and.returnValue(of(beginnerCourses));

    fixture.detectChanges();

    const tabs = el.queryAll(By.css(".mat-tab-label"));

    expect(tabs.length).toBe(1, "Unexpected number of tabs");
  });


  it("should display only advanced courses", () => {
    // `of` creates an observable that **immediately** emits its value. All of this is done
    // synchronously, the emission and the completion. This is, this spec can be completely
    // synchronous!!!
    coursesService.findAllCourses.and.returnValue(of(advancedCourses));

    fixture.detectChanges();

    const tabs = el.queryAll(By.css(".mat-tab-label"));

    expect(tabs.length).toBe(1, "Unexpected number of tabs");
  });


  it("should display both tabs", () => {
    // `of` creates an observable that **immediately** emits its value. All of this is done
    // synchronously, the emission and the completion. This is, this spec can be completely
    // synchronous!!!
    coursesService.findAllCourses.and.returnValue(of(setupCourses()));

    fixture.detectChanges();

    const tabs = el.queryAll(By.css(".mat-tab-label"));

    expect(tabs.length).toBe(2, "Unexpected number of tabs");
  });


  it("should display advanced courses when tab clicked -- fakeAsync", fakeAsync(() => {
    // `of` creates an observable that **immediately** emits its value. All of this is done
    // synchronously, the emission and the completion. This is, this spec can be completely
    // synchronous!!!
    coursesService.findAllCourses.and.returnValue(of(setupCourses()));

    fixture.detectChanges();

    const [beginnerTab, advancedTab] = el.queryAll(By.css(".mat-tab-label"));
    click(advancedTab);

    fixture.detectChanges();
    flush();

    const cardTitles = el.queryAll(By.css(".mat-tab-body-active .mat-card-title"));
    expect(cardTitles).toBeTruthy();
    expect(cardTitles[0].nativeElement.textContent).toContain("Angular Security Course");
  }));

  it("should display advanced courses when tab clicked -- waitForAsync", waitForAsync(() => {
    // `of` creates an observable that **immediately** emits its value. All of this is done
    // synchronously, the emission and the completion. This is, this spec can be completely
    // synchronous!!!
    coursesService.findAllCourses.and.returnValue(of(setupCourses()));

    fixture.detectChanges();

    const [beginnerTab, advancedTab] = el.queryAll(By.css(".mat-tab-label"));
    click(advancedTab);

    fixture.detectChanges();
    fixture.whenStable().then(() => {
      console.log("called whenStable()");

      const cardTitles = el.queryAll(By.css(".mat-tab-body-active .mat-card-title"));
      expect(cardTitles).toBeTruthy();
      expect(cardTitles[0].nativeElement.textContent).toContain("Angular Security Course");
    });
  }));

  it("should display advanced courses when tab clicked -- Typescript async", async () => {
    // `of` creates an observable that **immediately** emits its value. All of this is done
    // synchronously, the emission and the completion. This is, this spec can be completely
    // synchronous!!!
    coursesService.findAllCourses.and.returnValue(of(setupCourses()));

    fixture.detectChanges();

    const [beginnerTab, advancedTab] = el.queryAll(By.css(".mat-tab-label"));
    click(advancedTab);

    fixture.detectChanges();
    await fixture.whenStable();

    console.log("called whenStable()");

    const cardTitles = el.queryAll(By.css(".mat-tab-body-active .mat-card-title"));
    expect(cardTitles).toBeTruthy();
    expect(cardTitles[0].nativeElement.textContent).toContain("Angular Security Course");
  });

});


