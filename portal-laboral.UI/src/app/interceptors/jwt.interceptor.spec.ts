import { TestBed } from '@angular/core/testing';
import { HttpInterceptorFn } from '@angular/common/http';

import { JwtInterceptor } from './jwt.interceptor';

describe('JwtInterceptor', () => {
  it('should be created', () => {
    const interceptor = new JwtInterceptor();
    expect(interceptor).toBeTruthy();
  });
});
