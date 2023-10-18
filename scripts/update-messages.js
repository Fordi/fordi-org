import { writeFile, readFile } from "fs/promises";
import { join } from "path";

const i18n = new URL("../docs/api/i18n", import.meta.url).pathname;
const tablePath = new URL("../messageTable.json", import.meta.url).pathname;
const { languages, messageTable } = JSON.parse(
  await readFile(tablePath, "utf8")
);
const keys = Object.keys(messageTable);

await writeFile(
  join(i18n, "config"),
  JSON.stringify({ languages, keys }, null, 2)
);
for await (const language of languages) {
  const table = messageTable;
  const index = languages.indexOf(language);
  await writeFile(
    join(i18n, language),
    JSON.stringify(
      keys.map((key) => table[key][index]),
      null,
      2
    )
  );
}
