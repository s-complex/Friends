import fs from "node:fs";
import yaml from "js-yaml";
import consola from "consola";

const YAML_FILE_PATH = "./list.yml";

function sort() {
  try {
    const source = fs.readFileSync(YAML_FILE_PATH, "utf-8");
    const data = yaml.load(source);

    if (typeof data !== "object" || data === null) {
      consola.warn(
        "Source was empty or its format wasn'n t object, skipping...",
      );
      return;
    }

    const sortedContent = {};
    Object.keys(data)
      .sort((a, b) => {
        const isAEnglish = /^[a-zA-Z]/.test(a.charAt(0));
        const isBEnglish = /^[a-zA-Z]/.test(b.charAt(0));

        if (isAEnglish && !isBEnglish) return -1;
        if (!isAEnglish && isBEnglish) return 1;

        return a.localeCompare(b, 'zh-CN');
      })
      .forEach((key) => {
        sortedContent[key] = data[key];
      });

    const content = yaml.dump(sortedContent, {
      indent: 2,
      lineWidth: -1,
      forceQuotes: false,
    });

    fs.writeFileSync(YAML_FILE_PATH, content, "utf-8");

    const newSource = fs.readFileSync(YAML_FILE_PATH, "utf8");
    if (source === newSource) {
      console.warn("No changes detected.");
    } else {
      consola.success("Source updated.");
    }
  } catch (e) {
    consola.error(
      new Error("An error occurred while sorting the YAML file:", e),
    );
    process.exit(1);
  }
}

sort();
