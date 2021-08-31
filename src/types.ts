import { Request, Response } from "express";

export type CommonResponse<T> = {
  status: "SUCCESS" | "FAILED";
  data: T;
};

export interface UserType {
  firstName: string;
  lastName: string;
  email: string;
  age: number;
}

export interface CsvType {
  Email: string;
  Content: string;
  Name: string;
}

export type RequestType<P, B, Q> = Request<P, {}, B, Q>;

export type ResponseType<T> = Response<CommonResponse<T>>;
