import { ScrambleText } from "@repo/shared";
import Hero from "./sections/hero";
import {TextReplace} from "@repo/shared"
import { FlipToNewContainer } from "@repo/shared";
import {DraggableItem} from "@repo/shared"
import {PhysicsEffect} from "@repo/shared"
import { MotionPath } from "@repo/shared";
import { MorphSvg } from "@repo/shared";
import HeroScene from "./components/HeroScene";
import {SplitTextResponsive} from "@repo/shared"
import { ElasticSplitTextResponsive } from "@repo/shared";
import {Cursor} from "@repo/shared"
import { Floorplan } from "@repo/shared";

export default function Home() {
  return (
    <div className="w-full h-screen">
      <Floorplan/>
      {/* <Cursor/> */}
      {/* <ElasticSplitTextResponsive text="Hi, I'm Amy, Web Developer" /> */}
      {/* <Hero/> */}
      {/* <ScrambleText />
      <TextReplace/>
      <MorphSvg/>
      <MotionPath/>
      <PhysicsEffect/>
      <HeroScene/>
      <div className="relative">
         <DraggableItem/>
      </div>
     
      <FlipToNewContainer/> */}
    </div>
  );
}
