import { ApplicationError } from "@/protocols";

export function invalidPaymentError(): ApplicationError {
  return {
    name: "invalidPaymentError",
    message: "Invalid payment",
  };
}
