import { TestBed } from '@angular/core/testing';

import { TokenService } from './token.service';

describe('TokenService', () => {
  let service: TokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TokenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getTokens()', () => {
    service.getTokens()
  })

  it('should getAuthorizationToken called?', () => {
    service.getAuthorizationToken()
  })

  it('is ProjectToken available?', () => {
    service.getProjectToken("")
  })

  it('is AuthorizationToken available?', () => {
    service.getAuthorizationToken()
  })
});
