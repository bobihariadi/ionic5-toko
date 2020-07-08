import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BeliPage } from './beli.page';

describe('BeliPage', () => {
  let component: BeliPage;
  let fixture: ComponentFixture<BeliPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BeliPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BeliPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
