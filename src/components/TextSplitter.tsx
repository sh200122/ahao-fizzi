// 讲一段文本拆分成独个字符，并对字符和单词进行独立渲染

import clsx from "clsx";

type Props = {
  text: string;
  className?: string;
  wordDisplayStyle?: "inline-block" | "block";
};

export function TextSplitter({
  text,
  className,
  wordDisplayStyle = "inline-block",
}: Props) {
  if (!text) return null;

  const words = text.split(" ");

  return words.map((word: string, wordIndex: number) => {
    const splitText = word.split(""); //拆分单词为字符
    return (
      <span
        className={clsx("split-word", className)}
        style={{ display: wordDisplayStyle, whiteSpace: "pre" }}
        key={`${wordIndex}-${word}`}
      >
        {splitText.map((char, charIndex) => {
          if (char === " ") return ` `; // 如果是空格字符，则直接返回一个空格
          return (
            <span
              key={charIndex}
              className={`split-char inline-block split-char--${wordIndex}-${charIndex}`}
            >
              {char}
            </span>
          );
        })}
        {wordIndex < words.length - 1 ? (
          <span className="split-char">{` `}</span>
        ) : (
          ""
        )}
      </span>
    );
  });
}
