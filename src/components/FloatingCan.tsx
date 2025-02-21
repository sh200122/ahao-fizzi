"use client";
import { SodaCan, SodaCanProps } from "@/components/SodaCan";
import { Float } from "@react-three/drei";
import { forwardRef, ReactNode } from "react";
import { Group } from "three";

type FloatingCanProps = {
  flavor?: SodaCanProps["flavor"];
  floatSpeed?: number;
  rotationIntensity?: number; // 旋转的强度
  floatIntensity?: number; // 浮动的幅度
  floatingRange?: [number, number];
  children?: ReactNode; // 允许传入子组件
};

// 使用 forwardRef 函数来使得 FloatingCan 组件可以接收一个 ref，并传递给 group 元素。这使得 FloatingCan 能够在外部被引用和操作，例如动画控制等。
const FloatingCan = forwardRef<Group, FloatingCanProps>(
  (
    {
      flavor = "blackCherry",
      floatSpeed = 1.5,
      rotationIntensity = 1,
      floatIntensity = 1,
      floatingRange = [-0.1, -0.1],
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <group ref={ref} {...props}>
        <Float
          speed={floatSpeed}
          rotationIntensity={rotationIntensity}
          floatIntensity={floatIntensity}
          floatingRange={floatingRange}
        >
          {children}
          <SodaCan flavor={flavor} />
        </Float>
      </group>
    );
  },
);

FloatingCan.displayName = "FloatingCan";

export default FloatingCan;
