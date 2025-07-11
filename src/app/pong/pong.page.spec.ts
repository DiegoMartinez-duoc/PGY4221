import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PongPage } from './pong.page';

import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

describe('PongPage', () => {
  let component: PongPage;
  let fixture: ComponentFixture<PongPage>;

  beforeEach(async () => {

    TestBed.configureTestingModule({
        providers: [AlertController, Router],
      });

    fixture = TestBed.createComponent(PongPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
