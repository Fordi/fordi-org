import { joinClass } from "../classes.js";

export default (moduleCache) => (key, value) => {
  if (
    key !== "1" ||
    !(typeof value.className === "string" || Array.isArray(value.className))
  ) {
    return undefined;
  }

  const unique = joinClass(value.className).split(" ");

  return {
    ...value,
    className: Promise.all(
      unique.map((name) =>
        name.indexOf(".") !== -1
          ? moduleCache.getExport(name)
          : Promise.resolve(undefined)
      )
    ).then((exps) =>
      unique.map((name, index) => (exps[index] ? exps[index] : name)).join(" ")
    ),
  };
};
