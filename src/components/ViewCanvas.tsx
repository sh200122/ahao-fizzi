"use client";

import { Canvas } from "@react-three/fiber";
import {View} from "@react-three/drei";
import { Suspense } from "react";
import dynamic from "next/dynamic";

const Loader=dynamic(
  ()=>import('@react-three/drei').then((mod)=>mod.Loader),
  {ssr:false}
)

type Props = {};

export default function ViewCanvas({}: Props) {
  return (
    <>
    <Canvas
      style={{
        position: "fixed",
        top: 0,
        left: "50%",
        transform: "translateX(-50%)",
        overflow: "hidden",
        // pointerEvents: "none", //禁用用户与画布交互，使得画布不会阻挡其他元素的点击事件
        zIndex: 30,
      }}
      shadows
      dpr={[1, 1.5]} // 自动调整像素比，确保清晰渲染
      gl={{ antialias: true }} // 启用抗锯齿，是物体边缘更加平滑
      camera={{
        fov: 30, // 设置相机的视场角度
      }}
    >
      <Suspense fallback={null}>
      <View.Port/>
      </Suspense>
    </Canvas>
    <Loader/>
    </>
  );
}
