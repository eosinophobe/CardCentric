import { declareIndexPlugin, ReactRNPlugin } from "@remnote/plugin-sdk";

async function onActivate(plugin: ReactRNPlugin) {


await plugin.settings.registerStringSetting({
  id: "fontSize",
  title: "Text Size",
  description: "Adjust the text size of your flashcards",
  defaultValue: "25",
});

await plugin.settings.registerBooleanSetting({
  id: "useDefaultFontSize",
  title: "Use RemNote default text size",
  description: "If enabled, the plugin will only center the flashcards, without changing the text size",
  defaultValue: false,
});

await plugin.settings.registerBooleanSetting({
  id: "useDefaultFontFamily",
  title: "Use RemNote default font",
  description: "Disable only if you wish to use a different font than the RemNote default",
  defaultValue: true, 
});

await plugin.settings.registerDropdownSetting({
  id: "fontFamily",
  title: "Font Family",
  description: "Used only when the default RemNote font is disabled",
  defaultValue: "system",
  options: [
    { key: "system", value: "system", label: "System Default" },
    { key: "monospace", value: "monospace", label: "Monospace" },
    { key: "arial", value: "arial", label: "Arial" },
    { key: "times", value: "times", label: "Times New Roman" },
    { key: "georgia", value: "georgia", label: "Georgia" },
    { key: "latin-modern-math", value: "latin-modern-math",label: "Latin Modern Math (requires installing)",
}

  ],
});




plugin.track(async (reactivePlugin) => {
  // ===== FONT SIZE  =====
  const useDefaultFontSize = await reactivePlugin.settings.getSetting<boolean>(
    "useDefaultFontSize"
  );
  const fontSize = await reactivePlugin.settings.getSetting<string>("fontSize");

  if (useDefaultFontSize) {
    await reactivePlugin.app.registerCSS(
      "plugin-font-size",
      `
        :root {
          --plugin-font-size: initial;
        }
      `
    );
  } else {
    const size = Number.parseInt(fontSize ?? "25", 10);

    await reactivePlugin.app.registerCSS(
      "plugin-font-size",
      `
        :root {
          --plugin-font-size: ${Number.isFinite(size) ? size : 25}px;
        }
      `
    );
  }

  // ===== FONT FAMILY =====
  const useDefaultFontFamily = await reactivePlugin.settings.getSetting<boolean>(
    "useDefaultFontFamily"
  );
  const fontFamily = await reactivePlugin.settings.getSetting<string>(
    "fontFamily"
  );

  if (useDefaultFontFamily) {
    await reactivePlugin.app.registerCSS(
      "plugin-font-family",
      `
        :root {
          --plugin-font-family: initial;
        }
      `
    );
    return;
  }

  let cssFontFamily = "inherit";

  switch (fontFamily) {
     case "latin-modern-math":
      cssFontFamily = '"Latin Modern Math", serif';
      break;
    case "sans-serif":
      cssFontFamily = "sans-serif";
      break;
    case "serif":
      cssFontFamily = "serif";
      break;
    case "monospace":
      cssFontFamily = "monospace";
      break;
    case "arial":
      cssFontFamily = "Arial, Helvetica, sans-serif";
      break;
    case "times":
      cssFontFamily = '"Times New Roman", Times, serif';
      break;
    case "georgia":
      cssFontFamily = "Georgia, serif";
      break;
    case "system":
    default:
      cssFontFamily = "inherit";
  }

  await reactivePlugin.app.registerCSS(
    "plugin-font-family",
    `
      :root {
        --plugin-font-family: ${cssFontFamily};
      }
    `
  );
});


}

async function onDeactivate(_: ReactRNPlugin) {}

declareIndexPlugin(onActivate, onDeactivate);
