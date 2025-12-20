import { lazy } from "react";

export const grammarLevelMap = {
  N5: lazy(() => import("../pages/grammar/N5Grammar")),
  N4: lazy(() => import("../pages/grammar/N4Grammar")),
  N3: lazy(() => import("../pages/grammar/N3Grammar")),
  N2: lazy(() => import("../pages/grammar/N2Grammar")),
  N1: lazy(() => import("../pages/grammar/N1Grammar")),
};

export const grammarFallback = lazy(() =>
  import("../pages/grammar/Grammar")
);
