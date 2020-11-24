import { HttpErrorResponse } from "@angular/common/http";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { COURSES, findLessonsForCourse, LESSONS } from "../../../../server/db-data";
import { Course } from "../model/course";
import { CoursesService } from "./courses.service";

describe("CoursesService", function () {
  let coursesService: CoursesService;
  let httpTestingController: HttpTestingController;


  beforeEach(async function () {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CoursesService,
      ]

    })

    coursesService = TestBed.inject(CoursesService);
    httpTestingController = TestBed.inject(HttpTestingController)
  });

  afterEach(() => {

    // Assert no other request are made by using `verify`
    httpTestingController.verify();

  })


  it("should retrieve all courses", async function () {
    coursesService.findAllCourses()
      .subscribe(courses => {
        expect(courses).toBeTruthy("No courses returned");

        expect(courses.length).toBe(12, "Incorrect number of courses");

        const course = courses.find(course => course.id === 12);
        expect(course.titles.description).toEqual("Angular Testing Course");
      })

    const req = httpTestingController.expectOne("/api/courses");
    expect(req.request.method).toEqual("GET");

    // This provides data to a request and will result in the "subscribe-block" being run
    // This will synchronously run the "subscribe-block"!!
    req.flush({ "payload": Object.values(COURSES) });
  });

  it("should find a course by its id", async function () {
    coursesService.findCourseById(12)
      .subscribe(course => {
        expect(course).toBeTruthy();
        expect(course.id).toBe(12);
      })

    const req = httpTestingController.expectOne("/api/courses/12");
    expect(req.request.method).toBe("GET");

    req.flush(COURSES[12]);
  });


  it("should save the course data", async function () {
    const changes: Partial<Course> = { titles: { description: "Testing Course" } };
    coursesService.saveCourse(12, changes).subscribe(course => {
      expect(course.id).toBe(12)
    });

    const req = httpTestingController.expectOne("/api/courses/12");

    expect((req.request.method)).toBe("PUT");
    expect(req.request.body.titles.description).toEqual(changes.titles.description);

    req.flush({
      ...COURSES[12],
      ...changes,
    });
  });

  it("should give an error if save course fails", async function () {
    const changes: Partial<Course> = { titles: { description: "Testing Course" } };

    coursesService.saveCourse(12, changes).subscribe(
      () => fail("The save course operation should have failed."),
      (error: HttpErrorResponse) => {
        expect(error.status).toBe(500);
      }
    );

    const req = httpTestingController.expectOne("/api/courses/12");
    expect(req.request.method).toBe("PUT");

    req.flush("Save course failed", {
      status: 500,
      statusText: "Internal Server Error",
    });
  });

  it("should find a list of lessons", async function () {
    coursesService.findLessons(12)
      .subscribe(lessons => {
        expect(lessons).toBeTruthy();

        expect(lessons.length).toBe(3, "Wrong number of lessons returned");
      });


    const req = httpTestingController.expectOne(req => req.url === "/api/lessons");
    expect(req.request.method).toBe("GET");

    expect(req.request.params.get("courseId")).toEqual("12");
    expect(req.request.params.get("filter")).toEqual("");
    expect(req.request.params.get("sortOrder")).toEqual("asc");
    expect(req.request.params.get("pageNumber")).toEqual("0");
    expect(req.request.params.get("pageSize")).toEqual("3", "Wrong param pageSize");

    req.flush({
      payload: findLessonsForCourse(12).slice(0, 3),
    });
  });

});