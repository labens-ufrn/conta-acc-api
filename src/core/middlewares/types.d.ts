declare namespace Express {
  interface Request {
    currency?: string;
    jwtToken?: string;
    language?: string;
    reqIpAddress?: string;
    reqIpCountry?: string;
    reqUserAgent?: string;
    requestId?: string;
    user?: any;
    domain?: any;
    userId?: string;
    domainId?: string;
    userJwtDecoded?: {
      id: string;
      domainId: string;
      createdAt: string;
      dataTime: string;
      deviceId?: string;
      fingerPrint?: string;
      reqIpAddress?: string;
      reqIpCountry?: string;
      reqUserAgent?: string;
    };
  }
}
