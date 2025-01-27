import { TestBed } from '@angular/core/testing';

import { SignedurlService } from './signedurl.service';

describe('SignedurlService', () => {
  let service: SignedurlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SignedurlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
