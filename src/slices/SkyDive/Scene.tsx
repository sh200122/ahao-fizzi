"use client";

import { Content } from "@prismicio/client";
import { Cloud, Clouds, Environment, Text } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import FloatingCan from "@/components/FloatingCan";
import { useMediaQuery } from "@/hooks/useMediaQuery";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// 定义属性
type SkyDiveProps = {
  sentence: string | null;
  flavor: Content.SkyDiveSliceDefaultPrimary["flavor"];
};

export default function Scene({ sentence, flavor }: SkyDiveProps) {
  const groupRef = useRef<THREE.Group>(null);
  const canRef = useRef<THREE.Group>(null);
  const cloud1Ref = useRef<THREE.Group>(null);
  const cloud2Ref = useRef<THREE.Group>(null);
  const cloudsRef = useRef<THREE.Group>(null);
  const wordsRef = useRef<THREE.Group>(null);

  // 75度角
  const ANGLE = 75 * (Math.PI / 180);

  // 根据距离和角度计算x轴和y轴
  const getXPosition = (distance: number) => distance * Math.cos(ANGLE);
  const getYPosition = (distance: number) => distance * Math.sin(ANGLE);

  // 把距离转换为坐标
  const getXYPositions = (distance: number) => ({
    x: getXPosition(distance),
    y: getYPosition(-1 * distance), // 负数
  });

  useGSAP(() => {
    if (
      !cloudsRef.current ||
      !canRef.current ||
      !wordsRef.current ||
      !cloud1Ref.current ||
      !cloud2Ref.current
    )
      return;

    gsap.set(cloudsRef.current.position, { z: 10 }); // 云朵位置
    gsap.set(canRef.current.position, { ...getXYPositions(-4) }); //罐子位置

    // 文字位置
    gsap.set(
      wordsRef.current.children.map((word) => word.position),
      { ...getXYPositions(7), z: 2 },
    );

    // 罐子
    gsap.to(canRef.current.rotation, {
      y: Math.PI * 2, //绕Y轴旋转，旋转一圈
      duration: 1.7, //持续1.7秒
      repeat: -1, // 重复无限次
      ease: "none",
    });

    //云朵运动距离和持续时间
    const DISTANCE = 15;
    const DURATION = 6;

    //设置云朵的位置
    gsap.set([cloud2Ref.current.position, cloud1Ref.current.position], {
      ...getXYPositions(DISTANCE),
    });

    // 使云朵1持续运动
    gsap.to(cloud1Ref.current?.position, {
      y: `+=${getYPosition(DISTANCE * 2)}`,
      x: `+=${getXPosition(DISTANCE * -2)}`,
      ease: "none",
      repeat: -1,
      duration: DURATION,
    });

    // 使云朵2持续运动，但有延迟
    gsap.to(cloud2Ref.current?.position, {
      y: `+=${getYPosition(DISTANCE * 2)}`,
      x: `+=${getXPosition(DISTANCE * -2)}`,
      ease: "none",
      repeat: -1,
      delay: DURATION / 2,
      duration: DURATION,
    });

    // 创建一个scrollTl时间轴
    const scrollTl = gsap.timeline({
      scrollTrigger: {
        trigger: ".skydive", //关联到skydrive
        pin: true, //固定元素
        start: "top top",
        end: "+=2000",
        scrub: 1.5, //动画与滚动同步，滚动时调整动画进度
      },
    });

    scrollTl
      //滚动时改变背景颜色，持续.1秒
      .to("body", {
        backgroundColor: "#C0F0F5",
        overwrite: "auto",
        duration: 0.1,
      })
      //将云朵的位置动画过渡到z=0,持续.3秒
      .to(cloudsRef.current.position, { z: 0, duration: 0.3 }, 0)
      //将飘浮罐子的位置过渡到（0，0），持续.3秒，采用'back.out'缓动效果
      .to(canRef.current.position, {
        x: 0,
        y: 0,
        duration: 0.3,
        ease: "back.out(1.7)",
      })
      .to(
        wordsRef.current.children.map((word) => word.position),
        {
          keyframes: [
            //首先将所有文字位置移动到 (0, 0, -1)
            {
              x: 0,
              y: 0,
              z: -1,
            },
            { ...getXYPositions(-7), z: -7 }, // 然后将文字位置移动到基于 getXYPositions(-7) 的新坐标，z = -7
          ],
          stagger: 0.3, //每个单词之间有.3秒的间隔
        },
        0,
      )
      //  将漂浮罐子的位置过渡到基于的新坐标
      .to(canRef.current.position, {
        ...getXYPositions(4),
        duration: 0.5,
        ease: "back.in(1.7)",
      })
      // 将云朵的位置过渡到
      .to(cloudsRef.current.position, { z: 7, duration: 0.5 });
  });

  return (
    <group ref={groupRef}>
      <group rotation={[0, 0, 0.5]}>
        <FloatingCan
          ref={canRef}
          flavor={flavor}
          rotationIntensity={0}
          floatIntensity={3}
          floatSpeed={3}
        >
          <pointLight intensity={30} color="#088c12" decay={.6}/> {/* 点光源 */}
        </FloatingCan>
      </group>

      {/* 云 */}
      <Clouds ref={cloudsRef}>
        <Cloud ref={cloud1Ref} bounds={[10, 10, 2]} />
        <Cloud ref={cloud2Ref} bounds={[10, 10, 2]} />
      </Clouds>

      {/* 文字 */}
      <group ref={wordsRef}>
        {sentence && <ThreeText sentence={sentence} color="#F97315" />}
      </group>

      {/* 灯光 */}
      <ambientLight intensity={2} color="#9DDEFA" />
      <Environment files="/hdr/field.hdr" environmentIntensity={1.5} />
    </group>
  );
}

function ThreeText({
  sentence,
  color = "white",
}: {
  sentence: string;
  color?: string;
}) {
  const words = sentence.toUpperCase().split(" "); // 将句子转换为大写并按空格拆分成单词

  const material = new THREE.MeshLambertMaterial();
  const isDesktop = useMediaQuery("(min-width:950px)", true);

  return words.map((word: string, wordIndex: number) => (
    <Text
      key={`${wordIndex}-${word}`}
      scale={isDesktop ? 1 : 0.5}
      color={color}
      material={material}
      font="/fonts/Alpino-Variable.woff"
      fontWeight={900}
      anchorX={"center"}
      anchorY={"middle"}
      characters="ABCDEFGHIJKLMNOPQRSTUVWXYZ!,.?'"
    >
      {word}
    </Text>
  ));
}
