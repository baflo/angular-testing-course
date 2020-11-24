import { fakeAsync, flush, tick, flushMicrotasks } from "@angular/core/testing";
import { of } from "rxjs";
import { delay } from "rxjs/operators";

describe("Async Testing Examples", () => {

  it("Asynchronous test example with Jasmine done()", async function (done: DoneFn) {

    let test = false;

    setTimeout(() => {
      console.log("running assertions");
      test = true;
      expect(test).toBeTruthy();

      done();
    }, 1000);
  });

  it("Asynchronous test example -- setTimeout", fakeAsync(function () {
    // fakeAsync creates a async zone that observes many browser integrated async operations
    // including setTimeout and setInterval. When the function is left, the zone is
    // closed. The zone can see which operations still haven't finished and will throw
    // an error, if the zone was left with some timers left.

    let test = false

    setTimeout(() => {
      console.log("running assertions setTimeout()");
      test = true;
    }, 1000);

    flush();
    expect(test).toBeTrue()
  }));

  it("Asynchronous test example -- plain Promise", fakeAsync(function () {
    let test = false;

    console.log("Createing promise");

    Promise.resolve().then(() => {
      console.log("Promise evaluated successfullly");
      test = true;
    });

    flushMicrotasks();

    console.log("Running assertions.");
    expect(test).toBeTrue();
  }));

  it("Asynchronous test example -- Promises + setTimeout()", fakeAsync(function () {
    let counter = 0;

    Promise.resolve()
      .then(() => new Promise(resolve => {
        counter += 10;

        setTimeout(() => {
          counter += 1;
          resolve();
        }, 1000);
      }))
      .then(() => {
        counter += 10;
      })

    flushMicrotasks()
    expect(counter).toBe(10);

    tick(600);
    expect(counter).toBe(10);
    
    flush();
    expect(counter).toBe(21);
  }));

  it("Asynchronous test example -- immediate Observable", function () {
    let test = false;

    console.log("Creating Observable");

    const test$ = of(test);

    test$.subscribe(() => {
      test = true;
    });

    console.log("Running test assertions");
    expect(test).toBeTrue();
  });
      

  it("Asynchronous test example -- Observables", fakeAsync(function () {
    let test = false;

    console.log("Creating Observable");

    const test$ = of(test).pipe(delay(1000));

    test$.subscribe(() => {
      test = true;
    });

    tick(1000000);
    // flushMicrotasks();
    // flush();

    console.log("Running test assertions");
    expect(test).toBeTrue();
  }));
      
})