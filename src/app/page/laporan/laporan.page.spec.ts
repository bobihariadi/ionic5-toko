import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LaporanPage } from './laporan.page';

describe('LaporanPage', () => {
  let component: LaporanPage;
  let fixture: ComponentFixture<LaporanPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LaporanPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LaporanPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
