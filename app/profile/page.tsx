"use client";
import { useCounterStore } from "@/store/useCountStore";
interface Welcome {
  name: string;
  age?: number;
}
const Text = ({ name = "triet", age = 13 }: Welcome) => {
  const { count, inc, dec } = useCounterStore();

  return (
    <div>
      <h1>
        Welcome {name}, your age is {age}
      </h1>
      <h2>Count: {count}</h2>
      <div className="flex gap-4">
        <button onClick={inc} className="border">
          increase
        </button>
        <button onClick={dec} className=" border">
          decrease
        </button>
      </div>
    </div>
  );
};
export default Text;
