// Hooks for the moon_docs app

import CodePreview from "./CodePreview";
import moonHooks from "../../../../moon_live_view/assets/js/hooks/";

export default {
  CodePreviewHook: CodePreview,
  ...moonHooks,
};
