import { ScrambleText } from "@repo/shared";
import Hero from "./sections/hero";
import {TextReplace} from "@repo/shared"
import { FlipToNewContainer } from "@repo/shared";
export default function Home() {
  return (
    <div className="w-full">
      {/* <Hero/>
      <ScrambleText />
      <TextReplace/> */}
       
         <FlipToNewContainer/>
 
     
    </div>
  );
}
