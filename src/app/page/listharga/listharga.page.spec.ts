import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ListhargaPage } from './listharga.page';

describe('ListhargaPage', () => {
  let component: ListhargaPage;
  let fixture: ComponentFixture<ListhargaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListhargaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ListhargaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
