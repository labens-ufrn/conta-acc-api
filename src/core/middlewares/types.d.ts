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
    course?: any;
    userId?: string;
    courseId?: string;
    studentId?: string;
    student?: any;
    userJwtDecoded?: {
      id: string;
      courseId: string;
      studentId?: string;
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
