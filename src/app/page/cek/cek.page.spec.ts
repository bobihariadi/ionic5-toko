import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CekPage } from './cek.page';

describe('CekPage', () => {
  let component: CekPage;
  let fixture: ComponentFixture<CekPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CekPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CekPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
