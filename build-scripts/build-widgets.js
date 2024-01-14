const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const vueFilesDirectory = "src"; // Replace with your actual directory

// Get a list of Vue files in the specified directory
const vueFiles = fs
  .readdirSync(vueFilesDirectory)
  .filter((file) => file.endsWith(".vue"));

// Create an array to store information about each Vue file
const widgetsInfo = [];

// Iterate over each Vue file
for (const vueFile of vueFiles) {
  const vueFilePath = path.join(vueFilesDirectory, vueFile);

  const content = fs.readFileSync(vueFilePath, "utf-8");
  const match = content.match(/defineComponent\(([^]*)\)/);
  const definedComponent = convertObject(match[1]);
  const widgetInfo = {
    name: "Unknown",
    file: "Unknown",
    width: 1,
    height: 1,
    props: {},
  };

  if (definedComponent) {
    widgetInfo.name = extractComponentName(definedComponent);
    widgetInfo.props = extractProps(definedComponent);
    if (definedComponent.widgetWidth)
      widgetInfo.width = definedComponent.widgetWidth;
    if (definedComponent.widgetHeight)
      widgetInfo.height = definedComponent.widgetHeight;
  } else {
    widgetInfo.name = path.basename(vueFilePath, path.extname(vueFilePath));
  }
  widgetInfo.file = widgetInfo.name + ".umd.min.js";

  // Build the Vue file using vue-cli-service
  try {
    execSync(
      `vue-cli-service build --target lib --formats umd-min --no-clean --name '${widgetInfo.name}' --inline-vue ${vueFilePath}`,
      { stdio: "inherit" }
    );

    // Add information to the array
    widgetsInfo.push(widgetInfo);
  } catch (error) {
    console.error(`Error building ${vueFile}: ${error.message}`);
  }
}

// Write the widgetInfo array to a JSON file
const jsonFilePath = "dist/widget-info.json"; // Replace with your desired file path
fs.writeFileSync(jsonFilePath, JSON.stringify(widgetsInfo, null, 2));

console.log(`Build process completed. Widget info saved to ${jsonFilePath}`);

/**
 *
 * @param {*} definedComponent
 * @returns
 */
function extractComponentName(definedComponent) {
  if (definedComponent) {
    if (definedComponent.name) return definedComponent.name;
  }
}

function extractProps(definedComponent) {
  const simplified = {};

  if (definedComponent) {
    for (const prop in definedComponent.props) {
      // eslint-disable-next-line no-prototype-builtins
      if (definedComponent.props.hasOwnProperty(prop)) {
        const propValue = definedComponent.props[prop];

        // If propValue.type is a function, use its result
        const typeValue =
          typeof propValue.type === "function"
            ? propValue.type()
            : propValue.type;

        // If propValue.default is a function, use its result
        const defaultValue =
          typeof propValue.default === "function"
            ? propValue.default()
            : propValue.default;

        simplified[prop] =
          defaultValue !== undefined ? defaultValue : typeValue;
      }
    }
    return simplified;
  }

  return {};
}

function convertObject(obj) {
  return eval(`(${obj})`);
}
