import { ScrambleText } from "@repo/shared";
import Hero from "./sections/hero";
import {TextReplace} from "@repo/shared"
import { FlipToNewContainer } from "@repo/shared";
import {DraggableItem} from "@repo/shared"
import {PhysicsEffect} from "@repo/shared"
import { MotionPath } from "@repo/shared";
import { MorphSvg } from "@repo/shared";
import HeroScene from "./components/HeroScene";
export default function Home() {
  return (
    <div className="w-full">
      {/* <Hero/>
      <ScrambleText />
      <TextReplace/> */}
      <MorphSvg/>
      <MotionPath/>
      <PhysicsEffect/>
      <HeroScene/>
       {/* <DraggableItem/> */}
         {/* <FlipToNewContainer/> */}
 
     
    </div>
  );
}
