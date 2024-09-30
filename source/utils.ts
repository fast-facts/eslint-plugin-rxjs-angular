/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs-angular
 */

import { ESLintUtils } from "@typescript-eslint/utils";

export interface ESLintPluginDocs {
  recommended?: boolean | string;
  suggestion?: boolean;
}

export const ruleCreator = ESLintUtils.RuleCreator<ESLintPluginDocs>(
  (name) =>
    `https://github.com/cartant/eslint-plugin-rxjs-angular/tree/main/docs/rules/${name}.md`
);