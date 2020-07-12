import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModaltipePage } from './modaltipe.page';

describe('ModaltipePage', () => {
  let component: ModaltipePage;
  let fixture: ComponentFixture<ModaltipePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModaltipePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModaltipePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
