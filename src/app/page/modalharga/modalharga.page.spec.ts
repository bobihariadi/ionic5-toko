import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModalhargaPage } from './modalharga.page';

describe('ModalhargaPage', () => {
  let component: ModalhargaPage;
  let fixture: ComponentFixture<ModalhargaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalhargaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalhargaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
