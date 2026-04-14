import type { FieldValues, Path, UseFormSetError } from "react-hook-form";

interface ZodFieldError {
  path: string;
  message: string;
}
interface ApiResponse {
    //do not include status here because response already included, such as response.status
  message?: string;
  data?: ZodFieldError[];
}

export async function parseError<T extends FieldValues>(
  response: Response,
  setError?: UseFormSetError<T>,
) {
let result: ApiResponse;
try {
  result = await response.json();
} catch (e){
  const errorMessage = e instanceof Error ? e.message : "Parsing failed";
  return `server error (${response.status}): ${errorMessage}`;
}


  const message = result.message || "unknown error";

  switch (response.status) {
    // zod error
    case 400:
      if (result.data && setError) {
       for (const err of result.data) {
         setError(err.path as Path<T>, {
           type: "manual",
           message: err.message,
         });
       }
        return "please check your form";
      }
      return message;

    case 401:
     
      return "Login Session Expired, Please Login Again";

    case 409:
      return message;

    case 500:
      return "server error, please try again later";

    default:
      return message;
  }
}

 