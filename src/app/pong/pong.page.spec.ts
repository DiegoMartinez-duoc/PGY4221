import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PongPage } from './pong.page';

describe('PongPage', () => {
  let component: PongPage;
  let fixture: ComponentFixture<PongPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PongPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
