import {
  async,
  ComponentFixture,
  TestBed,
  inject,
} from "@angular/core/testing";

import { SelectedFieldsComponent } from "./selected-fields.component";
import { DataService } from "src/app/services/data.service";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { DebugElement, Injector } from "@angular/core";
import { UserService } from "src/app/services/user.service";
import { of } from "rxjs";

describe("SelectedFieldsComponent", () => {
  let component: SelectedFieldsComponent;
  let fixture: ComponentFixture<SelectedFieldsComponent>;
  let de: DebugElement;
  let userService: UserService;
  let userInfo = {
    unique_name: "brahmansh.k@rebuscode.com",
    username: "brahmansh.k@rebuscode.com",
    userid: "12480",
    CustomerID: "145",
    subrole: "0",
    CustomerName: "Rebuscode",
    plan: "beta-enterprise",
    app: "dashboard",
  };
  let dataService: DataService;
  let dataServiceResSpy: jasmine.Spy;
  let dataServiceErrSpy: jasmine.Spy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [SelectedFieldsComponent],
      providers: [DataService, UserService],
    }).compileComponents();
    userService = new UserService();
    userService.setUserInfo(userInfo);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectedFieldsComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    dataService = de.injector.get(DataService);
    fixture.detectChanges();
  });

  it("should create component", () => {
    expect(component).toBeTruthy();
  });

  it("should ngOnchanges be called properly", () => {
    dataServiceResSpy = spyOn(dataService, "getFilterOptions").and.returnValue(
      of( 
        {v23: {
          text: "NPS",
          code: "v23",
          options: {
            "1": { text: "Detractor", code: "1", sequance: 1, child: null },
          },
        }})
    );

    let changes = {
      selectedFields: {
        previousValue: [],
        currentValue: [
          {
            id: 36,
            subscriptionId: "145",
            pipelineID: 1,
            variableName: "v23",
            variableText: "NPS",
            variableGUID: "eaa11294-6b69-204a-e455-f81ef364f9ac",
            questionGUID: "2712fe55-3318-33ad-3e87-d72433825784",
            variableType: 1,
            page: "home",
          },
        ],
        firstChange: false,
      },
    };
    component.selectedFields = [
      {
        id: 36,
        subscriptionId: "145",
        pipelineID: 1,
        variableName: "v23",
        variableText: "NPS",
        variableGUID: "eaa11294-6b69-204a-e455-f81ef364f9ac",
        questionGUID: "2712fe55-3318-33ad-3e87-d72433825784",
        variableType: 1,
        page: "home",
      },
    ];

    component.ngOnChanges(changes);
    // component.getSelectedVariableOptions()

    expect(dataServiceResSpy).toHaveBeenCalled();
    // expect(component.variablesOptions).toBeDefined()
    // @ts-ignore
    // component.createOptionList()
    

    expect(component.variablesOptions).toBeDefined();
  });

  it("should createOptionList add options in selected variables", () => {
    component.variablesOptions = {
      v3: {
        text: "NPS",
        code: "v3",
        options: {
          "1": { text: "Detractor", code: "1", sequance: 1, child: null },
        },
      },
    };
    const expectedResult = {
      v3: {
        text: "NPS",
        code: "v3",
        options: {
          "1": { text: "Detractor", code: "1", sequance: 1, child: null },
        },
        optionList: [
          { text: "Detractor", code: "1", sequance: 1, child: null },
        ],
        selectedFilter: "",
      },
    };

    //@ts-ignore
    component.createOptionList();

    expect(component.variablesOptions).toEqual(expectedResult);
  });

  it("should emitFilterChange return if isOpen is true or Selectionmade is false", () => {
    //@ts-ignore
    component.selectionMade = false;

    const returnValue = component.emitFilterChange(false);
    expect(returnValue).toBeUndefined();
  });

  it("should emitFilterChange work if isOpen is false or Selectionmade is true", () => {
    component.variablesOptions = {
      v3: {
        text: "NPS",
        code: "v3",
        options: {
          "1": { text: "Detractor", code: "1", sequance: 1, child: null },
        },
        optionList: [
          { text: "Detractor", code: "1", sequance: 1, child: null },
        ],
        selectedFilter: "",
      },
    };
    //@ts-ignore
    component.selectionMade = true;

    component.emitFilterChange(false);
    //@ts-ignore
    expect(component.selectionMade).toBe(false);
  });

  it("should onFilterChange work properly", () => {
    //@ts-ignore
    component.selectionMade = false;
    //@ts-ignore
    component.onFilterSelectionChange();
    //@ts-ignore
    expect(component.selectionMade).toBe(true);
  });
});
