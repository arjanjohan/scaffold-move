import { useState } from "react";

export const useFunctionArguments = (typeParamsLength: number, paramsLength: number) => {
  const [data, setData] = useState({
    typeArgs: Array(typeParamsLength).fill(null),
    args: Array(paramsLength).fill(null),
  });

  const handleTypeArgChange = (index: number, value: string) => {
    const newTypeArgs = [...data.typeArgs];
    newTypeArgs[index] = value;
    setData({ ...data, typeArgs: newTypeArgs });
  };

  const handleArgChange = (index: number, value: string) => {
    const newArgs = [...data.args];
    newArgs[index] = value.trim() === "" ? null : value;
    setData({ ...data, args: newArgs });
  };

  return { data, handleTypeArgChange, handleArgChange };
};
