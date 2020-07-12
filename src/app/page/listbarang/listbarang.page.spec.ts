import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ListbarangPage } from './listbarang.page';

describe('ListbarangPage', () => {
  let component: ListbarangPage;
  let fixture: ComponentFixture<ListbarangPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListbarangPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ListbarangPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
