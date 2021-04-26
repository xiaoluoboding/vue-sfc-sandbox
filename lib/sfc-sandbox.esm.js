/*!
 * sfc-sandbox v0.1.0
 * (c) 2021 xiaoluoboding
 * @license MIT
 */
import { defineComponent, ref, reactive, computed, onMounted, onUnmounted, toRefs, openBlock, createBlock, createVNode, renderSlot, withModifiers, withScopeId, pushScopeId, popScopeId, watchEffect, inject, watch, Fragment, createCommentVNode, toDisplayString, unref, Transition, toRaw, provide, withCtx, withDirectives, vShow } from 'vue';
import { EditorState, basicSetup, EditorView } from '@codemirror/basic-setup';
import { html } from '@codemirror/lang-html';
import { MagicString, babelParse, walkIdentifiers, walk } from '@vue/compiler-sfc';
import * as defaultCompiler from '@vue/compiler-sfc/dist/compiler-sfc.esm-browser';

var script$6 = defineComponent({
    name: 'SplitPane',
    setup(props, { emit }) {
        const container = ref();
        const state = reactive({
            dragging: false,
            split: 50,
            isHorizontal: true
        });
        function boundSplit() {
            const { split } = state;
            return split < 20
                ? 20
                : split > 80
                    ? 80
                    : split;
        }
        let startPositionX = 0;
        let startPositionY = 0;
        let startSplit = 0;
        function dragStart(e) {
            state.dragging = true;
            startPositionX = e.pageX;
            startPositionY = e.pageY;
            startSplit = boundSplit();
        }
        function dragMove(e) {
            if (state.dragging) {
                const totalSize = container.value.offsetWidth;
                const position = state.isHorizontal ? e.pageX : e.pageY;
                const dp = position - (state.isHorizontal ? startPositionX : startPositionY);
                state.split = startSplit + ~~(dp / totalSize * 100);
                emit('resize', [
                    { size: boundSplit() },
                    { size: (100 - boundSplit()) }
                ]);
            }
        }
        function dragEnd() {
            if (!state.dragging)
                return;
            state.dragging = false;
            emit('resized', [
                { size: boundSplit() },
                { size: (100 - boundSplit()) }
            ]);
        }
        const onResize = () => {
            const containerSize = container.value.offsetWidth;
            state.isHorizontal = containerSize > 720;
        };
        const splitPaneStyle = computed(() => {
            return {
                'flex-direction': state.isHorizontal ? 'row' : 'column'
            };
        });
        const leftStyle = computed(() => {
            return state.isHorizontal
                ? { width: boundSplit() + '%', borderRight: '1px solid #ebebeb' }
                : { height: boundSplit() + '%', borderBottom: '1px solid #ebebeb' };
        });
        const rightStyle = computed(() => {
            return state.isHorizontal
                ? { width: (100 - boundSplit()) + '%' }
                : { height: (100 - boundSplit()) + '%' };
        });
        const draggerStyle = computed(() => {
            return state.isHorizontal
                ? { top: 0, bottom: 0, right: '-5px', width: '10px', cursor: 'ew-resize' }
                : { left: 0, right: 0, bottom: '-5px', height: '10px', cursor: 'ns-resize' };
        });
        onMounted(() => {
            window.addEventListener('resize', onResize, false);
            onResize();
        });
        onUnmounted(() => {
            window.removeEventListener('resize', onResize, false);
        });
        return {
            container,
            dragStart,
            dragMove,
            dragEnd,
            boundSplit,
            splitPaneStyle,
            leftStyle,
            rightStyle,
            draggerStyle,
            ...toRefs(state)
        };
    }
});

const _withId$2 = /*#__PURE__*/withScopeId("data-v-9241e4e6");

const render$2 = /*#__PURE__*/_withId$2((_ctx, _cache, $props, $setup, $data, $options) => {
  return (openBlock(), createBlock("div", {
    ref: "container",
    class: ["split-pane", { dragging: _ctx.dragging, 'is-vertical': !_ctx.isHorizontal }],
    style: _ctx.splitPaneStyle,
    onMousemove: _cache[2] || (_cache[2] = (...args) => (_ctx.dragMove && _ctx.dragMove(...args))),
    onMouseup: _cache[3] || (_cache[3] = (...args) => (_ctx.dragEnd && _ctx.dragEnd(...args))),
    onMouseleave: _cache[4] || (_cache[4] = $event => (_ctx.dragging = false))
  }, [
    createVNode("div", {
      class: "split-pane__left",
      style: _ctx.leftStyle
    }, [
      renderSlot(_ctx.$slots, "left"),
      createVNode("div", {
        class: "dragger",
        style: _ctx.draggerStyle,
        onMousedown: _cache[1] || (_cache[1] = withModifiers((...args) => (_ctx.dragStart && _ctx.dragStart(...args)), ["prevent"]))
      }, null, 36 /* STYLE, HYDRATE_EVENTS */)
    ], 4 /* STYLE */),
    createVNode("div", {
      class: "split-pane__right",
      style: _ctx.rightStyle
    }, [
      renderSlot(_ctx.$slots, "right")
    ], 4 /* STYLE */)
  ], 38 /* CLASS, STYLE, HYDRATE_EVENTS */))
});

function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css_248z$6 = ".split-pane[data-v-9241e4e6]{display:flex;height:100%}.split-pane.dragging[data-v-9241e4e6]{cursor:ew-resize}.split-pane.dragging.is-vertical[data-v-9241e4e6]{cursor:ns-resize}.dragging .split-pane__left[data-v-9241e4e6],.dragging .split-pane__right[data-v-9241e4e6]{pointer-events:none}.split-pane__left[data-v-9241e4e6],.split-pane__right[data-v-9241e4e6]{position:relative;height:100%}.dragger[data-v-9241e4e6]{position:absolute;z-index:99}";
styleInject(css_248z$6);

script$6.render = render$2;
script$6.__scopeId = "data-v-9241e4e6";
script$6.__file = "packages/components/SplitPane.vue";

const debounce = (fn, n = 166) => {
    let handle;
    return (...args) => {
        if (handle)
            clearTimeout(handle);
        handle = setTimeout(() => {
            fn(...args);
        }, n);
    };
};

// interface EditorStore {
//   el: Element,
//   doc: string,
//   view: typeof EditorView
// }

var script$5 = defineComponent({
  name: 'Codemirror',

  props: ['modelValue'],

  setup (props, { emit }) {
    const { modelValue } = toRefs(props);

    const store = reactive({
      el: null,
      doc: modelValue.value,
      view: null
    });

    onMounted(() => {
      const onUpdate = () =>
        EditorView.updateListener.of(debounce(({ state }) => {
          store.doc = state.doc.toString();
          emit('update:modelValue', store.doc);
        }));

      const editorState = EditorState.create({
        doc: store.doc,
        extensions: [
          basicSetup,
          // oneDark,
          // javascript(),
          html(),
          onUpdate()
        ]
      });

      store.view = new EditorView({
        state: editorState,
        parent: store.el
      });
    });

    return {
      ...toRefs(store)
    }
  }
});

const _withId$1 = /*#__PURE__*/withScopeId("data-v-0b029634");

pushScopeId("data-v-0b029634");
const _hoisted_1$3 = {
  class: "codemirror-container",
  ref: "el"
};
popScopeId();

const render$1 = /*#__PURE__*/_withId$1((_ctx, _cache, $props, $setup, $data, $options) => {
  return (openBlock(), createBlock("div", _hoisted_1$3, null, 512 /* NEED_PATCH */))
});

var css_248z$5 = "@import \"./index.css\";.codemirror-container[data-v-0b029634]{height:100%;overflow-y:auto}";
styleInject(css_248z$5);

script$5.render = render$1;
script$5.__scopeId = "data-v-0b029634";
script$5.__file = "packages/components/codemirror/index.vue";

/**
 * Make a map and return a function for checking if a key
 * is in that map.
 * IMPORTANT: all calls of this function must be prefixed with
 * \/\*#\_\_PURE\_\_\*\/
 * So that rollup can tree-shake them if necessary.
 */

/**
 * List of @babel/parser plugins that are used for template expression
 * transforms and SFC script transforms. By default we enable proposals slated
 * for ES2020. This will need to be updated as the spec moves forward.
 * Full list at https://babeljs.io/docs/en/next/babel-parser#plugins
 */
const babelParserDefaultPlugins = [
    'bigInt',
    'optionalChaining',
    'nullishCoalescingOperator'
];
(process.env.NODE_ENV !== 'production')
    ? Object.freeze({})
    : {};
(process.env.NODE_ENV !== 'production') ? Object.freeze([]) : [];

/*!
 * vue-sfc2esm v0.1.1
 * (c) 2021 xiaoluoboding
 * @license MIT
 */

const COMP_IDENTIFIER = `__sfc__`;
/**
 * The default SFC compiler we are using is built from each commit
 * but we may swap it out with a version fetched from CDNs
 */
let SFCCompiler = defaultCompiler;
async function compileFile({ filename, code, compiled }) {
    if (!code.trim()) {
        compiled.errors = [];
        return;
    }
    if (!filename.endsWith('.vue')) {
        compiled.js = compiled.ssr = code;
        compiled.errors = [];
        return;
    }
    const id = Buffer.from(filename).toString('base64');
    console.log(id);
    const { errors, descriptor } = SFCCompiler.parse(code, {
        filename,
        sourceMap: true
    });
    if (errors.length) {
        compiled.errors = errors;
        return;
    }
    if ((descriptor.script && descriptor.script.lang) ||
        (descriptor.scriptSetup && descriptor.scriptSetup.lang) ||
        descriptor.styles.some((s) => s.lang) ||
        (descriptor.template && descriptor.template.lang)) {
        compiled.errors = [
            'lang="x" pre-processors are not supported in the in-browser playground.'
        ];
        return;
    }
    const hasScoped = descriptor.styles.some((s) => s.scoped);
    let clientCode = '';
    let ssrCode = '';
    const appendSharedCode = (code) => {
        clientCode += code;
        ssrCode += code;
    };
    const clientScriptResult = doCompileScript(descriptor, id, false);
    if (!clientScriptResult) {
        return;
    }
    const [clientScript, bindings] = clientScriptResult;
    clientCode += clientScript;
    // script ssr only needs to be performed if using <script setup> where
    // the render fn is inlined.
    if (descriptor.scriptSetup) {
        const ssrScriptResult = doCompileScript(descriptor, id, true);
        if (!ssrScriptResult) {
            return;
        }
        ssrCode += ssrScriptResult[0];
    }
    else {
        // when no <script setup> is used, the script result will be identical.
        ssrCode += clientScript;
    }
    // template
    // only need dedicated compilation if not using <script setup>
    if (descriptor.template && !descriptor.scriptSetup) {
        const clientTemplateResult = doCompileTemplate(descriptor, id, bindings, false);
        if (!clientTemplateResult) {
            return;
        }
        clientCode += clientTemplateResult;
        const ssrTemplateResult = doCompileTemplate(descriptor, id, bindings, true);
        if (!ssrTemplateResult) {
            return;
        }
        ssrCode += ssrTemplateResult;
    }
    if (hasScoped) {
        appendSharedCode(`\n${COMP_IDENTIFIER}.__scopeId = ${JSON.stringify(`data-v-${id}`)}`);
    }
    if (clientCode || ssrCode) {
        appendSharedCode(`\n${COMP_IDENTIFIER}.__file = ${JSON.stringify(filename)}` +
            `\nexport default ${COMP_IDENTIFIER}`);
        compiled.js = clientCode.trimStart();
        compiled.ssr = ssrCode.trimStart();
    }
    // styles
    let css = '';
    for (const style of descriptor.styles) {
        if (style.module) {
            compiled.errors = [`<style module> is not supported in the playground.`];
            return;
        }
        const styleResult = await SFCCompiler.compileStyleAsync({
            source: style.content,
            filename,
            id,
            scoped: style.scoped,
            modules: !!style.module
        });
        if (styleResult.errors.length) {
            // postcss uses pathToFileURL which isn't polyfilled in the browser
            // ignore these errors for now
            if (!styleResult.errors[0].message.includes('pathToFileURL')) {
                compiled.errors = styleResult.errors;
            }
            // proceed even if css compile errors
        }
        else {
            css += styleResult.code + '\n';
        }
    }
    if (css) {
        compiled.css = css.trim();
    }
    else {
        compiled.css = '/* No <style> tags present */';
    }
    // clear errors
    compiled.errors = [];
}
function doCompileScript(descriptor, id, ssr) {
    if (descriptor.script || descriptor.scriptSetup) {
        try {
            const compiledScript = SFCCompiler.compileScript(descriptor, {
                id,
                refSugar: true,
                inlineTemplate: true,
                templateOptions: {
                    ssr,
                    ssrCssVars: descriptor.cssVars
                }
            });
            let code = '';
            if (compiledScript.bindings) {
                code += `\n/* Analyzed bindings: ${JSON.stringify(compiledScript.bindings, null, 2)} */`;
            }
            code +=
                `\n` +
                    SFCCompiler.rewriteDefault(compiledScript.content, COMP_IDENTIFIER);
            return [code, compiledScript.bindings];
        }
        catch (e) {
            recordFileErrors([e]);
            return;
        }
    }
    else {
        return [`\nconst ${COMP_IDENTIFIER} = {}`, undefined];
    }
}
function doCompileTemplate(descriptor, id, bindingMetadata, ssr) {
    const templateResult = SFCCompiler.compileTemplate({
        source: descriptor.template.content,
        filename: descriptor.filename,
        id,
        scoped: descriptor.styles.some(s => s.scoped),
        slotted: descriptor.slotted,
        ssr,
        ssrCssVars: descriptor.cssVars,
        isProd: false,
        compilerOptions: {
            bindingMetadata
        }
    });
    if (templateResult.errors.length) {
        recordFileErrors(templateResult.errors);
        return;
    }
    const fnName = ssr ? `ssrRender` : `render`;
    return (`\n${templateResult.code.replace(/\nexport (function|const) (render|ssrRender)/, `$1 ${fnName}`)}` + `\n${COMP_IDENTIFIER}.${fnName} = ${fnName}`);
}

const APP_FILE = `App.vue`;
const MAIN_FILE = `main.js`;
const getMainCode = appFile => {
    return `import { createApp as _createApp } from "vue"

if (window.__app__) {
  window.__app__.unmount()
  document.getElementById('app').innerHTML = ''
}

document.getElementById('__sfc-styles').innerHTML = window.__css__
const app = window.__app__ = _createApp(__modules__["${appFile}"].default)
app.config.errorHandler = e => console.error(e)
app.mount('#app')
`.trim();
};
const WELCOME_CODE = `<template>
  <h1>{{ msg }}</h1>
</template>

<script setup>
const msg = 'Hello World!'
</script>
`.trim();
const MAIN_CODE = getMainCode(APP_FILE);
const IMPORT_MAP_CODE = `
{
  "imports": {
  }
}`.trim();
// Virtual Simple File System
class File {
    constructor(filename, code = '') {
        this.compiled = {
            js: '',
            css: '',
            ssr: '',
            errors: ['']
        };
        this.filename = filename;
        this.code = code;
    }
}
let files = {};
{
    files = {
        [APP_FILE]: new File(APP_FILE, WELCOME_CODE),
        [MAIN_FILE]: new File(MAIN_FILE, MAIN_CODE)
    };
}
const store = reactive({
    files,
    activeFilename: APP_FILE,
    get activeFile() {
        return store.files[store.activeFilename];
    },
    get importMap() {
        const file = store.files['import-map.json'];
        return file && file.code;
    },
    errors: []
});
// console.log(store.files)
watchEffect(() => compileFile(store.activeFile));
const activeFilename = computed(() => store.activeFilename);
const mainCode = computed(() => getMainCode(store.activeFilename));
for (const file in store.files) {
    if (file !== APP_FILE) {
        compileFile(store.files[file]);
    }
}
function setActive(filename, code) {
    store.activeFilename = filename;
    store.activeFile.code = code;
}
function recordFileErrors(errors) {
    store.activeFile.compiled.errors = errors;
}
function addFile(filename, code) {
    if (!filename.endsWith('.vue') &&
        !filename.endsWith('.js') &&
        filename !== 'import-map.json') {
        recordFileErrors(['Sandbox only supports *.vue, *.js files or import-map.json.']);
        return;
    }
    if (filename in store.files) {
        recordFileErrors([`File "${filename}" already exists.`]);
        return;
    }
    const file = (store.files[filename] = new File(filename));
    if (filename === 'import-map.json') {
        file.code = IMPORT_MAP_CODE;
    }
    else {
        file.code = code;
    }
    setActive(filename, file.code);
}
function changeFile(filename, code) {
    if (!(filename in store.files)) {
        recordFileErrors([`File "${filename}" is not exists.`]);
        return;
    }
    const file = store.files[filename];
    setActive(file.filename, code);
}

async function compileModules(filename) {
    if (filename !== activeFilename.value)
        return [];
    const modules = await processFile(store.files[filename]);
    const styles = [
        'color: white',
        'background: #42b983',
        'margin-left: 4px',
        'padding: 2px 4px',
        'border-radius: 2px'
    ].join(';');
    console.log(`Successfully compiled: %c${filename}%c to ES Modules.`, styles, '');
    return modules.reverse();
}
const modulesKey = `__modules__`;
const exportKey = `__export__`;
const dynamicImportKey = `__dynamic_import__`;
const moduleKey = `__module__`;
// similar logic with Vite's SSR transform, except this is targeting the browser
async function processFile(file, seen = new Set()) {
    if (seen.has(file)) {
        return [];
    }
    seen.add(file);
    await compileFile(file);
    const { js, css } = file.compiled;
    const s = new MagicString(js);
    const ast = babelParse(js, {
        sourceFilename: file.filename,
        sourceType: 'module',
        plugins: [...babelParserDefaultPlugins]
    }).program.body;
    const idToImportMap = new Map();
    const declaredConst = new Set();
    const importedFiles = new Set();
    const importToIdMap = new Map();
    function defineImport(node, source) {
        const filename = source.replace(/^\.\/+/, '');
        if (!(filename in store.files)) {
            throw new Error(`File "${filename}" does not exist.`);
        }
        if (importedFiles.has(filename)) {
            return importToIdMap.get(filename);
        }
        importedFiles.add(filename);
        const id = `__import_${importedFiles.size}__`;
        importToIdMap.set(filename, id);
        s.appendLeft(node.start, `const ${id} = ${modulesKey}[${JSON.stringify(filename)}]\n`);
        return id;
    }
    function defineExport(name, local = name) {
        s.append(`\n${exportKey}(${moduleKey}, "${name}", () => ${local})`);
    }
    // 0. instantiate module
    s.prepend(`window.__modules__ = {}\nwindow.__css__ = ''\n\nconst ${moduleKey} = __modules__[${JSON.stringify(file.filename)}] = { [Symbol.toStringTag]: "Module" }\n\n`);
    // 1. check all import statements and record id -> importName map
    for (const node of ast) {
        // import foo from 'foo' --> foo -> __import_foo__.default
        // import { baz } from 'foo' --> baz -> __import_foo__.baz
        // import * as ok from 'foo' --> ok -> __import_foo__
        if (node.type === 'ImportDeclaration') {
            const source = node.source.value;
            if (source.startsWith('./')) {
                const importId = defineImport(node, node.source.value);
                for (const spec of node.specifiers) {
                    if (spec.type === 'ImportSpecifier') {
                        idToImportMap.set(spec.local.name, `${importId}.${spec.imported.name}`);
                    }
                    else if (spec.type === 'ImportDefaultSpecifier') {
                        idToImportMap.set(spec.local.name, `${importId}.default`);
                    }
                    else {
                        // namespace specifier
                        idToImportMap.set(spec.local.name, importId);
                    }
                }
                s.remove(node.start, node.end);
            }
        }
    }
    // 2. check all export statements and define exports
    for (const node of ast) {
        // named exports
        if (node.type === 'ExportNamedDeclaration') {
            if (node.declaration) {
                if (node.declaration.type === 'FunctionDeclaration' ||
                    node.declaration.type === 'ClassDeclaration') {
                    // export function foo() {}
                    defineExport(node.declaration.id.name);
                }
                else if (node.declaration.type === 'VariableDeclaration') {
                    // export const foo = 1, bar = 2
                    for (const decl of node.declaration.declarations) {
                        const names = extractNames(decl.id);
                        for (const name of names) {
                            defineExport(name);
                        }
                    }
                }
                s.remove(node.start, node.declaration.start);
            }
            else if (node.source) {
                // export { foo, bar } from './foo'
                const importId = defineImport(node, node.source.value);
                for (const spec of node.specifiers) {
                    defineExport(spec.exported.name, `${importId}.${spec.local.name}`);
                }
                s.remove(node.start, node.end);
            }
            else {
                // export { foo, bar }
                for (const spec of node.specifiers) {
                    const local = spec.local.name;
                    const binding = idToImportMap.get(local);
                    defineExport(spec.exported.name, binding || local);
                }
                s.remove(node.start, node.end);
            }
        }
        // default export
        if (node.type === 'ExportDefaultDeclaration') {
            s.overwrite(node.start, node.start + 14, `${moduleKey}.default =`);
        }
        // export * from './foo'
        if (node.type === 'ExportAllDeclaration') {
            const importId = defineImport(node, node.source.value);
            s.remove(node.start, node.end);
            s.append(`\nfor (const key in ${importId}) {
        if (key !== 'default') {
          ${exportKey}(${moduleKey}, key, () => ${importId}[key])
        }
      }`);
        }
    }
    // 3. convert references to import bindings
    for (const node of ast) {
        if (node.type === 'ImportDeclaration')
            continue;
        walkIdentifiers(node, (id, parent, parentStack) => {
            const binding = idToImportMap.get(id.name);
            if (!binding) {
                return;
            }
            if (isStaticProperty(parent) && parent.shorthand) {
                // let binding used in a property shorthand
                // { foo } -> { foo: __import_x__.foo }
                // skip for destructure patterns
                if (!parent.inPattern ||
                    isInDestructureAssignment(parent, parentStack)) {
                    s.appendLeft(id.end, `: ${binding}`);
                }
            }
            else if (parent.type === 'ClassDeclaration' &&
                id === parent.superClass) {
                if (!declaredConst.has(id.name)) {
                    declaredConst.add(id.name);
                    // locate the top-most node containing the class declaration
                    const topNode = parentStack[1];
                    s.prependRight(topNode.start, `const ${id.name} = ${binding};\n`);
                }
            }
            else {
                s.overwrite(id.start, id.end, binding);
            }
        });
    }
    walk(ast, {
        enter(node, parent) {
            if (node.type === 'Import' && parent.type === 'CallExpression') {
                const arg = parent.arguments[0];
                if (arg.type === 'StringLiteral' && arg.value.startsWith('./')) {
                    s.overwrite(node.start, node.start + 6, dynamicImportKey);
                    s.overwrite(arg.start, arg.end, JSON.stringify(arg.value.replace(/^\.\/+/, '')));
                }
            }
        }
    });
    // append CSS injection code
    if (css) {
        s.append(`\nwindow.__css__ += ${JSON.stringify(css)}`);
    }
    const processed = [mainCode.value, s.toString()];
    if (importedFiles.size) {
        for (const imported of importedFiles) {
            const fileList = await processFile(store.files[imported], seen);
            processed.push(...fileList);
        }
    }
    // return a list of files to further process
    return processed;
}
const isStaticProperty = (node) => node.type === 'ObjectProperty' && !node.computed;
function extractNames(param) {
    return extractIdentifiers(param).map(id => id.name);
}
function extractIdentifiers(param, nodes = []) {
    switch (param.type) {
        case 'Identifier':
            nodes.push(param);
            break;
        case 'MemberExpression':
            let object = param;
            while (object.type === 'MemberExpression') {
                object = object.object;
            }
            nodes.push(object);
            break;
        case 'ObjectPattern':
            param.properties.forEach(prop => {
                if (prop.type === 'RestElement') {
                    extractIdentifiers(prop.argument, nodes);
                }
                else {
                    extractIdentifiers(prop.value, nodes);
                }
            });
            break;
        case 'ArrayPattern':
            param.elements.forEach(element => {
                if (element)
                    extractIdentifiers(element, nodes);
            });
            break;
        case 'RestElement':
            extractIdentifiers(param.argument, nodes);
            break;
        case 'AssignmentPattern':
            extractIdentifiers(param.left, nodes);
            break;
    }
    return nodes;
}
function isInDestructureAssignment(parent, parentStack) {
    if (parent &&
        (parent.type === 'ObjectProperty' || parent.type === 'ArrayPattern')) {
        let i = parentStack.length;
        while (i--) {
            const p = parentStack[i];
            if (p.type === 'AssignmentExpression') {
                return true;
            }
            else if (p.type !== 'ObjectProperty' && !p.type.endsWith('Pattern')) {
                break;
            }
        }
    }
    return false;
}

const IMPORT_MAPS_KEY = Symbol();
const EXTERNALS_KEY = Symbol();
const IS_LOADING_PREVIEW = Symbol();
const ES_MODULES = Symbol();

pushScopeId("data-v-9f50ebd0");
const _hoisted_1$2 = { class: "sfc-sandbox__editor" };
const _hoisted_2$2 = { class: "editor-header" };
const _hoisted_3 = { class: "editor-header__left" };
const _hoisted_4 = { class: "editor-container" };
popScopeId();
var script$4 = defineComponent({
    expose: [],
    props: {
        sfcFilename: { type: String, default: 'App.vue' },
        sfcCode: { type: String, default: '' }
    },
    setup(__props) {
        const props = __props;
        const isLoading = inject(IS_LOADING_PREVIEW);
        const esModules = inject(ES_MODULES);
        const onChange = debounce(async (code) => {
            isLoading.value = true;
            esModules.value = [];
            changeFile(props.sfcFilename, code);
            const modules = await compileModules(props.sfcFilename);
            esModules.value = modules;
            isLoading.value = false;
        }, 250);
        const activeCode = ref(props.sfcCode);
        const activeMode = computed(() => (props.sfcFilename.endsWith('.vue') ? 'htmlmixed' : 'javascript'));
        watch(() => activeCode.value, (newVal) => onChange(newVal), {
            immediate: true
        });
        onMounted(() => {
            if (props.sfcCode !== '') {
                addFile(props.sfcFilename, props.sfcCode);
                activeCode.value = props.sfcCode;
            }
        });
        return (_ctx, _cache) => {
            return (openBlock(), createBlock(Fragment, null, [
                createCommentVNode(" <FileSelector/> "),
                createVNode("div", _hoisted_1$2, [
                    createVNode("header", _hoisted_2$2, [
                        createVNode("div", _hoisted_3, toDisplayString(__props.sfcFilename), 1 /* TEXT */)
                    ]),
                    createVNode("main", _hoisted_4, [
                        createVNode(script$5, {
                            modelValue: activeCode.value,
                            "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => (activeCode.value = $event)),
                            mode: unref(activeMode)
                        }, null, 8 /* PROPS */, ["modelValue", "mode"]),
                        createCommentVNode(" <Message :err=\"fileErrors\" /> ")
                    ])
                ])
            ], 2112 /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */));
        };
    }
});

var css_248z$4 = ".sfc-sandbox__editor[data-v-9f50ebd0]{height:100%}.sfc-sandbox__editor[data-v-9f50ebd0] .editor-header[data-v-9f50ebd0]{display:flex;height:40px;justify-content:space-between;align-items:center;background-color:#f0f4fc}.sfc-sandbox__editor[data-v-9f50ebd0] .editor-header[data-v-9f50ebd0] .editor-header__left[data-v-9f50ebd0]{padding:10px 12px;font-weight:500}.sfc-sandbox__editor[data-v-9f50ebd0] .editor-container[data-v-9f50ebd0]{height:calc(100% - 40px);overflow:hidden;position:relative}";
styleInject(css_248z$4);

script$4.__scopeId = "data-v-9f50ebd0";
script$4.__file = "packages/sandbox/SandboxEditor.vue";

const _withId = /*#__PURE__*/ withScopeId("data-v-7de6be8b");
var script$3 = defineComponent({
    expose: [],
    props: ['err', 'warn'],
    setup(__props) {
        const props = __props;
        const dismissed = ref(false);
        watch(() => [props.err, props.warn], () => {
            dismissed.value = false;
        });
        function formatMessage(err) {
            if (typeof err === 'string') {
                return err;
            }
            else {
                let msg = err.message;
                const loc = err.loc;
                if (loc && loc.start) {
                    msg = `(${loc.start.line}:${loc.start.column}) ` + msg;
                }
                return msg;
            }
        }
        return (_ctx, _cache) => {
            return (openBlock(), createBlock(Transition, { name: "fade" }, {
                default: _withId(() => [
                    (!dismissed.value && (__props.err || __props.warn))
                        ? (openBlock(), createBlock("pre", {
                            key: 0,
                            class: ["msg", __props.err ? 'err' : 'warn'],
                            onClick: _cache[1] || (_cache[1] = ($event) => (dismissed.value = true))
                        }, "      " + toDisplayString(formatMessage(__props.err || __props.warn)) + "\n    ", 3 /* TEXT, CLASS */))
                        : createCommentVNode("v-if", true)
                ]),
                _: 1 /* STABLE */
            }));
        };
    }
});

var css_248z$3 = ".msg[data-v-7de6be8b]{position:absolute;bottom:0;left:8px;right:8px;z-index:10;padding:14px 20px;border:2px solid transparent;border-radius:6px;font-family:var(--font-code);white-space:pre-wrap;max-height:calc(100% - 50px);overflow-y:scroll}.msg.err[data-v-7de6be8b]{color:red;border-color:red;background-color:#ffd7d7}.msg.warn[data-v-7de6be8b]{--color:#695f1b;color:var(--color);border-color:var(--color);background-color:#f7f0cd}.fade-enter-active[data-v-7de6be8b],.fade-leave-active[data-v-7de6be8b]{transition:all .15s ease-out}.fade-enter-from[data-v-7de6be8b],.fade-leave-to[data-v-7de6be8b]{opacity:0;transform:translateY(10px)}";
styleInject(css_248z$3);

script$3.__scopeId = "data-v-7de6be8b";
script$3.__file = "packages/sandbox/Message.vue";

var srcdoc = "<!doctype html>\n<html>\n\t<head>\n\t\t<style>\n\t\t\tbody {\n\t\t\t\tfont-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto,\n\t\t\t\t\tOxygen, Ubuntu, Cantarell, \"Open Sans\", \"Helvetica Neue\", sans-serif;\n\t\t\t\tmargin: 0;\n\t\t\t}\n\t\t</style>\n\t\t<style id=\"__sfc-styles\"></style>\n\t\t<script>window.process = { env: {} }</script>\n\t\t<script>\n\t\t\t(() => {\n\t\t\t\tlet scriptEls = []\n\t\t\t\tlet cdnEls = []\n\n\t\t\t\twindow.__modules__ = {}\n\n\t\t\t\twindow.__export__ = (mod, key, get) => {\n\t\t\t\t\tObject.defineProperty(mod, key, {\n\t\t\t\t\t\tenumerable: true,\n\t\t\t\t\t\tconfigurable: true,\n\t\t\t\t\t\tget\n\t\t\t\t\t})\n\t\t\t\t}\n\n\t\t\t\twindow.__dynamic_import__ = key => {\n\t\t\t\t\treturn Promise.resolve(window.__modules__[key])\n\t\t\t\t}\n\n\t\t\t\tasync function handle_message(ev) {\n\t\t\t\t\tif (ev.srcElement.frameElement.id !== ev.data.args.uuid) return\n\t\t\t\t\tlet { action, cmd_id } = ev.data;\n\t\t\t\t\tconst send_message = (payload) => parent.postMessage( { ...payload }, ev.origin);\n\t\t\t\t\tconst send_reply = (payload) => send_message({ ...payload, cmd_id });\n\t\t\t\t\tconst send_ok = () => send_reply({ action: 'cmd_ok' });\n\t\t\t\t\tconst send_error = (message, stack) => send_reply({ action: 'cmd_error', message, stack });\n\n\t\t\t\t\tif (action === 'evalESM') {\n\t\t\t\t\t\ttry {\n\t\t\t\t\t\t\tif (scriptEls.length) {\n\t\t\t\t\t\t\t\tscriptEls.forEach(el => {\n\t\t\t\t\t\t\t\t\tdocument.head.removeChild(el)\n\t\t\t\t\t\t\t\t})\n\t\t\t\t\t\t\t\tscriptEls.length = 0\n\t\t\t\t\t\t\t}\n\n\t\t\t\t\t\t\tlet { script: scripts } = ev.data.args\n\t\t\t\t\t\t\tif (typeof scripts === 'string') scripts = [scripts]\n\n\t\t\t\t\t\t\tfor (const script of scripts) {\n\t\t\t\t\t\t\t\t// console.log(script)\n\t\t\t\t\t\t\t\tconst scriptEl = document.createElement('script')\n\t\t\t\t\t\t\t\tscriptEl.setAttribute('type', 'module')\n\t\t\t\t\t\t\t\t// send ok in the module script to ensure sequential evaluation\n\t\t\t\t\t\t\t\t// of multiple proxy.eval() calls\n\t\t\t\t\t\t\t\tconst done = new Promise((resolve) => {\n\t\t\t\t\t\t\t\t\twindow.__next__ = resolve\n\t\t\t\t\t\t\t\t})\n\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\tscriptEl.innerHTML = script + `\\nwindow.__next__()`\n\t\t\t\t\t\t\t\tdocument.head.appendChild(scriptEl)\n\t\t\t\t\t\t\t\tscriptEl.onrror = err => send_error(err.message, err.stack)\n\t\t\t\t\t\t\t\tscriptEls.push(scriptEl)\n\t\t\t\t\t\t\t\tawait done\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\twindow.__next__ = undefined\n\t\t\t\t\t\t\tsend_ok()\n\t\t\t\t\t\t} catch (e) {\n\t\t\t\t\t\t\tsend_error(e.message, e.stack);\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\n\t\t\t\t\tif (action === 'evalCDN') {\n\t\t\t\t\t\ttry {\n\t\t\t\t\t\t\tif (cdnEls.length) {\n\t\t\t\t\t\t\t\tcdnEls.forEach(el => {\n\t\t\t\t\t\t\t\t\tdocument.head.removeChild(el)\n\t\t\t\t\t\t\t\t})\n\t\t\t\t\t\t\t\tcdnEls.length = 0\n\t\t\t\t\t\t\t}\n\n\t\t\t\t\t\t\tlet { srcs } = ev.data.args\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\tfor (const src of srcs) {\n\t\t\t\t\t\t\t\tconst cdnEl = document.createElement('script')\n\t\t\t\t\t\t\t\tcdnEl.setAttribute('src', src)\n\t\t\t\t\t\t\t\tdocument.head.appendChild(cdnEl)\n\t\t\t\t\t\t\t\tcdnEls.onrror = err => send_error(err.message, err.stack)\n\t\t\t\t\t\t\t\tcdnEls.push(cdnEl)\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\tsend_ok()\n\t\t\t\t\t\t} catch (e) {\n\t\t\t\t\t\t\tsend_error(e.message, e.stack)\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\n\t\t\t\t\tif (action === 'catch_clicks') {\n\t\t\t\t\t\ttry {\n\t\t\t\t\t\t\tconst top_origin = ev.origin;\n\t\t\t\t\t\t\tdocument.body.addEventListener('click', event => {\n\t\t\t\t\t\t\t\tif (event.which !== 1) return;\n\t\t\t\t\t\t\t\tif (event.metaKey || event.ctrlKey || event.shiftKey) return;\n\t\t\t\t\t\t\t\tif (event.defaultPrevented) return;\n\n\t\t\t\t\t\t\t\t// ensure target is a link\n\t\t\t\t\t\t\t\tlet el = event.target;\n\t\t\t\t\t\t\t\twhile (el && el.nodeName !== 'A') el = el.parentNode;\n\t\t\t\t\t\t\t\tif (!el || el.nodeName !== 'A') return;\n\n\t\t\t\t\t\t\t\tif (el.hasAttribute('download') || el.getAttribute('rel') === 'external' || el.target) return;\n\n\t\t\t\t\t\t\t\tevent.preventDefault();\n\n\t\t\t\t\t\t\t\tif (el.href.startsWith(top_origin)) {\n\t\t\t\t\t\t\t\t\tconst url = new URL(el.href);\n\t\t\t\t\t\t\t\t\tif (url.hash[0] === '#') {\n\t\t\t\t\t\t\t\t\t\twindow.location.hash = url.hash;\n\t\t\t\t\t\t\t\t\t\treturn;\n\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t}\n\n\t\t\t\t\t\t\t\twindow.open(el.href, '_blank');\n\t\t\t\t\t\t\t});\n\t\t\t\t\t\t\tsend_ok();\n\t\t\t\t\t\t} catch(e) {\n\t\t\t\t\t\t\tsend_error(e.message, e.stack);\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t}\n\n\t\t\t\twindow.addEventListener('message', handle_message, false);\n\n\t\t\t\twindow.onerror = function (msg, url, lineNo, columnNo, error) {\n\t\t\t\t\tif (msg.includes('module specifier “vue”')) {\n\t\t\t\t\t\t// firefox only error, ignore\n\t\t\t\t\t\treturn false\n\t\t\t\t\t}\n\t\t\t\t\ttry {\n\t\t\t\t\t\tparent.postMessage({ action: 'error', value: error }, '*');\n\t\t\t\t\t} catch (e) {\n\t\t\t\t\t\tparent.postMessage({ action: 'error', value: msg }, '*');\n\t\t\t\t\t}\n\t\t\t\t}\n\n\t\t\t\twindow.addEventListener(\"unhandledrejection\", event => {\n\t\t\t\t\tif (event.reason.message.includes('Cross-origin')) {\n\t\t\t\t\t\tevent.preventDefault()\n\t\t\t\t\t\treturn\n\t\t\t\t\t}\n\t\t\t\t\ttry {\n\t\t\t\t\t\tparent.postMessage({ action: 'unhandledrejection', value: event.reason }, '*');\n\t\t\t\t\t} catch (e) {\n\t\t\t\t\t\tparent.postMessage({ action: 'unhandledrejection', value: event.reason.message }, '*');\n\t\t\t\t\t}\n\t\t\t\t});\n\n\t\t\t\tlet previous = { level: null, args: null };\n\n\t\t\t\t['clear', 'log', 'info', 'dir', 'warn', 'error', 'table'].forEach((level) => {\n\t\t\t\t\tconst original = console[level];\n\t\t\t\t\tconsole[level] = (...args) => {\n\t\t\t\t\t\tconst msg = String(args[0])\n\t\t\t\t\t\tif (\n\t\t\t\t\t\t\tmsg.includes('You are running a development build of Vue') ||\n\t\t\t\t\t\t\tmsg.includes('You are running the esm-bundler build of Vue')\n\t\t\t\t\t\t) {\n\t\t\t\t\t\t\treturn\n\t\t\t\t\t\t}\n\t\t\t\t\t\tconst stringifiedArgs = stringify(args);\n\t\t\t\t\t\tif (\n\t\t\t\t\t\t\tprevious.level === level &&\n\t\t\t\t\t\t\tprevious.args &&\n\t\t\t\t\t\t\tprevious.args === stringifiedArgs\n\t\t\t\t\t\t) {\n\t\t\t\t\t\t\tparent.postMessage({ action: 'console', level, duplicate: true }, '*');\n\t\t\t\t\t\t} else {\n\t\t\t\t\t\t\tprevious = { level, args: stringifiedArgs };\n\n\t\t\t\t\t\t\ttry {\n\t\t\t\t\t\t\t\tparent.postMessage({ action: 'console', level, args }, '*');\n\t\t\t\t\t\t\t} catch (err) {\n\t\t\t\t\t\t\t\tparent.postMessage({ action: 'console', level, args: args.map(a => {\n\t\t\t\t\t\t\t\t\treturn a instanceof Error ? a.message : String(a)\n\t\t\t\t\t\t\t\t}) }, '*');\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t}\n\n\t\t\t\t\t\toriginal(...args);\n\t\t\t\t\t}\n\t\t\t\t});\n\n\t\t\t\t[\n\t\t\t\t\t{ method: 'group', action: 'console_group' },\n\t\t\t\t\t{ method: 'groupEnd', action: 'console_group_end' },\n\t\t\t\t\t{ method: 'groupCollapsed', action: 'console_group_collapsed' },\n\t\t\t\t].forEach((group_action) => {\n\t\t\t\t\tconst original = console[group_action.method];\n\t\t\t\t\tconsole[group_action.method] = (label) => {\n\t\t\t\t\t\tparent.postMessage({ action: group_action.action, label }, '*');\n\n\t\t\t\t\t\toriginal(label);\n\t\t\t\t\t};\n\t\t\t\t});\n\n\t\t\t\tconst timers = new Map();\n\t\t\t\tconst original_time = console.time;\n\t\t\t\tconst original_timelog = console.timeLog;\n\t\t\t\tconst original_timeend = console.timeEnd;\n\n\t\t\t\tconsole.time = (label = 'default') => {\n\t\t\t\t\toriginal_time(label);\n\t\t\t\t\ttimers.set(label, performance.now());\n\t\t\t\t}\n\t\t\t\tconsole.timeLog = (label = 'default') => {\n\t\t\t\t\toriginal_timelog(label);\n\t\t\t\t\tconst now = performance.now();\n\t\t\t\t\tif (timers.has(label)) {\n\t\t\t\t\t\tparent.postMessage({ action: 'console', level: 'system-log', args: [`${label}: ${now - timers.get(label)}ms`] }, '*');\n\t\t\t\t\t} else {\n\t\t\t\t\t\tparent.postMessage({ action: 'console', level: 'system-warn', args: [`Timer '${label}' does not exist`] }, '*');\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t\tconsole.timeEnd = (label = 'default') => {\n\t\t\t\t\toriginal_timeend(label);\n\t\t\t\t\tconst now = performance.now();\n\t\t\t\t\tif (timers.has(label)) {\n\t\t\t\t\t\tparent.postMessage({ action: 'console', level: 'system-log', args: [`${label}: ${now - timers.get(label)}ms`] }, '*');\n\t\t\t\t\t} else {\n\t\t\t\t\t\tparent.postMessage({ action: 'console', level: 'system-warn', args: [`Timer '${label}' does not exist`] }, '*');\n\t\t\t\t\t}\n\t\t\t\t\ttimers.delete(label);\n\t\t\t\t};\n\n\t\t\t\tconst original_assert = console.assert;\n\t\t\t\tconsole.assert = (condition, ...args) => {\n\t\t\t\t\tif (condition) {\n\t\t\t\t\t\tconst stack = new Error().stack;\n\t\t\t\t\t\tparent.postMessage({ action: 'console', level: 'assert', args, stack }, '*');\n\t\t\t\t\t}\n\t\t\t\t\toriginal_assert(condition, ...args);\n\t\t\t\t};\n\n\t\t\t\tconst counter = new Map();\n\t\t\t\tconst original_count = console.count;\n\t\t\t\tconst original_countreset = console.countReset;\n\n\t\t\t\tconsole.count = (label = 'default') => {\n\t\t\t\t\tcounter.set(label, (counter.get(label) || 0) + 1);\n\t\t\t\t\tparent.postMessage({ action: 'console', level: 'system-log', args: `${label}: ${counter.get(label)}` }, '*');\n\t\t\t\t\toriginal_count(label);\n\t\t\t\t};\n\n\t\t\t\tconsole.countReset = (label = 'default') => {\n\t\t\t\t\tif (counter.has(label)) {\n\t\t\t\t\t\tcounter.set(label, 0);\n\t\t\t\t\t} else {\n\t\t\t\t\t\tparent.postMessage({ action: 'console', level: 'system-warn', args: `Count for '${label}' does not exist` }, '*');\n\t\t\t\t\t}\n\t\t\t\t\toriginal_countreset(label);\n\t\t\t\t};\n\n\t\t\t\tconst original_trace = console.trace;\n\n\t\t\t\tconsole.trace = (...args) => {\n\t\t\t\t\tconst stack = new Error().stack;\n\t\t\t\t\tparent.postMessage({ action: 'console', level: 'trace', args, stack }, '*');\n\t\t\t\t\toriginal_trace(...args);\n\t\t\t\t};\n\n\t\t\t\tfunction stringify(args) {\n\t\t\t\t\ttry {\n\t\t\t\t\t\treturn JSON.stringify(args);\n\t\t\t\t\t} catch (error) {\n\t\t\t\t\t\treturn null;\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t})()\n\t\t</script>\n\n\t\t<!-- ES Module Shims: Import maps polyfill for modules browsers without import maps support (all except Chrome 89+) -->\n\t\t<script async src=\"//cdn.jsdelivr.net/npm/es-module-shims@0.10.1/dist/es-module-shims.js\"></script>\n\t\t<script type=\"importmap\"><!--IMPORT_MAP--></script>\n\t</head>\n\t<body>\n    <div id=\"app\"></div>\n  </body>\n</html>";

// ReplProxy and srcdoc implementation from Svelte REPL
// MIT License https://github.com/sveltejs/svelte-repl/blob/master/LICENSE
let uid = 1;
class ReplProxy {
    constructor(iframe, handlers) {
        this.iframe = iframe;
        this.handlers = handlers;
        this.pending_cmds = new Map();
        this.handle_event = e => this.handle_repl_message(e);
        window.addEventListener('message', this.handle_event, false);
    }
    destroy() {
        window.removeEventListener('message', this.handle_event);
    }
    iframe_command(action, args) {
        return new Promise((resolve, reject) => {
            const cmd_id = uid++;
            this.pending_cmds.set(cmd_id, { resolve, reject });
            this.iframe.contentWindow.postMessage({ action, cmd_id, args }, '*');
        });
    }
    handle_command_message(cmd_data) {
        let action = cmd_data.action;
        let id = cmd_data.cmd_id;
        let handler = this.pending_cmds.get(id);
        if (handler) {
            this.pending_cmds.delete(id);
            if (action === 'cmd_error') {
                let { message, stack } = cmd_data;
                let e = new Error(message);
                e.stack = stack;
                handler.reject(e);
            }
            if (action === 'cmd_ok') {
                handler.resolve(cmd_data.args);
            }
        }
        else {
            console.error('command not found', id, cmd_data, [
                ...this.pending_cmds.keys()
            ]);
        }
    }
    handle_repl_message(event) {
        if (event.source !== this.iframe.contentWindow)
            return;
        const { action, args } = event.data;
        switch (action) {
            case 'cmd_error':
            case 'cmd_ok':
                return this.handle_command_message(event.data);
            case 'fetch_progress':
                return this.handlers.on_fetch_progress(args.remaining);
            case 'error':
                return this.handlers.on_error(event.data);
            case 'unhandledrejection':
                return this.handlers.on_unhandled_rejection(event.data);
            case 'console':
                return this.handlers.on_console(event.data);
            case 'console_group':
                return this.handlers.on_console_group(event.data);
            case 'console_group_collapsed':
                return this.handlers.on_console_group_collapsed(event.data);
            case 'console_group_end':
                return this.handlers.on_console_group_end(event.data);
        }
    }
    evalESM(script, uuid) {
        return this.iframe_command('evalESM', { script, uuid });
    }
    evalCDN(srcs, uuid) {
        return this.iframe_command('evalCDN', { srcs, uuid });
    }
    handle_links() {
        return this.iframe_command('catch_clicks', {});
    }
}

const _hoisted_1$1 = { class: "sfc-sandbox__preview" };
const _hoisted_2$1 = /*#__PURE__*/ createVNode("header", { class: "preview-header" }, [
    /*#__PURE__*/ createVNode("div", { class: "preview-header__left" }, " Preview ")
], -1 /* HOISTED */);
var script$2 = defineComponent({
    expose: [],
    props: {
        sfcFilename: { type: String, default: 'App.vue' }
    },
    setup(__props) {
        const props = __props;
        /* eslint-disable @typescript-eslint/no-explicit-any */
        const container = ref();
        const runtimeError = ref();
        const runtimeWarning = ref();
        const uuid = ref(btoa(Date.now().toString()));
        let sandbox;
        let proxy;
        let stopUpdateWatcher;
        const importMaps = inject(IMPORT_MAPS_KEY);
        const externals = inject(EXTERNALS_KEY);
        const isLoadingPreview = inject(IS_LOADING_PREVIEW);
        const esModules = inject(ES_MODULES);
        const fileErrors = computed(() => store.files[props.sfcFilename]?.compiled?.errors[0]);
        // create sandbox on mount
        onMounted(createSandbox);
        onUnmounted(() => {
            proxy.destroy();
            stopUpdateWatcher && stopUpdateWatcher();
        });
        const loadImportMap = () => {
            const importMap = JSON.parse(store.importMap || '{}');
            if (!importMap.imports) {
                importMap.imports = {};
            }
            importMap.imports.vue = 'https://cdn.jsdelivr.net/npm/vue@next/dist/vue.runtime.esm-browser.js';
            if (importMaps) {
                Object.keys(importMaps).forEach(key => {
                    if (!importMap.imports[key]) {
                        importMap.imports[key] = importMaps[key];
                    }
                });
            }
            return importMap;
        };
        function createSandbox() {
            if (sandbox) {
                // clear prev sandbox
                proxy.destroy();
                stopUpdateWatcher();
                container.value.removeChild(sandbox);
            }
            sandbox = document.createElement('iframe');
            sandbox.setAttribute('id', uuid.value);
            sandbox.setAttribute('sandbox', [
                'allow-forms',
                'allow-modals',
                'allow-pointer-lock',
                'allow-popups',
                'allow-same-origin',
                'allow-scripts',
                'allow-top-navigation-by-user-activation'
            ].join(' '));
            const importMap = loadImportMap();
            const sandboxSrc = srcdoc.replace(/<!--IMPORT_MAP-->/, JSON.stringify(importMap));
            sandbox.srcdoc = sandboxSrc;
            container.value.appendChild(sandbox);
            // sandbox.removeAttribute('srcdoc')
            proxy = new ReplProxy(sandbox, {
                on_fetch_progress: () => {
                    // pending_imports = progress;
                },
                on_error: (event) => {
                    const msg = event.value instanceof Error ? event.value.message : event.value;
                    if (msg.includes('Failed to resolve module specifier') ||
                        msg.includes('Error resolving module specifier')) {
                        runtimeError.value = msg.replace(/\. Relative references must.*$/, '') +
                            // '.\nTip: add an "import-map.json" file to specify import paths for dependencies.'
                            '.\nTip: specify import paths for dependencies in [imports-map] props on sandbox components';
                    }
                    else {
                        runtimeError.value = event.value;
                    }
                },
                on_unhandled_rejection: (event) => {
                    let error = event.value;
                    if (typeof error === 'string') {
                        error = { message: error };
                    }
                    runtimeError.value = 'Uncaught (in promise): ' + error.message;
                },
                on_console: (log) => {
                    if (log.level === 'error') {
                        if (log.args[0] instanceof Error) {
                            runtimeError.value = log.args[0].message;
                        }
                        else {
                            runtimeError.value = log.args[0];
                        }
                    }
                    else if (log.level === 'warn') {
                        if (log.args[0].toString().includes('[Vue warn]')) {
                            runtimeWarning.value = log.args
                                .join('')
                                .replace(/\[Vue warn\]:/, '')
                                .trim();
                        }
                    }
                },
                on_console_group: (action) => {
                    // group_logs(action.label, false);
                },
                on_console_group_end: () => {
                    // ungroup_logs();
                },
                on_console_group_collapsed: (action) => {
                    // group_logs(action.label, true);
                }
            });
            sandbox.addEventListener('load', () => {
                proxy.handle_links();
                stopUpdateWatcher = watchEffect(updatePreview);
            });
        }
        async function updatePreview() {
            console.clear();
            runtimeError.value = null;
            runtimeWarning.value = null;
            try {
                isLoadingPreview.value = true;
                // const modules = await compileModules(props.sfcFilename)
                const modules = toRaw(esModules.value);
                if (externals && externals.length > 0) {
                    await proxy.evalCDN(externals, uuid.value);
                }
                if (modules && modules.length > 0) {
                    await proxy.evalESM(modules, uuid.value);
                }
                isLoadingPreview.value = false;
            }
            catch (e) {
                console.log(e);
                isLoadingPreview.value = false;
                runtimeError.value = e.message;
            }
        }
        return (_ctx, _cache) => {
            return (openBlock(), createBlock("div", _hoisted_1$1, [
                _hoisted_2$1,
                createVNode("main", {
                    class: "preview-container",
                    ref: container
                }, null, 512 /* NEED_PATCH */),
                createVNode(script$3, {
                    err: runtimeError.value || unref(fileErrors)
                }, null, 8 /* PROPS */, ["err"]),
                (!runtimeError.value)
                    ? (openBlock(), createBlock(script$3, {
                        key: 0,
                        warn: runtimeWarning.value
                    }, null, 8 /* PROPS */, ["warn"]))
                    : createCommentVNode("v-if", true)
            ]));
        };
    }
});

var css_248z$2 = ".sfc-sandbox__preview,iframe{width:100%;height:100%;border:none;background-color:#fff}.sfc-sandbox__preview .preview-header{display:flex;height:40px;justify-content:space-between;align-items:center;background-color:#f4f8fe}.sfc-sandbox__preview .preview-header .preview-header__left{padding:10px 12px;font-weight:500}.sfc-sandbox__preview .preview-container{width:100%;height:calc(100% - 40px);border:none;background-color:#fff}";
styleInject(css_248z$2);

script$2.__file = "packages/sandbox/SandboxPreview.vue";

const _hoisted_1 = { class: "sfc-sandbox__loading-mask" };
const _hoisted_2 = /*#__PURE__*/createVNode("div", { class: "loading-spinner" }, [
  /*#__PURE__*/createVNode("svg", {
    class: "circular",
    viewBox: "25 25 50 50"
  }, [
    /*#__PURE__*/createVNode("circle", {
      class: "path",
      cx: "50",
      cy: "50",
      r: "20",
      fill: "none"
    })
  ])
], -1 /* HOISTED */);

function render(_ctx, _cache) {
  return (openBlock(), createBlock("div", _hoisted_1, [
    _hoisted_2
  ]))
}

var css_248z$1 = ".sfc-sandbox__loading-mask{position:absolute;z-index:2000;background-color:hsla(0,0%,100%,.9);margin:0;top:0;right:0;bottom:0;left:0;transition:opacity .3s}.sfc-sandbox__loading-mask .loading-spinner{top:50%;margin-top:-21px;width:100%;text-align:center;position:absolute}.sfc-sandbox__loading-mask .circular{width:42px;height:42px;-webkit-animation:loading-rotate 2s linear infinite;animation:loading-rotate 2s linear infinite}.sfc-sandbox__loading-mask .path{-webkit-animation:loading-dash 1.5s ease-in-out infinite;animation:loading-dash 1.5s ease-in-out infinite;stroke-dasharray:90,150;stroke-dashoffset:0;stroke-width:2;stroke:#5282e4;stroke-linecap:round}@-webkit-keyframes loading-rotate{to{transform:rotate(1turn)}}@keyframes loading-rotate{to{transform:rotate(1turn)}}@-webkit-keyframes loading-dash{0%{stroke-dasharray:1,200;stroke-dashoffset:0}50%{stroke-dasharray:90,150;stroke-dashoffset:-40px}to{stroke-dasharray:90,150;stroke-dashoffset:-120px}}@keyframes loading-dash{0%{stroke-dasharray:1,200;stroke-dashoffset:0}50%{stroke-dasharray:90,150;stroke-dashoffset:-40px}to{stroke-dasharray:90,150;stroke-dashoffset:-120px}}";
styleInject(css_248z$1);

const script$1 = {};

script$1.render = render;
script$1.__file = "packages/components/LoadingMask.vue";

var script = defineComponent({
    expose: [],
    props: {
        // sandbox height unit (px)
        height: { type: Number, default: 400 },
        importMaps: { type: Object, default: () => ({}) },
        externals: { type: Array, default: () => ([]) },
        sfcFilename: { type: String, default: '' },
        sfcCode: { type: String, default: '' }
    },
    setup(__props) {
        const props = __props;
        const isLoadingPreview = ref(false);
        const esModules = ref([]);
        provide(IMPORT_MAPS_KEY, props.importMaps);
        provide(EXTERNALS_KEY, props.externals);
        provide(IS_LOADING_PREVIEW, isLoadingPreview);
        provide(ES_MODULES, esModules);
        watch(isLoadingPreview, (newVal, oldVal) => {
            if (oldVal) {
                const styles = [
                    'color: white',
                    'background: #42b983',
                    'margin-left: 4px',
                    'padding: 2px 4px',
                    'border-radius: 2px'
                ].join(';');
                console.log(`SFC File %c${props.sfcFilename}%c is Rendered`, styles, '');
            }
        });
        const sandboxStyles = computed(() => {
            return {
                height: `${props.height}px`
            };
        });
        const handleResized = (panes) => {
            console.log(panes);
        };
        return (_ctx, _cache) => {
            return (openBlock(), createBlock(script$6, {
                class: "sfc-sandbox",
                style: unref(sandboxStyles),
                onResized: handleResized
            }, {
                left: withCtx(() => [
                    createVNode(script$4, {
                        "sfc-filename": __props.sfcFilename,
                        "sfc-code": __props.sfcCode
                    }, null, 8 /* PROPS */, ["sfc-filename", "sfc-code"])
                ]),
                right: withCtx(() => [
                    createCommentVNode(" <Suspense>\n        <template #default v-if=\"esModules\">\n          <sandbox-preview />\n        </template>\n        <template #fallback>\n          <loading-mask v-if=\"isLoadingPreview\" />\n        </template>\n      </Suspense> "),
                    withDirectives(createVNode(script$2, { "sfc-filename": __props.sfcFilename }, null, 8 /* PROPS */, ["sfc-filename"]), [
                        [vShow, esModules.value]
                    ]),
                    (isLoadingPreview.value)
                        ? (openBlock(), createBlock(script$1, { key: 0 }))
                        : createCommentVNode("v-if", true)
                ]),
                _: 1 /* STABLE */
            }, 8 /* PROPS */, ["style"]));
        };
    }
});

var css_248z = ".sfc-sandbox{box-sizing:content-box;border:1px solid #ebebeb;border-radius:2px;margin:20px;font-size:13px}.sfc-sandbox--editor,.sfc-sandbox--preview{width:50%}.sfc-sandbox--editor{border-right:1px dashed #ebebeb}.sfc-sandbox:hover{box-shadow:0 0 10px 0 rgba(232,237,250,.6),0 2px 4px 0 rgba(232,237,250,.6)}";
styleInject(css_248z);

script.__file = "packages/sandbox/index.vue";

const install = (app) => {
    app.component('SfcSandbox', script);
    app.component('SplitPane', script$6);
    app.component('LoadingMask', script$1);
};

export default install;
export { script as SfcSandbox, script$6 as SplitPane };
