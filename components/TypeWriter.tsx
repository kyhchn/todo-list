"use client";
import GraphemeSplitter from "grapheme-splitter";
import Typewriter from "typewriter-effect";
type Props = {};

const TypeWriter = (props: Props) => {
  const stringSplitter = (text: string) => {
    const splitter = new GraphemeSplitter();
    return splitter.splitGraphemes(text) as any;
  };
  return (
    <Typewriter
      options={{
        loop: true,
        stringSplitter: (text) => stringSplitter(text),
      }}
      onInit={(typewriter) => {
        typewriter
          .typeString("📈 Increases productivity.")
          .pauseFor(1000)
          .deleteAll()
          .typeString("🤖 Powered by AI.")
          .pauseFor(1000)
          .start();
      }}
    />
  );
};
export default TypeWriter;
