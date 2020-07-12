import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ListtipePage } from './listtipe.page';

describe('ListtipePage', () => {
  let component: ListtipePage;
  let fixture: ComponentFixture<ListtipePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListtipePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ListtipePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
