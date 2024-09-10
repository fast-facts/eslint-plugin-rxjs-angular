/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs-angular
 */

import { TSESTree as es } from "@typescript-eslint/utils";
import { getParent, getTypeServices } from "../etc";
import { ruleCreator } from "../utils";

type Options = readonly Record<string, boolean | string>[];
type MessageIds = "forbidden";

const defaultOptions: Options = [{}];

const rule = ruleCreator<Options, MessageIds>({
  defaultOptions,
  meta: {
    docs: {
      description:
        "Forbids the calling of `subscribe` within Angular components.",
      recommended: false,
    },
    fixable: undefined,
    hasSuggestions: false,
    messages: {
      forbidden:
        "Calling `subscribe` in a component is forbidden; use an `async` pipe instead.",
    },
    schema: [],
    type: "problem",
  },
  name: "prefer-async-pipe",
  create: (context) => {
    const { couldBeObservable } = getTypeServices(context);
    const componentMap = new WeakMap<es.Node, void>();
    return {
      [`CallExpression > MemberExpression[property.name="subscribe"]`]: (
        memberExpression: es.MemberExpression
      ) => {
        let parent = getParent(memberExpression);
        while (parent) {
          if (
            componentMap.has(parent) &&
            couldBeObservable(memberExpression.object)
          ) {
            context.report({
              messageId: "forbidden",
              node: memberExpression.property,
            });
            return;
          }
          parent = getParent(parent);
        }
      },
      [`ClassDeclaration > Decorator[expression.callee.name="Component"]`]: (
        node: es.Node
      ) => {
        const classDeclaration = getParent(node) as es.ClassDeclaration;
        componentMap.set(classDeclaration);
      },
    };
  },
});

export = rule;
