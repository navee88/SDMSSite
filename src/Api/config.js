import axios from "axios";

export const api = axios.create({
<<<<<<< HEAD
  // baseURL: "http://localhost:8094/SDMS_WebService/",
  baseURL:"http://localhost:9090/SDMS_WebService/",

=======
  //baseURL: "http://localhost:8094/SDMS_WebService/",
  baseURL:"http://localhost:9093/SDMS_WebService/",
 
>>>>>>> daf3eebd19a3e155a0b2021bec1fe77ba8e6fae2
  timeout: 60000
});

export const SECRET_KEY = "AGARAM_SDMS_SCRT";
export const ITERATIONS = 100;
