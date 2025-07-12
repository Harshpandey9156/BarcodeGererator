 
import { redirect } from "next/navigation";

export default function PreviewFallback() {
  
   redirect("/dashboard/history");
}
