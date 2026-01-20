"use client";

interface Welcome {
  name: string;
  age?: number;
}
const Text = ({ name = "triet", age = 13 }: Welcome) => {
  return (
    <h1>
      Welcome {name}, your age is {age}
    </h1>
  );
};
export default Text;
