// import {Nodebox} from "@codesandbox/nodebox"
// import {useEffect, useState} from "react"

import parse from "html-react-parser"
import {Block} from "./block"

// const runtime = new Nodebox({
//     iframe: document.getElementById("nodebox-iframe") as HTMLIFrameElement,
// })

// await runtime.connect()
// await runtime.fs.init({
//     "package.json": JSON.stringify({
//         name: "component-renderer",
//         dependencies: {
//             "@babel/core": "^7.26.9",
//             "@babel/preset-react": "^7.26.3",
//         },
//     }),
//     "main.js": `
//         import babel from "@babel/core"
//         import presetReact from "@babel/preset-react"
//         import fs from "fs/promises"
//         const transformed = babel.transformSync(process.argv[2], {
//             presets: [presetReact],
//         })
//         await fs.writeFile("output.js", transformed.code)
//     `,
// })
// const shell = runtime.shell.create()

// async function renderComponent(code: string): Promise<any> {
//     return await new Promise(async (resolve) => {
//         await shell.runCommand("node", ["main.js", code])
//         shell.on("exit", async () => {
//             resolve(await runtime.fs.readFile("output.js"))
//         })
//     })
// }

// export default function Component({code}: ComponentProps) {
//     const [transformedCode, setTransformedCode] = useState<string>()
//     useEffect(() => {
//         renderComponent(code).then(setTransformedCode)
//     }, [code])
//     if (!transformedCode) {
//         return <div>Rendering...</div>
//     }
//     try {
//         return eval(transformedCode)
//     } catch (e) {
//         if (!(e instanceof Error)) return
//         return (
//             <div>
//                 <h1>Failed to evaluate transformed component code:</h1>
//                 <pre>
//                     <code>{e.stack}</code>
//                 </pre>
//             </div>
//         )
//     }
// }

export interface RenderBlockProps {
    block: Block
}

export default function RenderBlock({block}: RenderBlockProps) {
    if (block.jsx) {
        // If JSX is provided, render it directly
        return <>{block.jsx}</>
    }

    if (block.html && typeof block.html === "string") {
        // If HTML string is provided, parse it
        return <>{parse(block.html)}</>
    }

    // Fallback: nothing to render
    return <div>Invalid block</div>
}
