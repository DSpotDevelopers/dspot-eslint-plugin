"use strict";

function _captureFunctionalComponent(node) {
    //Check if the declaration is a functional component checking the result of the function
    if (node.body.type === "BlockStatement") {
        const returnStatement = node.body.body.find(statement => statement.type === "ReturnStatement");
        if (returnStatement && returnStatement.argument && returnStatement.argument.type === "JSXElement") {
            return node;
        }
    }

    return null;
}

module.exports = {
    captureFunctionalComponent: (data) => {
        return {
            "ExportDefaultDeclaration > FunctionDeclaration"(node) {
                data.functionalComponent = _captureFunctionalComponent(node);
            },

            "ExportNamedDeclaration > FunctionDeclaration"(node) {
                data.functionalComponent = _captureFunctionalComponent(node);
            },

            "ExportNamedDeclaration > VariableDeclaration > VariableDeclarator > FunctionExpression"(node) {
                data.functionalComponent = _captureFunctionalComponent(node);
            },

            "ExportNamedDeclaration > VariableDeclaration > VariableDeclarator > ArrowFunctionExpression"(node) {
                data.functionalComponent = _captureFunctionalComponent(node);
            }
        }
    },

    captureReactHookProps: function (node) {
        //Ensure the initialization is done from within the Custom Hook (which should start with "use")
        const init = node.parent.init;
        if (init.type !== "CallExpression" || init.callee.type !== "Identifier" || !init.callee.name.startsWith("use")) {
            return;
        }

        return node.properties.map(property => property.key.name);
    }
}
