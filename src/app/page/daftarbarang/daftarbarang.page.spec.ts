import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DaftarbarangPage } from './daftarbarang.page';

describe('DaftarbarangPage', () => {
  let component: DaftarbarangPage;
  let fixture: ComponentFixture<DaftarbarangPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DaftarbarangPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DaftarbarangPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
