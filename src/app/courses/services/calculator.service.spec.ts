import { TestBed } from "@angular/core/testing";
import { CalculatorService } from "./calculator.service";
import { LoggerService } from "./logger.service";

describe("CalculatorService", () => {
  let loggerSpy: SpyObject<LoggerService>
  let calculator: CalculatorService

  beforeEach(async function () {
    loggerSpy = jasmine.createSpyObj("LoggerService", ["log"]);
    
    TestBed.configureTestingModule({
      providers: [
        CalculatorService,
        {
          provide: LoggerService,
          useValue: loggerSpy,
        }
      ]
    })


    calculator = TestBed.inject(CalculatorService);
  });

  it("should add two numbers", async function () {
    const result = calculator.add(2, 2);

    expect(result).toBe(4);
    expect(loggerSpy.log).toHaveBeenCalledTimes(1);
  });

  it("should substract two numbers", async function () {
    const result = calculator.subtract(2, 2);

    expect(result).toBe(0, "unexpected substraction result");
    expect(loggerSpy.log).toHaveBeenCalledTimes(1);
  });

});
